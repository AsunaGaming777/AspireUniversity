import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

// Webhook event types
interface WebhookEvent {
  type: string
  data: any
  timestamp: string
  signature: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-webhook-signature') || ''
    const webhookSecret = process.env.WEBHOOK_SECRET

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Verify signature
    if (!verifySignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event: WebhookEvent = JSON.parse(body)

    // Store webhook event for audit
    await prisma.webhookEvent.create({
      data: {
        type: event.type,
        payload: event.data,
        signature: event.signature,
        processed: false
      }
    })

    // Process event based on type
    switch (event.type) {
      case 'user.enrolled':
        await handleUserEnrolled(event.data)
        break
      case 'assignment.submitted':
        await handleAssignmentSubmitted(event.data)
        break
      case 'assignment.graded':
        await handleAssignmentGraded(event.data)
        break
      case 'certificate.issued':
        await handleCertificateIssued(event.data)
        break
      case 'affiliate.conversion':
        await handleAffiliateConversion(event.data)
        break
      case 'payout.generated':
        await handlePayoutGenerated(event.data)
        break
      default:
        console.log(`Unknown webhook event type: ${event.type}`)
    }

    // Mark as processed
    await prisma.webhookEvent.updateMany({
      where: { signature: event.signature },
      data: { processed: true, processedAt: new Date() }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleUserEnrolled(data: any) {
  const { userId, courseId, cohortId, timestamp } = data
  
  // Get user's Discord ID if linked
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { cohort: true }
  })

  if (!user?.discordId) return

  // Send Discord notification
  await sendDiscordNotification({
    type: 'user_enrolled',
    userId: user.discordId,
    data: {
      courseId,
      cohortId,
      cohortName: user.cohort?.name,
      timestamp
    }
  })
}

async function handleAssignmentSubmitted(data: any) {
  const { submissionId, userId, assignmentId, url, timestamp } = data
  
  // Get user's Discord ID and assignment details
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: {
      user: true,
      assignment: {
        include: {
          lesson: {
            include: { module: { include: { course: true } } }
          }
        }
      }
    }
  })

  if (!submission?.user?.discordId) return

  // Send Discord notification
  await sendDiscordNotification({
    type: 'assignment_submitted',
    userId: submission.user.discordId,
    data: {
      assignmentTitle: submission.assignment.title,
      courseName: submission.assignment.lesson.module.course.title,
      submissionUrl: url,
      timestamp
    }
  })
}

async function handleAssignmentGraded(data: any) {
  const { submissionId, grade, graderId, notes } = data
  
  // Get submission details
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: {
      user: true,
      assignment: true
    }
  })

  if (!submission?.user?.discordId) return

  // Send Discord notification
  await sendDiscordNotification({
    type: 'assignment_graded',
    userId: submission.user.discordId,
    data: {
      assignmentTitle: submission.assignment.title,
      grade,
      notes,
      timestamp: new Date().toISOString()
    }
  })
}

async function handleCertificateIssued(data: any) {
  const { certificateId, userId, courseId, verificationUrl } = data
  
  // Get user and certificate details
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: true,
      course: true
    }
  })

  if (!certificate?.user?.discordId) return

  // Send Discord notification
  await sendDiscordNotification({
    type: 'certificate_issued',
    userId: certificate.user.discordId,
    data: {
      certificateTitle: certificate.title,
      courseName: certificate.course.title,
      verificationUrl,
      timestamp: new Date().toISOString()
    }
  })
}

async function handleAffiliateConversion(data: any) {
  const { affiliateId, userId, orderId, payoutAmount } = data
  
  // Get affiliate details
  const affiliate = await prisma.affiliate.findUnique({
    where: { id: affiliateId },
    include: { user: true }
  })

  if (!affiliate?.user?.discordId) return

  // Send Discord notification
  await sendDiscordNotification({
    type: 'affiliate_conversion',
    userId: affiliate.user.discordId,
    data: {
      orderId,
      payoutAmount,
      timestamp: new Date().toISOString()
    }
  })
}

async function handlePayoutGenerated(data: any) {
  const { period, csvUrl } = data
  
  // Send notification to admin Discord channel
  await sendDiscordNotification({
    type: 'payout_generated',
    userId: 'admin', // Special channel
    data: {
      period,
      csvUrl,
      timestamp: new Date().toISOString()
    }
  })
}

async function sendDiscordNotification(notification: any) {
  try {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!discordWebhookUrl) return

    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DISCORD_BOT_TOKEN}`
      },
      body: JSON.stringify(notification)
    })

    if (!response.ok) {
      console.error('Failed to send Discord notification:', response.statusText)
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error)
  }
}



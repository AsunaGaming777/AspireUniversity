import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

const WEBHOOK_SECRET = process.env.DISCORD_WEBHOOK_SECRET || 'dev-secret'

/**
 * Discord Webhook Handler
 * Syncs enrollment status with Discord roles
 */
export async function POST(request: Request) {
  try {
    // Verify webhook signature
    const signature = headers().get('x-webhook-signature')
    
    if (signature !== WEBHOOK_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'user.verified':
        await handleUserVerified(data)
        break
      
      case 'user.enrolled':
        await handleUserEnrolled(data)
        break
      
      case 'user.certificate_earned':
        await handleCertificateEarned(data)
        break
      
      default:
        console.warn(`Unknown webhook type: ${type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Discord webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleUserVerified(data: { userId: string; discordId: string; discordUsername: string }) {
  await prisma.user.update({
    where: { id: data.userId },
    data: {
      discordId: data.discordId,
      discordUsername: data.discordUsername,
      discordVerified: true,
    },
  })

  // Send to Discord to assign Student role
  await notifyDiscord({
    action: 'assign_role',
    discordId: data.discordId,
    role: 'Student',
  })
}

async function handleUserEnrolled(data: { userId: string; courseId: string; plan: string }) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  })

  if (!user?.discordId) return

  // Assign course-specific role based on plan
  const role = data.plan === 'mastermind' ? 'Mastermind' : data.plan === 'mastery' ? 'Mastery' : 'Standard'

  await notifyDiscord({
    action: 'assign_role',
    discordId: user.discordId,
    role,
  })
}

async function handleCertificateEarned(data: { userId: string; courseId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  })

  if (!user?.discordId) return

  // Assign Alumni role
  await notifyDiscord({
    action: 'assign_role',
    discordId: user.discordId,
    role: 'Alumni',
  })

  // Post certificate announcement
  await notifyDiscord({
    action: 'post_message',
    channelId: process.env.DISCORD_CERTIFICATES_CHANNEL_ID!,
    message: `🎉 Congratulations to <@${user.discordId}> for earning their certificate!`,
  })
}

async function notifyDiscord(payload: any) {
  if (!process.env.DISCORD_BOT_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured')
    return
  }

  try {
    await fetch(process.env.DISCORD_BOT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error('Failed to notify Discord:', error)
  }
}




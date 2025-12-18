import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { userId, requestType } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (requestType === 'export') {
      return await handleDataExport(userId)
    } else if (requestType === 'delete') {
      return await handleDataDeletion(userId)
    } else {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })
    }

  } catch (error) {
    console.error('GDPR request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleDataExport(userId: string) {
  try {
    // Collect all user data
    const userData = await collectUserData(userId)
    
    // Generate export file
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: userId,
      data: userData
    }

    // Create hash for verification
    const dataHash = createHash('sha256')
      .update(JSON.stringify(exportData))
      .digest('hex')

    // Store export request
    await prisma.gDPRRequest.create({
      data: {
        userId,
        requestType: 'export',
        status: 'completed',
        dataHash,
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Data export completed',
      downloadUrl: `/api/gdpr/download/${dataHash}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

async function handleDataDeletion(userId: string) {
  try {
    // Verify user consent for deletion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learningProfile: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check for active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        userId,
        status: 'active'
      }
    })

    if (activeSubscriptions > 0) {
      return NextResponse.json({
        error: 'Cannot delete account with active subscriptions',
        message: 'Please cancel your subscriptions before requesting account deletion'
      }, { status: 400 })
    }

    // Start deletion process
    await prisma.gDPRRequest.create({
      data: {
        userId,
        requestType: 'deletion',
        status: 'pending',
        requestedAt: new Date()
      }
    })

    // Schedule deletion (30 days grace period)
    await scheduleAccountDeletion(userId)

    return NextResponse.json({
      success: true,
      message: 'Account deletion scheduled',
      deletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })

  } catch (error) {
    console.error('Data deletion error:', error)
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 })
  }
}

async function collectUserData(userId: string) {
  // Collect all user-related data
  const [
    user,
    progress,
    assignments,
    certificates,
    achievements,
    testimonials,
    payments,
    sessions,
    srsCards,
    cohort
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        learningProfile: true,
        affiliate: true
      }
    }),
    prisma.progress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            module: {
              include: { course: true }
            }
          }
        }
      }
    }),
    prisma.assignmentSubmission.findMany({
      where: { userId },
      include: {
        assignment: {
          include: {
            lesson: {
              include: {
                module: {
                  include: { course: true }
                }
              }
            }
          }
        }
      }
    }),
    prisma.certificate.findMany({
      where: { userId },
      include: { course: true }
    }),
    prisma.userAchievement.findMany({
      where: { userId }
    }),
    prisma.testimonial.findMany({
      where: { userId }
    }),
    prisma.payment.findMany({
      where: { userId }
    }),
    prisma.session.findMany({
      where: { userId }
    }),
    prisma.sRSCard.findMany({
      where: { userId }
    }),
    prisma.cohort.findFirst({
      where: {
        users: {
          some: { id: userId }
        }
      }
    })
  ])

  return {
    profile: {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      role: user?.role,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      learningProfile: user?.learningProfile,
      affiliate: user?.affiliate
    },
    progress: progress.map(p => ({
      lessonId: p.lessonId,
      lessonTitle: p.lesson.title,
      moduleTitle: p.lesson.module.title,
      courseTitle: p.lesson.module.course.title,
      completed: p.completed,
      progress: p.progress,
      timeSpent: p.timeSpent,
      lastAccessed: p.lastAccessed
    })),
    assignments: assignments.map(a => ({
      id: a.id,
      assignmentTitle: a.assignment.title,
      content: a.content,
      grade: a.grade,
      feedback: a.feedback,
      submittedAt: a.createdAt
    })),
    certificates: certificates.map(c => ({
      id: c.id,
      title: c.title,
      courseTitle: c.course.title,
      issuedAt: c.issuedAt,
      verificationUrl: c.verificationUrl
    })),
    achievements: achievements.map(a => ({
      id: a.id,
      type: a.type,
      title: a.title,
      description: a.description,
      points: a.points,
      earnedAt: a.createdAt
    })),
    testimonials: testimonials.map(t => ({
      id: t.id,
      name: t.name,
      title: t.title,
      company: t.company,
      content: t.content,
      rating: t.rating,
      earnings: t.earnings,
      createdAt: t.createdAt
    })),
    payments: payments.map(p => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      createdAt: p.createdAt
    })),
    sessions: sessions.map(s => ({
      id: s.id,
      sessionToken: s.sessionToken,
      expires: s.expires,
      createdAt: s.createdAt
    })),
    srsCards: srsCards.map(c => ({
      id: c.id,
      concept: c.concept,
      question: c.question,
      answer: c.answer,
      difficulty: c.difficulty,
      repetitions: c.repetitions,
      nextReview: c.nextReview
    })),
    cohort: cohort ? {
      id: cohort.id,
      name: cohort.name,
      description: cohort.description,
      startDate: cohort.startDate,
      endDate: cohort.endDate
    } : null
  }
}

async function scheduleAccountDeletion(userId: string) {
  // This would integrate with a job queue system
  // For now, just log the scheduled deletion
  console.log(`Account deletion scheduled for user: ${userId}`)
  
  // In a real implementation, you would:
  // 1. Add to job queue with 30-day delay
  // 2. Send confirmation email to user
  // 3. Set up monitoring for the deletion process
}



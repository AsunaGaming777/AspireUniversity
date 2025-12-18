import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Adaptive Learning Engine
export async function POST(request: NextRequest) {
  try {
    const { userId, lessonId, performance } = await request.json()

    // Get user's learning profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learningProfile: true,
        progress: {
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
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update learning profile based on performance
    const updatedProfile = await updateLearningProfile(user.id, performance)
    
    // Generate personalized recommendations
    const recommendations = await generateRecommendations(user.id, performance)
    
    // Update SRS cards if applicable
    if (performance.quizScore !== undefined) {
      await updateSRSCards(user.id, lessonId, performance.quizScore)
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      recommendations,
      nextContent: recommendations.nextLesson
    })

  } catch (error) {
    console.error('Adaptive learning error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function updateLearningProfile(userId: string, performance: any) {
  const { quizScore, timeSpent, engagement } = performance
  
  // Calculate new ability score (0-1)
  const currentProfile = await prisma.learningProfile.findUnique({
    where: { userId }
  })

  const currentAbility = currentProfile?.ability || 0.5
  const currentEngagement = currentProfile?.engagement || 0.5

  // Update ability based on quiz performance
  const abilityDelta = (quizScore - 0.5) * 0.1 // Adjust based on performance
  const newAbility = Math.max(0, Math.min(1, currentAbility + abilityDelta))

  // Update engagement based on time spent and interaction
  const engagementDelta = engagement > 0.7 ? 0.05 : -0.02
  const newEngagement = Math.max(0, Math.min(1, currentEngagement + engagementDelta))

  // Update or create learning profile
  const updatedProfile = await prisma.learningProfile.upsert({
    where: { userId },
    update: {
      ability: newAbility,
      engagement: newEngagement,
      updatedAt: new Date()
    },
    create: {
      userId,
      ability: newAbility,
      engagement: newEngagement
    }
  })

  return updatedProfile
}

async function generateRecommendations(userId: string, performance: any) {
  const { quizScore, timeSpent, engagement } = performance
  
  // Get user's current progress
  const progress = await prisma.progress.findMany({
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
  })

  const completedLessons = progress.filter(p => p.completed)
  const currentModule = completedLessons.length > 0 ? 
    completedLessons[completedLessons.length - 1].lesson.module : null

  // Determine next content based on performance
  let nextLesson = null
  let recommendations = []

  if (quizScore < 0.6) {
    // Low performance - recommend remediation
    recommendations.push({
      type: 'remediation',
      message: 'Consider reviewing the previous lesson or taking additional practice exercises.',
      priority: 'high'
    })
    
    // Find remediation content
    nextLesson = await findRemediationContent(currentModule?.id)
  } else if (quizScore > 0.8 && engagement > 0.7) {
    // High performance - recommend advanced content
    recommendations.push({
      type: 'advanced',
      message: 'Great job! You might be ready for more challenging content.',
      priority: 'medium'
    })
    
    nextLesson = await findAdvancedContent(currentModule?.id)
  } else {
    // Normal progression
    nextLesson = await findNextLesson(currentModule?.id)
  }

  // Add engagement-based recommendations
  if (engagement < 0.5) {
    recommendations.push({
      type: 'engagement',
      message: 'Try taking breaks between lessons or exploring different learning styles.',
      priority: 'medium'
    })
  }

  if (timeSpent < 300) { // Less than 5 minutes
    recommendations.push({
      type: 'time',
      message: 'Consider spending more time on each lesson for better understanding.',
      priority: 'low'
    })
  }

  return {
    nextLesson,
    recommendations,
    learningPath: await generateLearningPath(userId)
  }
}

async function findRemediationContent(moduleId: string | null) {
  if (!moduleId) return null

  // Find easier content in the same module
  return await prisma.lesson.findFirst({
    where: {
      moduleId,
      isPublished: true,
      order: { lt: 3 } // Earlier, easier lessons
    },
    orderBy: { order: 'asc' }
  })
}

async function findAdvancedContent(moduleId: string | null) {
  if (!moduleId) return null

  // Find more advanced content
  return await prisma.lesson.findFirst({
    where: {
      moduleId,
      isPublished: true,
      order: { gt: 5 } // Later, more advanced lessons
    },
    orderBy: { order: 'asc' }
  })
}

async function findNextLesson(moduleId: string | null) {
  if (!moduleId) return null

  // Find the next lesson in sequence
  return await prisma.lesson.findFirst({
    where: {
      moduleId,
      isPublished: true
    },
    orderBy: { order: 'asc' }
  })
}

async function generateLearningPath(userId: string) {
  // Generate personalized learning path based on user's profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { learningProfile: true }
  })

  if (!user?.learningProfile) return []

  const { ability, engagement } = user.learningProfile

  // Adjust learning path based on user's profile
  const learningPath = []
  
  if (ability < 0.3) {
    learningPath.push('Start with fundamentals')
  } else if (ability > 0.7) {
    learningPath.push('Focus on advanced concepts')
  } else {
    learningPath.push('Balanced progression')
  }

  if (engagement < 0.4) {
    learningPath.push('Short, focused sessions')
  } else {
    learningPath.push('Extended learning sessions')
  }

  return learningPath
}

async function updateSRSCards(userId: string, lessonId: string, quizScore: number) {
  // Update Spaced Repetition System cards based on performance
  const cards = await prisma.sRSCard.findMany({
    where: { userId }
  })

  for (const card of cards) {
    const newDifficulty = calculateNewDifficulty(card.difficulty, quizScore)
    const newInterval = calculateNewInterval(card.interval, newDifficulty)
    const newEaseFactor = calculateNewEaseFactor(card.easeFactor, quizScore)

    await prisma.sRSCard.update({
      where: { id: card.id },
      data: {
        difficulty: newDifficulty,
        interval: newInterval,
        easeFactor: newEaseFactor,
        repetitions: card.repetitions + 1,
        nextReview: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
      }
    })
  }
}

function calculateNewDifficulty(currentDifficulty: number, performance: number): number {
  // SM-2 algorithm for difficulty calculation
  if (performance >= 0.6) {
    return Math.max(1, currentDifficulty - 0.1)
  } else {
    return Math.min(5, currentDifficulty + 0.2)
  }
}

function calculateNewInterval(currentInterval: number, difficulty: number): number {
  if (difficulty < 2) return 1
  if (difficulty < 3) return 3
  if (difficulty < 4) return 7
  return 14
}

function calculateNewEaseFactor(currentEaseFactor: number, performance: number): number {
  // SM-2 algorithm for ease factor
  const newEaseFactor = currentEaseFactor + (0.1 - (5 - performance * 5) * (0.08 + (5 - performance * 5) * 0.02))
  return Math.max(1.3, newEaseFactor)
}



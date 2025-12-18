import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const onboardingSchema = z.object({
  goals: z.array(z.string()),
  experienceLevel: z.string(),
  interests: z.array(z.string()),
  timeCommitment: z.string(),
  learningStyle: z.string(),
  currentRole: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = onboardingSchema.parse(body)

    // Map interests to course categories
    const interestToCourses: Record<string, string[]> = {
      business: ['ai-for-business', 'ai-automation'],
      coding: ['ai-for-coding', 'ai-automation', 'advanced-prompt-engineering'],
      design: ['ai-for-design', 'ai-for-creators'],
      security: ['ai-security-osint', 'black-hat-ai', 'dark-ai-ethics'],
      finance: ['ai-finance-trading'],
      automation: ['ai-automation', 'personal-ai-shadow'],
      research: ['ai-research', 'quantum-ai-future-compute'],
      healthcare: ['ai-healthcare-longevity'],
    }

    // Get recommended course slugs based on interests
    const recommendedCourseSlugs = validated.interests.flatMap(
      (interest) => interestToCourses[interest] || []
    )

    // Add foundational courses for beginners
    if (validated.experienceLevel === 'beginner') {
      recommendedCourseSlugs.push('ai-foundations')
    }

    // Get recommended courses from database
    const recommendedCourses = await prisma.course.findMany({
      where: {
        slug: { in: recommendedCourseSlugs },
        published: true,
      },
      select: { id: true, slug: true },
    })

    // Determine recommended plan based on goals and time commitment
    let recommendedPlan = 'standard'
    if (validated.goals.includes('start-business') || validated.goals.includes('career-change')) {
      recommendedPlan = 'mastery'
    }
    if (validated.timeCommitment === '13+') {
      recommendedPlan = 'mastermind'
    }

    // Create or update student profile with onboarding data
    await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        currentLevel: validated.experienceLevel,
        learningGoals: validated.goals.join(', '),
        preferredTopics: validated.interests.join(', '),
        timeCommitment: parseInt(validated.timeCommitment.split('-')[0]) || null,
        notificationSettings: {
          learningStyle: validated.learningStyle,
          recommendedPlan,
          recommendedCourses: recommendedCourses.map((c) => c.slug),
        },
      },
      create: {
        userId: session.user.id,
        currentLevel: validated.experienceLevel,
        learningGoals: validated.goals.join(', '),
        preferredTopics: validated.interests.join(', '),
        timeCommitment: parseInt(validated.timeCommitment.split('-')[0]) || null,
        accessibilityNeeds: '',
        notificationSettings: {
          learningStyle: validated.learningStyle,
          recommendedPlan,
          recommendedCourses: recommendedCourses.map((c) => c.slug),
        },
      },
    })

    return NextResponse.json({
      success: true,
      recommendedPlan,
      recommendedCourses: recommendedCourses.map((c) => c.slug),
    })
  } catch (error) {
    console.error('Onboarding error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}


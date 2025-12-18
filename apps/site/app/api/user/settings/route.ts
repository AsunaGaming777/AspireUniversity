import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const settingsSchema = z.object({
  name: z.string().min(2).optional(),
  timezone: z.string().optional().nullable(),
  age: z.coerce.number().min(13).max(120).optional().nullable(),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional().nullable(),
  learningGoals: z.string().optional().nullable(),
  preferredTopics: z.string().optional().nullable(),
  timeCommitment: z.coerce.number().min(1).optional().nullable(),
  publicProfile: z.boolean().optional(),
  showOnLeaderboard: z.boolean().optional(),
  optInCaseStudy: z.boolean().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = settingsSchema.parse(body)

    // Update user
    const updateData: any = {}
    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.timezone !== undefined) updateData.timezone = validated.timezone
    if (validated.age !== undefined) updateData.age = validated.age
    if (validated.publicProfile !== undefined) updateData.publicProfile = validated.publicProfile
    if (validated.showOnLeaderboard !== undefined) updateData.showOnLeaderboard = validated.showOnLeaderboard
    if (validated.optInCaseStudy !== undefined) updateData.optInCaseStudy = validated.optInCaseStudy

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    // Update or create student profile
    const studentProfileData: any = {}
    if (validated.currentLevel !== undefined) studentProfileData.currentLevel = validated.currentLevel
    if (validated.learningGoals !== undefined) studentProfileData.learningGoals = validated.learningGoals
    if (validated.preferredTopics !== undefined) studentProfileData.preferredTopics = validated.preferredTopics
    if (validated.timeCommitment !== undefined) studentProfileData.timeCommitment = validated.timeCommitment

    if (Object.keys(studentProfileData).length > 0) {
      await prisma.studentProfile.upsert({
        where: { userId: session.user.id },
        update: studentProfileData,
        create: {
          userId: session.user.id,
          ...studentProfileData,
          learningGoals: validated.learningGoals || '',
          preferredTopics: validated.preferredTopics || '',
          accessibilityNeeds: '',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings update error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}


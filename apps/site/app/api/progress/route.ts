import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lessonId, completed, progress, timeSpent } = await request.json()

    // Upsert progress
    const progressRecord = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed: completed ?? undefined,
        progress: progress ?? undefined,
        timeSpent: timeSpent ? { increment: timeSpent } : undefined,
        lastAccessed: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed: completed ?? false,
        progress: progress ?? 0,
        timeSpent: timeSpent ?? 0,
      },
    })

    return NextResponse.json({ success: true, progress: progressRecord })
  } catch (error) {
    console.error('Progress tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

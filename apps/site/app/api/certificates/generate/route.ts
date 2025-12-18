import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { issueCertificate } from '@/lib/certificate'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await request.json()

    // Verify user has completed all lessons in the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id))

    const completedLessons = await prisma.progress.count({
      where: {
        userId: session.user.id,
        lessonId: { in: allLessonIds },
        completed: true,
      },
    })

    if (completedLessons < allLessonIds.length) {
      return NextResponse.json(
        { error: 'Course not completed yet', progress: `${completedLessons}/${allLessonIds.length}` },
        { status: 400 }
      )
    }

    // Issue certificate
    const certificate = await issueCertificate(session.user.id, courseId)

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificate.id,
        verificationCode: certificate.verificationCode,
        pdfUrl: certificate.pdfUrl,
      },
    })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




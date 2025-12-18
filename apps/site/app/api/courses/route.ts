import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    
    const courses = await prisma.course.findMany({
      where: { published: true },
      include: {
        modules: {
          include: {
            lessons: {
              where: { published: true },
              select: {
                id: true,
                title: true,
                order: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        enrollments: session?.user ? {
          where: { userId: session.user.id },
        } : false,
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


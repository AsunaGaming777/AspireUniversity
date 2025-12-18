import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/zip',
  'text/plain',
  'image/png',
  'image/jpeg',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const assignmentId = formData.get('assignmentId') as string
    const content = formData.get('content') as string
    const file = formData.get('file') as File | null

    if (!assignmentId) {
      return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 })
    }

    // Validate file if provided
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
      }
    }

    // Save file if provided
    let fileUrl: string | null = null
    let fileName: string | null = null
    let fileSize: number | null = null

    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      fileName = `${Date.now()}-${file.name}`
      const uploadPath = join(process.cwd(), 'public', 'uploads', 'assignments', fileName)

      // Save file
      await writeFile(uploadPath, buffer)
      fileUrl = `/uploads/assignments/${fileName}`
      fileSize = file.size
    }

    // Create or update submission
    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_userId: {
          assignmentId,
          userId: session.user.id,
        },
      },
      update: {
        content,
        fileUrl,
        fileName,
        fileSize,
        mimeType: file?.type,
        status: 'submitted',
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        userId: session.user.id,
        content,
        fileUrl,
        fileName,
        fileSize,
        mimeType: file?.type,
        status: 'submitted',
        submittedAt: new Date(),
      },
    })

    // Notify Discord
    await fetch(`${process.env.NEXTAUTH_URL}/api/discord/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': process.env.DISCORD_WEBHOOK_SECRET || 'dev-secret',
      },
      body: JSON.stringify({
        type: 'assignment.submitted',
        data: {
          userId: session.user.id,
          assignmentId,
          submissionId: submission.id,
        },
      }),
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
    })
  } catch (error) {
    console.error('Assignment submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




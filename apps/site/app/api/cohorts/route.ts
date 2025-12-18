import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock cohort data for now
    const cohorts = [
      {
        id: '1',
        name: 'AI Mastery Cohort #12',
        description: 'January 2025 cohort',
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        maxStudents: 50,
        currentStudents: 32,
        isActive: true,
        course: {
          title: 'AI Mastery Complete',
          description: 'Full AI curriculum',
        },
        mentors: [
          { id: '1', name: 'The Overseer', role: 'Lead Instructor' },
          { id: '2', name: 'Alex Chen', role: 'AI Engineer' },
        ],
        sessions: [],
        leaderboard: [
          { userId: '1', name: 'John Doe', points: 1250, rank: 1 },
          { userId: '2', name: 'Jane Smith', points: 1100, rank: 2 },
          { userId: '3', name: 'Bob Johnson', points: 950, rank: 3 },
        ],
      },
    ]

    return NextResponse.json({ cohorts })
  } catch (error) {
    console.error('Cohorts API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


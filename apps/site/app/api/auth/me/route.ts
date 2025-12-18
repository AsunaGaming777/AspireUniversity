import { NextResponse } from 'next/server'

export async function GET() {
  // Mock user data for demo purposes
  const user = {
    id: '1',
    email: 'demo@aspire.ai',
    name: 'Demo User',
    role: 'student' as const,
    subscription: {
      status: 'active' as const,
      plan: 'standard' as const,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
    progress: {
      completedLessons: ['lesson-0-1', 'lesson-0-2'],
      certificates: [],
      currentModule: 0,
    }
  }

  return NextResponse.json(user)
}


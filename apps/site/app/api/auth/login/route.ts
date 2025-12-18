import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock authentication for demo purposes
    if (email === 'demo@aspire.ai' && password === 'demo123') {
      const user = {
        id: '1',
        email: 'demo@aspire.ai',
        name: 'Demo User',
        role: 'student' as const,
        subscription: {
          status: 'active' as const,
          plan: 'standard' as const,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        progress: {
          completedLessons: ['lesson-0-1', 'lesson-0-2'],
          certificates: [],
          currentModule: 0,
        }
      }

      return NextResponse.json(user)
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}


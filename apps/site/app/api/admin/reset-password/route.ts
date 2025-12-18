import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * API endpoint to reset password for a specific user
 * This is a temporary admin endpoint for password resets
 */
export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and newPassword are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    console.log(`🔐 Resetting password for ${email}...`)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: `User with email ${email} not found` },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    console.log(`✅ Password reset successfully for ${email}`)

    return NextResponse.json({
      success: true,
      message: `Password reset successfully for ${email}`,
      email: user.email,
    })
  } catch (error: any) {
    console.error('❌ Error resetting password:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to reset password',
      },
      { status: 500 }
    )
  }
}



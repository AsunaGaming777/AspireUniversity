import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'azer.kasim@icloud.com'
  const newPassword = process.argv[2] || 'TempPassword123!' // Default password if not provided

  if (!newPassword || newPassword.length < 8) {
    console.error('❌ Password must be at least 8 characters long')
    console.log('Usage: npx tsx scripts/reset-password.ts <new-password>')
    process.exit(1)
  }

  console.log(`🔐 Resetting password for ${email}...`)

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      process.exit(1)
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    console.log(`✅ Password reset successfully for ${email}`)
    console.log(`   New password: ${newPassword}`)
    console.log(`   Please change this password after logging in!`)
  } catch (error) {
    console.error('❌ Error resetting password:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

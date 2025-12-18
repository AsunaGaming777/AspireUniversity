import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })
dotenv.config({ path: resolve(__dirname, '../.env') })

// Fix database URL to use direct connection (5432) instead of pooler (6543)
function fixDatabaseUrl() {
  const originalUrl = process.env.DATABASE_URL || ''
  
  if (!originalUrl) {
    throw new Error('DATABASE_URL is not set')
  }
  
  // For Supabase: ALWAYS use direct connection (5432) when pooler (6543) is specified
  if (originalUrl.includes('supabase.co')) {
    let fixedUrl = originalUrl
    
    // Replace pooler port (6543) with direct port (5432)
    if (originalUrl.includes(':6543')) {
      fixedUrl = originalUrl.replace(':6543', ':5432')
      // Also remove pgbouncer parameter if present
      fixedUrl = fixedUrl.replace(/[?&]pgbouncer=true/g, '')
      fixedUrl = fixedUrl.replace(/[?&]connection_limit=\d+/g, '')
      
      process.env.DATABASE_URL = fixedUrl
      console.log('🔧 Switched to direct database connection (port 5432)')
    }
    
    // Ensure DIRECT_URL is set to direct connection
    if (!process.env.DIRECT_URL || process.env.DIRECT_URL.includes(':6543')) {
      process.env.DIRECT_URL = fixedUrl
    }
  } else {
    // For non-Supabase, ensure DIRECT_URL is set
    if (!process.env.DIRECT_URL) {
      process.env.DIRECT_URL = process.env.DATABASE_URL
    }
  }
}

// Apply URL fixes BEFORE Prisma client initialization
fixDatabaseUrl()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  const email = 'azer.kasim@icloud.com'
  const targetRole = 'overseer' // Highest role in the system

  console.log(`🔐 Granting ${targetRole} role to ${email}...`)

  try {
    // First, check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true, name: true },
    })

    if (!existingUser) {
      console.log(`❌ User with email ${email} not found. Creating new user...`)
      
      // Create the user if they don't exist
      const newUser = await prisma.user.create({
        data: {
          email,
          role: targetRole,
          name: 'Azer Kasim',
          emailVerified: new Date(),
        },
      })
      
      console.log(`✅ Created new user with ${targetRole} role:`)
      console.log(`   ID: ${newUser.id}`)
      console.log(`   Email: ${newUser.email}`)
      console.log(`   Role: ${newUser.role}`)
    } else {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: targetRole },
        select: { id: true, email: true, role: true, name: true },
      })

      console.log(`✅ Updated user role:`)
      console.log(`   ID: ${updatedUser.id}`)
      console.log(`   Email: ${updatedUser.email}`)
      console.log(`   Old Role: ${existingUser.role}`)
      console.log(`   New Role: ${updatedUser.role}`)
    }

    // Verify the update
    const verifiedUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true },
    })

    if (verifiedUser?.role === targetRole) {
      console.log(`\n✅ Success! ${email} now has ${targetRole} role.`)
    } else {
      console.log(`\n⚠️  Warning: Role update may have failed. Current role: ${verifiedUser?.role}`)
    }
  } catch (error) {
    console.error('❌ Error updating user role:', error)
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

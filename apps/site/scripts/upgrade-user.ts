import { PrismaClient, UserRole, SubscriptionPlan } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'azer.kasim@icloud.com'
  
  console.log(`🔍 Looking for user with email: ${email}`)
  
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.error(`❌ User not found!`)
    process.exit(1)
  }

  console.log(`✅ User found: ${user.name} (${user.id})`)
  console.log(`Current Role: ${user.role}`)

  // 1. Upgrade Role to Overseer
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      role: UserRole.overseer,
    },
  })
  console.log(`✨ Role upgraded to: ${updatedUser.role}`)

  // 2. Grant Mastermind Subscription
  // Check if subscription exists
  const existingSubscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
  })

  if (existingSubscription) {
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        plan: SubscriptionPlan.mastermind,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // 100 years
      },
    })
    console.log(`✨ Updated existing subscription to MASTERMIND`)
  } else {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: SubscriptionPlan.mastermind,
        status: 'active',
        stripeCustomerId: `cus_manual_${user.id}`, // Placeholder
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // 100 years
      },
    })
    console.log(`✨ Created new MASTERMIND subscription`)
  }

  console.log(`🚀 Success! ${email} is now an Overseer with Mastermind access.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


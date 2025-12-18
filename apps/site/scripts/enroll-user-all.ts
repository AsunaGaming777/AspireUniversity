import { PrismaClient, SubscriptionPlan, EnrollmentStatus } from '@prisma/client'

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

  // Fetch all courses
  const courses = await prisma.course.findMany()
  console.log(`📚 Found ${courses.length} courses. Enrolling user in all of them...`)

  let enrolledCount = 0

  for (const course of courses) {
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    })

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          plan: SubscriptionPlan.mastermind,
          status: EnrollmentStatus.active,
          accessGrantedAt: new Date(),
          modulesUnlocked: 'ALL', // Or some logic to unlock everything
          lessonsCompleted: '[]',
        },
      })
      console.log(`   + Enrolled in: ${course.title}`)
      enrolledCount++
    } else {
      // Ensure it's active and mastermind
      await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: {
          status: EnrollmentStatus.active,
          plan: SubscriptionPlan.mastermind,
          modulesUnlocked: 'ALL', 
        },
      })
      console.log(`   ~ Updated enrollment for: ${course.title}`)
    }
  }

  console.log(`🚀 Success! User enrolled in ${courses.length} courses (${enrolledCount} new).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


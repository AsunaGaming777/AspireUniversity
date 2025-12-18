import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'azer.kasim@icloud.com'
  
  console.log(`🔍 Inspecting user: ${email}`)
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      enrollments: {
        include: {
          course: true
        }
      }
    }
  })

  if (!user) {
    console.error(`❌ User not found!`)
    process.exit(1)
  }

  console.log(`✅ User found: ${user.name} (${user.id})`)
  console.log(`   Role: ${user.role}`)
  console.log(`   Enrollment count: ${user.enrollments.length}`)
  
  user.enrollments.forEach(e => {
    console.log(`   - Course: ${e.course.slug} | Status: ${e.status} | Plan: ${e.plan}`)
  })

  const courses = await prisma.course.findMany()
  console.log(`\n📚 Total courses in DB: ${courses.length}`)
  
  // Check for courses NOT enrolled
  const enrolledCourseIds = user.enrollments.map(e => e.courseId)
  const notEnrolled = courses.filter(c => !enrolledCourseIds.includes(c.id))
  
  if (notEnrolled.length > 0) {
    console.log(`⚠️ User is NOT enrolled in ${notEnrolled.length} courses:`)
    notEnrolled.forEach(c => console.log(`   - ${c.slug}`))
  } else {
    console.log(`✨ User is enrolled in ALL courses.`)
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


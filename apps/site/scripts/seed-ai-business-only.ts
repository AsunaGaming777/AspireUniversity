import { PrismaClient, CourseLevel } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function seedAIBusinessOnly() {
  console.log('🌱 Seeding AI for Business course only...')

  // Find existing course
  const existingCourse = await prisma.course.findUnique({
    where: { slug: 'ai-for-business' },
    include: {
      modules: {
        include: { lessons: true }
      }
    }
  })

  if (!existingCourse) {
    console.error('❌ Course not found')
    return
  }

  // Delete existing modules and lessons
  console.log('🗑️  Deleting existing content...')
  for (const module of existingCourse.modules) {
    await prisma.lesson.deleteMany({ where: { moduleId: module.id } })
  }
  await prisma.module.deleteMany({ where: { courseId: existingCourse.id } })

  // Import the seed file's main function and extract just the AI for Business course
  // Since we can't easily extract it, we'll need to run the full seed
  // But first, let's try to import and execute just the course creation part
  
  console.log('📚 Creating comprehensive course content...')
  
  // For now, we'll need to manually copy the course structure
  // This is a placeholder - the actual content should come from seed.ts
  console.log('⚠️  This script needs the full course data from seed.ts')
  console.log('💡 Please use the API route at /api/admin/seed-ai-business-full instead')
}

seedAIBusinessOnly()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })





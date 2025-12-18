import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CourseGrid } from '@/components/courses/CourseGrid'
import { redirect } from 'next/navigation'
import { isAdminRole } from '@aspire/lib'

export const metadata = {
  title: 'Courses - Aspire Academy',
  description: 'Master AI across all industries with our comprehensive course library',
}

export default async function CoursesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/courses')
  }

  // Fetch user with role, subscriptions, and payments to check access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        where: {
          status: {
            in: ['active', 'trialing'],
          },
          currentPeriodEnd: {
            gte: new Date(),
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      payments: {
        where: {
          status: 'succeeded',
          plan: {
            in: ['mastermind', 'mastery', 'standard'],
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!user) {
    redirect('/auth/signin?callbackUrl=/courses')
  }

  const hasAdminAccess = isAdminRole(user.role)
  const activeSubscription = user.subscriptions.find(
    (sub) => 
      (sub.status === 'active' || sub.status === 'trialing') && 
      sub.currentPeriodEnd >= new Date()
  )
  const hasSuccessfulPayment = user.payments.length > 0

  // Fetch all courses
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      modules: {
        include: {
          lessons: {
            where: { published: true },
          },
        },
      },
      enrollments: {
        where: { userId: session.user.id },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Get all lesson IDs for progress calculation
  const allLessonIds = courses.flatMap(course =>
    course.modules.flatMap(module => module.lessons.map(lesson => lesson.id))
  )

  // Fetch user's progress for all lessons
  const userProgress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      lessonId: { in: allLessonIds },
      completed: true,
    },
    select: { lessonId: true },
  })

  const completedLessonIds = new Set(userProgress.map(p => p.lessonId))

  // Calculate progress for each course and determine access
  const coursesWithProgress = courses.map((course) => {
    const enrollment = course.enrollments[0]
    
    // Check if user has access via admin role, subscription, payment, or enrollment
    const coursePlans = course.plans.split(',').map(p => p.trim())
    const subscriptionMatchesCourse = activeSubscription 
      ? coursePlans.includes(activeSubscription.plan)
      : false
    const paymentPlan = user.payments[0]?.plan
    const paymentMatchesCourse = hasSuccessfulPayment && paymentPlan
      ? coursePlans.includes(paymentPlan)
      : false
    
    // User has access if: admin, enrolled, has matching subscription, or has matching payment
    const hasAccess = hasAdminAccess || 
                     !!enrollment || 
                     (!!activeSubscription && subscriptionMatchesCourse) ||
                     paymentMatchesCourse
    
    // Count lessons from modules (already filtered by published: true in query)
    const totalLessons = course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    )
    const courseLessonIds = course.modules.flatMap(module =>
      module.lessons.map(lesson => lesson.id)
    )
    const completedLessons = courseLessonIds.filter(id => completedLessonIds.has(id)).length
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    return {
      ...course,
      isEnrolled: hasAccess, // Use hasAccess instead of just enrollment check
      progress: Math.round(progress),
      totalLessons,
      completedLessons,
    }
  })

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-display font-bold mb-4 text-white">
            <span className="gradient-text">AI Mastery</span> Curriculum
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive modules designed to take you from beginner to expert
          </p>
        </div>

        {/* Course Grid */}
        <CourseGrid courses={coursesWithProgress} />
      </div>
    </div>
  )
}
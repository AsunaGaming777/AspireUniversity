import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { CoursePlayer } from '@/components/courses/CoursePlayer'
import { isAdminRole } from '@aspire/lib'

export default async function CoursePage({
  params,
}: {
  params: { slug: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/courses/${params.slug}`)
  }

  // Fetch user with role, subscriptions, and payments
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        where: {
          status: {
            in: ['active', 'trialing'], // Allow both active and trialing subscriptions
          },
          currentPeriodEnd: {
            gte: new Date(), // Subscription must not be expired
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
    redirect(`/auth/signin?callbackUrl=/courses/${params.slug}`)
  }

  // Fetch course with all modules and lessons
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      modules: {
        include: {
          lessons: {
            where: { published: true },
            include: {
              assets: true,
              quizzes: {
                include: {
                  questions: {
                    include: {
                      options: true,
                    },
                  },
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
      enrollments: {
        where: { userId: session.user.id },
      },
    },
  })

  if (!course) {
    notFound()
  }

  // Check access: overseer/admin roles or active subscription bypass enrollment
  // IMPORTANT: Use database role, not session role, to ensure we have the latest role
  const userRole = user.role as string
  const hasAdminAccess = isAdminRole(userRole as any)
  
  // Check if user has an active, non-expired subscription
  const activeSubscription = user.subscriptions.find(
    (sub) => 
      (sub.status === 'active' || sub.status === 'trialing') && 
      sub.currentPeriodEnd >= new Date()
  )
  
  // Check if the subscription plan matches the course's allowed plans
  const coursePlans = course.plans.split(',').map(p => p.trim())
  const subscriptionMatchesCourse = activeSubscription 
    ? coursePlans.includes(activeSubscription.plan)
    : false
  
  // Also check payments as fallback (in case subscription isn't in Subscription table)
  const hasSuccessfulPayment = user.payments.length > 0
  const paymentPlan = user.payments[0]?.plan
  const paymentMatchesCourse = hasSuccessfulPayment && paymentPlan
    ? coursePlans.includes(paymentPlan)
    : false
  
  const hasActiveSubscription = (!!activeSubscription && subscriptionMatchesCourse) || paymentMatchesCourse
  let enrollment = course.enrollments[0]

  // Grant access if: admin role, active subscription (matching course plans), successful payment, or enrolled
  // Overseer/admin ALWAYS has access regardless of subscription or enrollment
  if (!hasAdminAccess && !hasActiveSubscription && !enrollment) {
    redirect('/pricing')
  }

  // Create a virtual enrollment for admin/subscription users if they don't have one
  // This ensures CoursePlayer component works correctly
  if (!enrollment && (hasAdminAccess || hasActiveSubscription)) {
    const subscriptionPlan = activeSubscription
      ? activeSubscription.plan 
      : (paymentPlan || 'mastermind') // Use payment plan or default to highest plan for admins
    
    enrollment = {
      id: 'virtual-enrollment',
      userId: user.id,
      courseId: course.id,
      plan: subscriptionPlan,
      status: 'active' as const,
      accessGrantedAt: new Date(),
      accessRevokedAt: null,
      modulesUnlocked: '',
      lessonsCompleted: '',
      discordRolesSynced: false,
      discordSyncedAt: null,
      paymentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  // Get user progress
  const progress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      lessonId: {
        in: course.modules.flatMap((m) => m.lessons.map((l) => l.id)),
      },
    },
  })

  return (
    <CoursePlayer
      course={course}
      enrollment={enrollment}
      progress={progress}
      userId={session.user.id}
    />
  )
}

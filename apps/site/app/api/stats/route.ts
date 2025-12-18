import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get total users - count ALL users including test users
    // Early adopters = anyone who signed up (real users + test users)
    // This makes more sense for "early adopters" - anyone who joined, not just paid users
    const totalUsers = await prisma.user.count() // Includes all users: real, test, admin, etc.

    // Early adopters: Start at 500 minimum, then show real count
    // If we have 7 real users, show 500+. If we have 501 real users, show 501+
    // Test users ARE included in this count
    const earlyAdopters = Math.max(500, totalUsers)
    
    // Also get count of users with subscriptions for other stats
    const usersWithSubscriptions = await prisma.user.count({
      where: {
        OR: [
          {
            subscriptions: {
              some: {},
            },
          },
          {
            payments: {
              some: {
                status: 'succeeded',
              },
            },
          },
          {
            enrollments: {
              some: {
                status: 'active',
              },
            },
          },
        ],
      },
    })

    // Debug: Check subscription counts
    const subscriptionCount = await prisma.subscription.count()
    const activeSubscriptionCount = await prisma.subscription.count({ where: { status: 'active' } })
    console.log(`📊 Stats: ${totalUsers} total users (${usersWithSubscriptions} with subscriptions/payments/enrollments, ${subscriptionCount} total subscriptions, ${activeSubscriptionCount} active)`)

    // Get total enrollments
    const totalEnrollments = await prisma.enrollment.count({
      where: {
        status: 'active',
      },
    })

    // Calculate completion rate from progress
    const totalProgress = await prisma.progress.count()
    const completedProgress = await prisma.progress.count({
      where: {
        completed: true,
      },
    })
    const completionRate = totalProgress > 0 
      ? Math.round((completedProgress / totalProgress) * 100)
      : 95 // Default to 95% if no data

    // Get average rating from testimonials or reviews if available
    // For now, we'll use a default of 4.9 but this can be calculated from actual reviews
    const averageRating = 4.9

    // Calculate total lessons and modules from courses
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    })

    const totalLessons = courses.reduce(
      (sum, course) =>
        sum + course.modules.reduce(
          (moduleSum, module) => moduleSum + module.lessons.length,
          0
        ),
      0
    )

    const totalModules = courses.reduce(
      (sum, course) => sum + course.modules.length,
      0
    )

    // Get total certificates issued
    const totalCertificates = await prisma.certificate.count()

    return NextResponse.json({
      earlyAdopters,
      totalUsers,
      totalEnrollments,
      completionRate,
      averageRating,
      totalLessons,
      totalModules,
      totalCertificates,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return default values on error
    return NextResponse.json({
      earlyAdopters: 500,
      totalUsers: 500,
      totalEnrollments: 0,
      completionRate: 95,
      averageRating: 4.9,
      totalLessons: 0,
      totalModules: 0,
      totalCertificates: 0,
    })
  }
}



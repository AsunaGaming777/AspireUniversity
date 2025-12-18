import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentProgress } from '@/components/dashboard/RecentProgress'
import { ContinueLearning } from '@/components/dashboard/ContinueLearning'
import { RecommendedCourses } from '@/components/dashboard/RecommendedCourses'
import { OnboardingPrompt } from '@/components/dashboard/OnboardingPrompt'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { AchievementsDisplay } from '@/components/dashboard/AchievementsDisplay'
import { EnrolledCoursesOverview } from '@/components/dashboard/EnrolledCoursesOverview'
import { MotivationalMessage } from '@/components/dashboard/MotivationalMessage'
import { WeeklyProgressChart } from '@/components/dashboard/WeeklyProgressChart'
import { LearningInsights } from '@/components/dashboard/LearningInsights'
import { StreakCalendar } from '@/components/dashboard/StreakCalendar'
import { RecentCertificates } from '@/components/dashboard/RecentCertificates'

export const metadata = {
  title: 'Dashboard - Aspire Academy',
  description: 'Track your AI mastery progress',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  // Fetch user data with enrollments and progress
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              modules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
        },
      },
      progress: {
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: {
                    select: {
                      id: true,
                      slug: true,
                      title: true,
                      thumbnail: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          lastAccessed: 'desc',
        },
        take: 5,
      },
      certificates: {
        orderBy: {
          issuedAt: 'desc',
        },
      },
      achievements: true,
      studentProfile: true,
    },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding = user.studentProfile?.notificationSettings !== null

  // Calculate stats
  const totalLessons = user.enrollments.reduce(
    (sum, enrollment) =>
      sum + enrollment.course.modules.reduce(
        (moduleSum, module) => moduleSum + module.lessons.length,
        0
      ),
    0
  )

  const completedLessons = user.progress.filter((p) => p.completed).length
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const totalTimeSpent = user.progress.reduce((sum, p) => sum + p.timeSpent, 0)

  // Find current streak
  const currentStreak = await calculateStreak(user.id)

  // Calculate weekly progress data
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  weekAgo.setHours(0, 0, 0, 0)

  const weeklyProgress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      lastAccessed: { gte: weekAgo },
    },
    select: {
      completed: true,
      timeSpent: true,
      lastAccessed: true,
    },
  })

  // Group by date
  const progressByDate = new Map<string, { lessonsCompleted: number; timeSpent: number }>()
  const learningDays = new Set<string>()

  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const dateStr = date.toISOString().split('T')[0]
    progressByDate.set(dateStr, { lessonsCompleted: 0, timeSpent: 0 })
  }

  // Aggregate progress
  weeklyProgress.forEach((p) => {
    const date = new Date(p.lastAccessed)
    date.setHours(0, 0, 0, 0)
    const dateStr = date.toISOString().split('T')[0]
    
    if (progressByDate.has(dateStr)) {
      const dayData = progressByDate.get(dateStr)!
      if (p.completed) {
        dayData.lessonsCompleted++
      }
      dayData.timeSpent += p.timeSpent
      learningDays.add(dateStr)
    }
  })

  const weeklyProgressData = Array.from(progressByDate.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Calculate learning insights
  const weeklyTimeSpent = weeklyProgress.reduce((sum, p) => sum + p.timeSpent, 0)
  const averageSessionTime = weeklyProgress.length > 0 
    ? weeklyTimeSpent / weeklyProgress.length 
    : 0

  // Find best learning day
  let bestLearningDay: string | null = null
  let maxLessons = 0
  weeklyProgressData.forEach((day) => {
    if (day.lessonsCompleted > maxLessons) {
      maxLessons = day.lessonsCompleted
      bestLearningDay = format(new Date(day.date), 'EEEE') // Full weekday name
    }
  })

  // Get all learning days for calendar (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const allProgress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      lastAccessed: { gte: thirtyDaysAgo },
    },
    select: {
      lastAccessed: true,
    },
  })

  const allLearningDays = new Set<string>()
  allProgress.forEach((p) => {
    const date = new Date(p.lastAccessed)
    date.setHours(0, 0, 0, 0)
    allLearningDays.add(date.toISOString().split('T')[0])
  })

  // Get enrolled courses with progress
  const enrolledCoursesWithProgress = await Promise.all(
    user.enrollments.map(async (enrollment) => {
      const course = enrollment.course
      const courseLessonIds = course.modules.flatMap(module =>
        module.lessons.map(lesson => lesson.id)
      )
      const completedCount = user.progress.filter(
        p => p.completed && courseLessonIds.includes(p.lessonId)
      ).length
      const progress = courseLessonIds.length > 0 
        ? Math.round((completedCount / courseLessonIds.length) * 100) 
        : 0

      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        thumbnail: course.thumbnail,
        level: course.level,
        progress,
        totalLessons: courseLessonIds.length,
        completedLessons: completedCount,
      }
    })
  )

  // Get recommended courses based on onboarding data
  let recommendedCourses: any[] = []
  let recommendedPlan: string | undefined
  const enrolledCourseIds = new Set(user.enrollments.map((e) => e.courseId))

  if (user.studentProfile?.notificationSettings) {
    const settings = user.studentProfile.notificationSettings as any
    recommendedPlan = settings.recommendedPlan
    const recommendedSlugs = settings.recommendedCourses || []

    if (recommendedSlugs.length > 0) {
      recommendedCourses = await prisma.course.findMany({
        where: {
          slug: { in: recommendedSlugs },
          published: true,
          id: { notIn: Array.from(enrolledCourseIds) }, // Don't recommend already enrolled courses
        },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          level: true,
        },
        take: 3,
      })
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-display font-bold mb-2 text-white">
            Welcome back, <span className="gradient-text">{user.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Continue your AI mastery journey
          </p>
        </div>

        {/* Motivational Message - Moved higher */}
        {hasCompletedOnboarding && (
          <div className="mb-6">
            <MotivationalMessage streak={currentStreak} completionRate={completionRate} />
          </div>
        )}

        {/* Onboarding Prompt */}
        {!hasCompletedOnboarding && <OnboardingPrompt />}

        {/* Stats */}
        <DashboardStats
          totalLessons={totalLessons}
          completedLessons={completedLessons}
          timeSpent={totalTimeSpent}
          streak={currentStreak}
          certificates={user.certificates.length}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ContinueLearning progress={user.progress} />
            
            {enrolledCoursesWithProgress.length > 0 && (
              <EnrolledCoursesOverview courses={enrolledCoursesWithProgress} />
            )}

            {/* Weekly Progress Chart */}
            {hasCompletedOnboarding && (
              <WeeklyProgressChart progressData={weeklyProgressData} />
            )}

            {/* Learning Insights */}
            {hasCompletedOnboarding && weeklyTimeSpent > 0 && (
              <LearningInsights
                weeklyTimeSpent={weeklyTimeSpent}
                averageSessionTime={averageSessionTime}
                bestLearningDay={bestLearningDay}
                completionRate={completionRate}
                streak={currentStreak}
              />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Streak Calendar */}
            {hasCompletedOnboarding && (
              <StreakCalendar streak={currentStreak} learningDays={allLearningDays} />
            )}
            
            <RecentProgress progress={user.progress.slice(0, 5)} />
            
            {user.achievements.length > 0 && (
              <AchievementsDisplay achievements={user.achievements} />
            )}

            {user.certificates.length > 0 && (
              <RecentCertificates certificates={user.certificates.slice(0, 3)} />
            )}
            
            {recommendedCourses.length > 0 && (
              <RecommendedCourses courses={recommendedCourses} recommendedPlan={recommendedPlan} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

async function calculateStreak(userId: string): Promise<number> {
  const progress = await prisma.progress.findMany({
    where: { userId },
    orderBy: { lastAccessed: 'desc' },
    select: { lastAccessed: true },
  })

  if (progress.length === 0) return 0

  let streak = 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < progress.length - 1; i++) {
    const current = new Date(progress[i].lastAccessed)
    const next = new Date(progress[i + 1].lastAccessed)
    
    current.setHours(0, 0, 0, 0)
    next.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      streak++
    } else if (diffDays > 1) {
      break
    }
  }

  return streak
}
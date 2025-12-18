'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@prisma/client'

const OWNER_EMAIL = 'azer.kasim@icloud.com'

async function checkOwnerAccess() {
  const session = await auth()
  if (!session || typeof session !== 'object' || !('user' in session)) {
    throw new Error('Unauthorized: Only the owner can perform this action.')
  }
  const sessionWithUser = session as { user?: { email?: string } }
  if (!sessionWithUser.user?.email || sessionWithUser.user.email !== OWNER_EMAIL) {
    throw new Error('Unauthorized: Only the owner can perform this action.')
  }
}

// Bulk Operations
export async function bulkUpdateRoles(userIds: string[], newRole: UserRole) {
  await checkOwnerAccess()
  
  try {
    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { role: newRole },
    })
    revalidatePath('/admin/owner')
    return { success: true, message: `Updated ${userIds.length} users to ${newRole}` }
  } catch (error) {
    return { success: false, message: 'Failed to update roles' }
  }
}

export async function bulkBanUsers(userIds: string[]) {
  await checkOwnerAccess()
  
  try {
    await prisma.$transaction([
      prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { role: 'student' },
      }),
      prisma.subscription.updateMany({
        where: { userId: { in: userIds } },
        data: { status: 'cancelled' },
      }),
      prisma.enrollment.updateMany({
        where: { userId: { in: userIds } },
        data: { status: 'suspended' },
      })
    ])
    revalidatePath('/admin/owner')
    return { success: true, message: `Banned ${userIds.length} users` }
  } catch (error) {
    return { success: false, message: 'Failed to ban users' }
  }
}

// Export Data
export async function exportUsersCSV() {
  await checkOwnerAccess()
  
  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: true,
        enrollments: true,
      },
    })
    
    const csv = [
      ['ID', 'Name', 'Email', 'Role', 'Subscription', 'Status', 'Created At'].join(','),
      ...users.map(u => [
        u.id,
        u.name || '',
        u.email,
        u.role,
        u.subscriptions[0]?.plan || 'none',
        u.subscriptions[0]?.status || 'none',
        u.createdAt.toISOString()
      ].map(f => `"${String(f).replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    
    return { success: true, data: csv }
  } catch (error) {
    return { success: false, message: 'Failed to export' }
  }
}

// Quick Actions
export async function createTestUser(count: number = 1, subscriptionPlan?: 'standard' | 'mastery' | 'mastermind') {
  await checkOwnerAccess()
  
  try {
    const createdUsers = []
    
    for (let i = 0; i < count; i++) {
      const timestamp = Date.now() + i
      const user = await prisma.user.create({
        data: {
          email: `test_${timestamp}@test.com`,
          name: `Test User ${timestamp}`,
          role: 'student',
        },
      })
      
      // Create subscription if plan is specified
      if (subscriptionPlan) {
        const now = new Date()
        const periodEnd = new Date(now)
        periodEnd.setMonth(periodEnd.getMonth() + 1) // 1 month subscription
        
        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeCustomerId: `cus_test_${timestamp}`,
            stripeSubscriptionId: `sub_test_${timestamp}`,
            status: 'active',
            plan: subscriptionPlan,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        })
        
        // Also create an enrollment for the user
        const course = await prisma.course.findFirst()
        if (course) {
          await prisma.enrollment.create({
            data: {
              userId: user.id,
              courseId: course.id,
              plan: subscriptionPlan,
              status: 'active',
              accessGrantedAt: now,
              modulesUnlocked: '0',
              lessonsCompleted: '0',
            },
          })
        }
      }
      
      createdUsers.push(user.id)
    }
    
    revalidatePath('/admin/owner')
    return { 
      success: true, 
      message: `Created ${count} test user${count > 1 ? 's' : ''}${subscriptionPlan ? ` with ${subscriptionPlan} subscription` : ''}`,
      userIds: createdUsers 
    }
  } catch (error: any) {
    console.error('Error creating test users:', error)
    return { success: false, message: `Failed to create test users: ${error.message}` }
  }
}

// Get Financial Data
export async function getFinancialData() {
  await checkOwnerAccess()
  
  try {
    const payments = await prisma.payment.findMany({
      include: { user: true, refunds: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    
    const refunds = await prisma.refund.findMany({
      include: { payment: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    
    const revenueByPlan = await prisma.payment.groupBy({
      by: ['plan'],
      where: { status: 'succeeded' },
      _sum: { amount: true },
      _count: true,
    })
    
    return { success: true, payments, refunds, revenueByPlan }
  } catch (error) {
    return { success: false, message: 'Failed to fetch financial data' }
  }
}

// Get Audit Logs
export async function getAuditLogs(limit = 100) {
  await checkOwnerAccess()
  
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return { success: true, logs }
  } catch (error) {
    return { success: false, message: 'Failed to fetch audit logs' }
  }
}

// Get Course Analytics
export async function getCourseAnalytics() {
  await checkOwnerAccess()
  
  try {
    const courses = await prisma.course.findMany({
      include: {
        enrollments: true,
        modules: {
          include: {
            lessons: {
              include: {
                progress: true,
              },
            },
          },
        },
      },
    })
    
    const analytics = courses.map(course => {
      const totalEnrollments = course.enrollments.length
      const completedLessons = course.modules.flatMap(m => 
        m.lessons.flatMap(l => l.progress.filter(p => p.completed))
      ).length
      const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0)
      
      return {
        id: course.id,
        title: course.title,
        enrollments: totalEnrollments,
        completionRate: totalLessons > 0 ? (completedLessons / (totalEnrollments * totalLessons)) * 100 : 0,
        totalLessons,
      }
    })
    
    return { success: true, analytics }
  } catch (error) {
    return { success: false, message: 'Failed to fetch course analytics' }
  }
}

// System Health Check
export async function getSystemHealth() {
  await checkOwnerAccess()
  
  try {
    const dbCheck = await prisma.$queryRaw`SELECT 1 as health`
    const userCount = await prisma.user.count()
    const recentErrors: any[] = [] // Would integrate with error tracking service
    
    return {
      success: true,
      database: { status: 'healthy', responseTime: Date.now() },
      users: userCount,
      errors: recentErrors,
    }
  } catch (error) {
    return {
      success: false,
      database: { status: 'unhealthy', error: String(error) },
    }
  }
}


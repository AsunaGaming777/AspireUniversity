import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import OwnerPanelClient from '@/components/admin/OwnerPanelClient'
import { getFinancialData, getAuditLogs, getCourseAnalytics, getSystemHealth } from '@/app/actions/owner-advanced-actions'

// STRICT ACCESS CONTROL
const OWNER_EMAIL = 'azer.kasim@icloud.com'

export default async function OwnerPanelPage() {
  const session = await auth()

  // 1. Strict Email Check
  if (!session?.user?.email || session.user.email !== OWNER_EMAIL) {
    console.warn(`Unauthorized access attempt to Owner Panel by: ${session?.user?.email}`)
    redirect('/dashboard')
  }

  // 2. Fetch All Data with error handling
  let users: any[] = []
  let financialData: any = { success: false, payments: [], refunds: [], revenueByPlan: [] }
  let auditLogs: any = { success: false, logs: [] }
  let courseAnalytics: any = { success: false, analytics: [] }
  let systemHealth: any = { success: false, database: { status: 'unknown' }, users: 0, errors: [] }

  try {
    [users, financialData, auditLogs, courseAnalytics, systemHealth] = await Promise.all([
      prisma.user.findMany({
        include: {
          subscriptions: true,
          enrollments: true,
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }).catch(() => []),
      getFinancialData().catch(() => ({ success: false, payments: [], refunds: [], revenueByPlan: [] })),
      getAuditLogs(100).catch(() => ({ success: false, logs: [] })),
      getCourseAnalytics().catch(() => ({ success: false, analytics: [] })),
      getSystemHealth().catch(() => ({ success: false, database: { status: 'unhealthy' }, users: 0, errors: [] })),
    ])
  } catch (error) {
    console.error('Error fetching owner panel data:', error)
    // Continue with empty/default data
  }

  // 3. Calculate Stats
  const totalUsers = users.length
  const activeSubs = users.filter(u => u.subscriptions.some(s => s.status === 'active')).length
  const admins = users.filter(u => ['admin', 'overseer'].includes(u.role)).length
  const totalRevenue = users.reduce((acc, user) => {
    const plan = user.subscriptions.find(s => s.status === 'active')?.plan
    if (plan === 'mastermind') return acc + 2997
    if (plan === 'mastery') return acc + 997
    if (plan === 'standard') return acc + 497
    return acc
  }, 0)

  return (
    <OwnerPanelClient
      users={users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        subscriptions: u.subscriptions.map(s => ({ status: s.status, plan: s.plan })),
        _count: { enrollments: u._count.enrollments }
      }))}
      stats={{
        totalUsers,
        activeSubs,
        admins,
        totalRevenue,
      }}
      financialData={financialData.success ? financialData : { payments: [], refunds: [], revenueByPlan: [] }}
      auditLogs={auditLogs.success ? auditLogs.logs : []}
      courseAnalytics={courseAnalytics.success ? courseAnalytics.analytics : []}
      systemHealth={systemHealth.success ? systemHealth : { database: { status: 'unknown' }, users: 0, errors: [] }}
    />
  )
}

import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { KPIDashboard } from "@/components/admin/KPIDashboard";
import { RecentActivity } from "@/components/admin/RecentActivity";

async function getKPIData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // DAU/MAU calculations
  const [dau, mau] = await Promise.all([
    prisma.user.count({
      where: {
        updatedAt: { gte: yesterday },
      },
    }),
    prisma.user.count({
      where: {
        updatedAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  // Enrollment metrics
  const [totalEnrollments, activeEnrollments, newEnrollments] = await Promise.all([
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: "active" } }),
    prisma.enrollment.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  // Course completion rate
  const enrollmentsWithProgress = await prisma.enrollment.findMany({
    where: { status: "active" },
    select: {
      modulesUnlocked: true,
      lessonsCompleted: true,
    },
  });

  const completionRate = enrollmentsWithProgress.length > 0
    ? enrollmentsWithProgress.reduce((acc, e) => {
        const totalLessons = e.modulesUnlocked.length * 5; // Assuming 5 lessons per module
        const completed = e.lessonsCompleted.length;
        return acc + (totalLessons > 0 ? (completed / totalLessons) * 100 : 0);
      }, 0) / enrollmentsWithProgress.length
    : 0;

  // Quiz pass rate
  const [totalAttempts, passedAttempts] = await Promise.all([
    prisma.quizAttempt.count(),
    prisma.quizAttempt.count({ where: { passed: true } }),
  ]);

  const quizPassRate = totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0;

  // Assignment backlog
  const assignmentBacklog = await prisma.assignmentSubmission.count({
    where: {
      status: "submitted",
      grade: null,
    },
  });

  // Revenue metrics
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: "succeeded",
    },
    select: { amount: true },
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0) / 100; // Convert cents to dollars

  // Refund rate
  const [totalPayments, refundedPayments] = await Promise.all([
    prisma.payment.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.payment.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: "refunded",
      },
    }),
  ]);

  const refundRate = totalPayments > 0 ? (refundedPayments / totalPayments) * 100 : 0;

  // Affiliate conversions
  const affiliateConversions = await prisma.commission.count({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      status: { in: ["pending", "approved", "paid"] },
    },
  });

  return {
    dau,
    mau,
    totalEnrollments,
    activeEnrollments,
    newEnrollments,
    completionRate: Math.round(completionRate * 10) / 10,
    quizPassRate: Math.round(quizPassRate * 10) / 10,
    assignmentBacklog,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    refundRate: Math.round(refundRate * 10) / 10,
    affiliateConversions,
  };
}

async function getRecentActivity() {
  const recentLogs = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return recentLogs;
}

export default async function OpsConsolePage() {
  await requireAdmin();
  
  const [kpiData, recentActivity] = await Promise.all([
    getKPIData(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Ops Console</h1>
        <p className="mt-2 text-gray-600">
          Monitor platform health, manage students, and oversee operations
        </p>
      </div>

      <KPIDashboard data={kpiData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity activities={recentActivity} />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/ops/students"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-gray-900">Manage Students</div>
              <div className="text-sm text-gray-600">View, filter, and manage student accounts</div>
            </a>
            <a
              href="/admin/ops/assignments"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-gray-900">Assignment Queue</div>
              <div className="text-sm text-gray-600">{kpiData.assignmentBacklog} pending reviews</div>
            </a>
            <a
              href="/admin/ops/cohorts"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-gray-900">Cohort Management</div>
              <div className="text-sm text-gray-600">Create and manage student cohorts</div>
            </a>
            <a
              href="/admin/ops/webhooks"
              className="block px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-gray-900">Webhook Monitor</div>
              <div className="text-sm text-gray-600">View and replay failed webhooks</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { TrendingUp, Users, DollarSign, Award, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'

export default async function AdminOverviewPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch platform statistics
  const [
    totalUsers,
    totalEnrollments,
    totalPayments,
    totalCertificates,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.enrollment.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.certificate.count(),
    prisma.enrollment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        course: true,
      },
    }),
  ])

  const revenue = (totalPayments._sum.amount || 0) / 100

  return (
    <div className="min-h-screen constellation-bg py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">
            <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className="text-brand-muted-text">Platform overview and key metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-brand-gold" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalUsers}</div>
            <div className="text-brand-muted-text">Total Users</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-10 h-10 text-brand-gold" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalEnrollments}</div>
            <div className="text-brand-muted-text">Total Enrollments</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-brand-gold" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">${revenue.toFixed(0)}</div>
            <div className="text-brand-muted-text">Total Revenue</div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-10 h-10 text-brand-gold" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalCertificates}</div>
            <div className="text-brand-muted-text">Certificates Issued</div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="card">
          <h2 className="text-2xl font-heading font-bold text-white mb-6">
            Recent Enrollments
          </h2>
          <div className="space-y-3">
            {recentEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between p-4 bg-brand-black rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
                    <span className="text-brand-black font-bold">
                      {enrollment.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{enrollment.user.name}</div>
                    <div className="text-sm text-brand-muted-text">{enrollment.course.title}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-brand-gold font-semibold">
                    {enrollment.plan.toUpperCase()}
                  </div>
                  <div className="text-xs text-brand-muted-text">
                    {formatDate(enrollment.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}




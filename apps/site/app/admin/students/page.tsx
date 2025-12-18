import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { StudentTable } from '@/components/admin/StudentTable'

export default async function AdminStudentsPage() {
  const session = await auth()

  // Check if user is admin
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all students with enrollments and progress
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      progress: {
        where: { completed: true },
      },
      certificates: true,
      _count: {
        select: {
          progress: true,
          certificates: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: students.length,
    active: students.filter(s => s.enrollments.length > 0).length,
    completed: students.filter(s => s.certificates.length > 0).length,
    avgProgress: Math.round(
      students.reduce((sum, s) => sum + s._count.progress, 0) / students.length
    ),
  }

  return (
    <div className="min-h-screen constellation-bg py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">
            <span className="gradient-text">Student Management</span>
          </h1>
          <p className="text-brand-muted-text">
            Manage all enrolled students and track their progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="text-3xl font-bold text-brand-gold mb-2">{stats.total}</div>
            <div className="text-brand-muted-text">Total Students</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-green-500 mb-2">{stats.active}</div>
            <div className="text-brand-muted-text">Active Students</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-brand-gold mb-2">{stats.completed}</div>
            <div className="text-brand-muted-text">Graduated</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-brand-gold mb-2">{stats.avgProgress}</div>
            <div className="text-brand-muted-text">Avg. Lessons Done</div>
          </div>
        </div>

        {/* Student Table */}
        <div className="card">
          <StudentTable students={students} />
        </div>
      </div>
    </div>
  )
}




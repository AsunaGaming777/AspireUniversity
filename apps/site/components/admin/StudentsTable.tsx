'use client'

import { useState } from 'react'
import { Search, Mail, Award, BookOpen, Filter } from 'lucide-react'

interface Student {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  cohort: {
    id: string
    name: string
  } | null
  enrollments: Array<{
    id: string
    status: string
    payment: {
      id: string
      amount: number
      status: string
    } | null
  }>
  studentProfile: any
  _count: {
    payments: number
    assignments: number
  }
}

interface Cohort {
  id: string
  name: string
}

interface StudentsTableProps {
  students: Student[]
  cohorts: Cohort[]
  total: number
  page: number
  limit: number
  filters: {
    role?: string
    cohort?: string
    status?: string
    search?: string
    page?: string
  }
}

export function StudentsTable({ students, cohorts, total, page, limit, filters }: StudentsTableProps) {
  const [search, setSearch] = useState(filters.search || '')

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm font-medium text-gray-900 py-3 px-4">Student</th>
                <th className="text-left text-sm font-medium text-gray-900 py-3 px-4">Cohort</th>
                <th className="text-left text-sm font-medium text-gray-900 py-3 px-4">Enrollments</th>
                <th className="text-left text-sm font-medium text-gray-900 py-3 px-4">Payments</th>
                <th className="text-left text-sm font-medium text-gray-900 py-3 px-4">Joined</th>
                <th className="text-left text-sm font-medium text-gray-900 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{student.name || 'No name'}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{student.cohort?.name || '—'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{student.enrollments.length}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{student._count.payments}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <a
                      href={`/admin/ops/students/${student.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </div>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`?page=${page - 1}`}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </a>
            )}
            {page * limit < total && (
              <a
                href={`?page=${page + 1}`}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


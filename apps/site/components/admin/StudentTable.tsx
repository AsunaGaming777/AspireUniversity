'use client'

import { useState } from 'react'
import { Search, Mail, Award, BookOpen } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'

interface Student {
  id: string
  name: string | null
  email: string
  createdAt: Date
  enrollments: any[]
  certificates: any[]
  _count: {
    progress: number
    certificates: number
  }
}

export function StudentTable({ students }: { students: Student[] }) {
  const [search, setSearch] = useState('')

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-muted-text" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-black border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-brand-muted-text font-medium py-3 px-4">Student</th>
              <th className="text-left text-brand-muted-text font-medium py-3 px-4">Enrolled</th>
              <th className="text-left text-brand-muted-text font-medium py-3 px-4">Progress</th>
              <th className="text-left text-brand-muted-text font-medium py-3 px-4">Certificates</th>
              <th className="text-left text-brand-muted-text font-medium py-3 px-4">Joined</th>
              <th className="text-left text-brand-muted-text font-medium py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id} className="border-b border-gray-800 hover:bg-brand-dark-surface">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-white">{student.name || 'No name'}</div>
                    <div className="text-sm text-brand-muted-text">{student.email}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-gold" />
                    <span className="text-white">{student.enrollments.length}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-white">{student._count.progress} lessons</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-brand-gold" />
                    <span className="text-white">{student._count.certificates}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-brand-muted-text text-sm">
                    {formatDate(student.createdAt)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button className="text-brand-gold hover:text-brand-deep-gold text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-brand-muted-text">
            No students found matching "{search}"
          </div>
        )}
      </div>
    </div>
  )
}




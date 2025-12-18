'use client'

import { BookOpen, Users, TrendingUp, BarChart3 } from 'lucide-react'

interface CourseAnalytics {
  id: string
  title: string
  enrollments: number
  completionRate: number
  totalLessons: number
}

export function CourseManagement({ analytics }: { analytics: CourseAnalytics[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Course Performance</h3>
        <button className="px-4 py-2 bg-brand-gold text-black rounded-lg font-semibold hover:bg-brand-deep-gold transition-colors">
          + New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analytics.map((course) => (
          <div key={course.id} className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-brand-gold" />
              <h4 className="text-lg font-bold text-white">{course.title}</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Enrollments</span>
                <span className="text-white font-semibold">{course.enrollments}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Completion Rate</span>
                <span className="text-white font-semibold">{course.completionRate.toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Lessons</span>
                <span className="text-white font-semibold">{course.totalLessons}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div 
                    className="bg-brand-gold h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(course.completionRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  description: string
  level: string
}

interface RecommendedCoursesProps {
  courses: Course[]
  recommendedPlan?: string
}

export function RecommendedCourses({ courses, recommendedPlan }: RecommendedCoursesProps) {
  if (courses.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-1">
            Recommended for You
          </h2>
          <p className="text-sm text-muted-foreground">
            Based on your goals and interests
          </p>
        </div>
        {recommendedPlan && (
          <span className="px-3 py-1 bg-brand-gold/20 border border-brand-gold/30 rounded-full text-xs font-medium text-brand-gold">
            {recommendedPlan} plan recommended
          </span>
        )}
      </div>

      <div className="space-y-3">
        {courses.slice(0, 3).map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="block p-4 bg-brand-black rounded-lg hover:bg-brand-black/80 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs text-brand-gold uppercase tracking-wide">
                    {course.level}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-brand-gold transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {course.description}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-gold group-hover:translate-x-1 transition-all ml-4" />
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/courses"
        className="mt-4 block text-center text-sm text-brand-gold hover:text-brand-deep-gold transition-colors"
      >
        View all courses →
      </Link>
    </div>
  )
}


'use client'

import { CourseCard } from './CourseCard'

interface CourseWithProgress {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string
  thumbnail: string | null
  level: string
  duration: number | null
  isEnrolled: boolean
  progress: number
  totalLessons: number
  completedLessons: number
}

interface CourseGridProps {
  courses: CourseWithProgress[]
}

export function CourseGrid({ courses }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

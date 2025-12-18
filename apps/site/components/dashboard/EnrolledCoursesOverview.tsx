'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Clock, ArrowRight, PlayCircle } from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  thumbnail: string | null
  level: string
  progress: number
  totalLessons: number
  completedLessons: number
}

interface EnrolledCoursesOverviewProps {
  courses: Course[]
}

function getThumbnailPath(slug: string): string | null {
  const thumbnailMap: Record<string, string> = {
    'ai-foundations': 'AI foundations.jpg',
    'ai-for-business': 'AI For Business.jpg',
    'ai-for-coding': 'AI for coding.jpg',
    'ai-for-design': 'AI for Design.jpg',
    'ai-security-osint': 'AI Security & OSINT.jpg',
    'dark-ai-ethics': 'Dark AI & Ethics .jpg',
    'ai-finance-trading': 'AI finance & trading.jpg',
    'advanced-prompt-engineering': 'Advanced Prompt Engineering.jpg',
    'ai-automation': 'AI automation.jpg',
    'language-mastery': 'Language Mastery.jpg',
    'personal-ai-shadow': 'Personal AI shadow.jpg',
    'black-hat-ai': 'Black Hat AI.jpg',
    'ai-research': 'AI research.jpg',
    'ai-for-creators': 'AI for creators.jpg',
    'ai-healthcare-longevity': 'Health Care and Longevity.jpg',
    'quantum-ai-future-compute': 'Quantum AI & Future Compute.jpg',
    'generative-architecture-3d-design': 'Generative Architecture & 3D design.jpg',
    'legal-engineering-ai-governance': 'Legal Engineering & AI Governance.jpg',
    'ai-climate-sustainability': 'AI for Climate & Sustainability.jpg',
  }

  const filename = thumbnailMap[slug]
  return filename ? `/course-thumbnails/${filename}` : null
}

export function EnrolledCoursesOverview({ courses }: EnrolledCoursesOverviewProps) {
  if (courses.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-display font-bold text-white mb-4">My Courses</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-deep-gold transition-colors"
          >
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display font-bold text-white">My Courses</h3>
        <Link
          href="/courses"
          className="text-sm text-brand-gold hover:text-brand-deep-gold transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {courses.slice(0, 3).map((course) => {
          const thumbnailPath = course.thumbnail || getThumbnailPath(course.slug)

          return (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="block group"
            >
              <div className="flex gap-4 p-3 bg-brand-black rounded-lg hover:bg-brand-black/80 transition-all duration-200 hover:border-brand-gold/30 border border-transparent">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-brand-gold/20 to-brand-deep-gold/10">
                  {thumbnailPath ? (
                    <Image
                      src={thumbnailPath}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="80px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-brand-gold/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1 group-hover:text-brand-gold transition-colors truncate">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/30 rounded text-brand-gold">
                          {course.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.totalLessons} lessons
                        </span>
                      </div>
                    </div>
                    <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-brand-gold transition-colors flex-shrink-0 ml-2" />
                  </div>

                  {/* Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-brand-gold font-medium">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-gold to-brand-deep-gold transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


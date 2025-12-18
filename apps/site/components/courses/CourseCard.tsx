'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, BookOpen, ArrowRight } from 'lucide-react'

interface Course {
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

interface CourseCardProps {
  course: Course
}

// Map course slugs to thumbnail filenames
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
    'ai-for-creators': 'AI for creators.jpg',
    'ai-research': 'AI research.jpg',
    'ai-healthcare-longevity': 'Health Care and Longevity.jpg',
    'quantum-ai-future-compute': 'Quantum AI & Future Compute.jpg',
    'generative-architecture-3d-design': 'Generative Architecture & 3D design.jpg',
    'legal-engineering-ai-governance': 'Legal Engineering & AI Governance.jpg',
    'ai-climate-sustainability': 'AI for Climate & Sustainability.jpg',
  }
  
  const filename = thumbnailMap[slug]
  return filename ? `/course-thumbnails/${filename}` : null
}

export function CourseCard({ course }: CourseCardProps) {
  const thumbnailPath = course.thumbnail || getThumbnailPath(course.slug)
  
  return (
    <div className="card group hover:border-brand-gold/30 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-brand-gold/20 to-brand-deep-gold/10 rounded-xl mb-4 overflow-hidden">
        {thumbnailPath ? (
          <Image
            src={thumbnailPath}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-brand-gold/50" />
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-brand-black/80 backdrop-blur-sm border border-brand-gold/30 rounded-full text-xs font-medium text-brand-gold">
            {course.level}
          </span>
        </div>

        {/* Progress Bar (if enrolled) */}
        {course.isEnrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-black/50">
            <div
              className="h-full bg-gradient-to-r from-brand-gold to-brand-deep-gold"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
          {course.title}
        </h3>

        {course.subtitle && (
          <p className="text-sm text-muted-foreground mb-3">{course.subtitle}</p>
        )}

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}h</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.totalLessons} lessons</span>
          </div>
        </div>

        {/* Progress (if enrolled) */}
        {course.isEnrolled && (
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-brand-gold font-semibold">{course.progress}%</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4">
        {course.isEnrolled ? (
          <Link href={`/courses/${course.slug}`} className="block">
            <button className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white text-brand-black hover:bg-brand-gold hover:shadow-[0_0_20px_rgba(245,215,110,0.4)]">
              {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <Link href="/pricing" className="block">
            <button className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white text-brand-black hover:bg-brand-gold hover:shadow-[0_0_20px_rgba(245,215,110,0.4)]">
              Enroll Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

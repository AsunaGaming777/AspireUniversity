'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PlayCircle, BookOpen, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@aspire/ui'

interface Progress {
  id: string
  completed: boolean
  progress: number
  lastAccessed: Date
  lesson: {
    id: string
    title: string
    module: {
      title: string
      course: {
        slug: string
        title: string
        thumbnail: string | null
      }
    }
  }
}

interface ContinueLearningProps {
  progress: Progress[]
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

export function ContinueLearning({ progress }: ContinueLearningProps) {
  const inProgressLessons = progress.filter((p) => !p.completed && p.progress > 0)
  const nextLesson = inProgressLessons[0] || progress[0]

  if (!nextLesson) {
    return (
      <div className="card">
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Continue Learning
        </h2>
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-muted-foreground mb-4">
            You haven't started any lessons yet.
          </p>
          <Link href="/courses">
            <Button className="flex items-center gap-2 mx-auto">
              Browse Courses
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const thumbnailPath = nextLesson.lesson.module.course.thumbnail || 
    getThumbnailPath(nextLesson.lesson.module.course.slug)
  const progressPercent = Math.round(nextLesson.progress * 100)

  return (
    <div className="card">
      <h2 className="text-2xl font-display font-bold text-white mb-4">
        Continue Learning
      </h2>

      <Link href={`/courses/${nextLesson.lesson.module.course.slug}`} className="block group">
        <div className="bg-brand-black rounded-xl overflow-hidden border border-white/10 hover:border-brand-gold/30 transition-all duration-300">
          {/* Thumbnail Header */}
          <div className="relative h-48 bg-gradient-to-br from-brand-gold/20 to-brand-deep-gold/10">
            {thumbnailPath ? (
              <Image
                src={thumbnailPath}
                alt={nextLesson.lesson.module.course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-brand-gold/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm text-brand-gold font-medium mb-1">
                {nextLesson.lesson.module.course.title}
              </p>
              <h3 className="text-xl font-display font-bold text-white">
                {nextLesson.lesson.title}
              </h3>
            </div>
            <div className="absolute top-4 right-4">
              <div className="p-3 bg-brand-black/80 backdrop-blur-sm rounded-full group-hover:bg-brand-gold/20 transition-colors">
                <PlayCircle className="w-6 h-6 text-brand-gold" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              {nextLesson.lesson.module.title}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Lesson Progress</span>
                <span className="text-brand-gold font-semibold">{progressPercent}%</span>
              </div>
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-gold to-brand-deep-gold transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <Button size="lg" className="w-full group-hover:bg-brand-gold group-hover:shadow-[0_0_20px_rgba(245,215,110,0.4)] transition-all">
              {progressPercent > 0 ? 'Continue Lesson' : 'Start Lesson'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}

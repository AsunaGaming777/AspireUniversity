'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'

interface Progress {
  id: string
  completed: boolean
  lastAccessed: Date
  lesson: {
    title: string
    module: {
      title: string
    }
  }
}

interface RecentProgressProps {
  progress: Progress[]
}

export function RecentProgress({ progress }: RecentProgressProps) {
  return (
    <div className="card">
      <h3 className="text-xl font-display font-bold text-white mb-4">
        Recent Activity
      </h3>

      {progress.length === 0 ? (
        <p className="text-muted-foreground text-sm">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {progress.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-brand-black rounded-lg"
            >
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {item.lesson.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.lesson.module.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(item.lastAccessed)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

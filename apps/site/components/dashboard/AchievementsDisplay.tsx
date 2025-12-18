'use client'

import { Award, Trophy, Star, Zap, Target, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/date-utils'

interface Achievement {
  id: string
  type: string
  title: string
  description: string | null
  points: number
  createdAt: Date
}

interface AchievementsDisplayProps {
  achievements: Achievement[]
}

const achievementIcons: Record<string, typeof Award> = {
  streak: Zap,
  completion: Trophy,
  certificate: Award,
  course: BookOpen,
  goal: Target,
  default: Star,
}

const achievementColors: Record<string, string> = {
  streak: 'text-orange-400 bg-orange-500/10',
  completion: 'text-brand-gold bg-brand-gold/10',
  certificate: 'text-yellow-400 bg-yellow-500/10',
  course: 'text-blue-400 bg-blue-500/10',
  goal: 'text-green-400 bg-green-500/10',
  default: 'text-purple-400 bg-purple-500/10',
}

export function AchievementsDisplay({ achievements }: AchievementsDisplayProps) {
  if (achievements.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-gold/10 rounded-lg">
            <Trophy className="w-5 h-5 text-brand-gold" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Achievements</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-muted-foreground mb-2">No achievements yet</p>
          <p className="text-sm text-muted-foreground">
            Complete lessons and courses to earn achievements!
          </p>
        </div>
      </div>
    )
  }

  const recentAchievements = achievements.slice(0, 3)
  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/10 rounded-lg">
            <Trophy className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Achievements</h3>
            <p className="text-xs text-muted-foreground">{totalPoints} points earned</p>
          </div>
        </div>
        {achievements.length > 3 && (
          <Link
            href="/dashboard/achievements"
            className="text-sm text-brand-gold hover:text-brand-deep-gold transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {recentAchievements.map((achievement) => {
          const Icon = achievementIcons[achievement.type] || achievementIcons.default
          const colorClass = achievementColors[achievement.type] || achievementColors.default

          return (
            <div
              key={achievement.id}
              className="flex items-start gap-3 p-3 bg-brand-black rounded-lg hover:bg-brand-black/80 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm mb-1">{achievement.title}</h4>
                {achievement.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {achievement.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-brand-gold font-medium">
                    +{achievement.points} pts
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(achievement.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


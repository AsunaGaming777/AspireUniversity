'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Clock, Award, Flame, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  totalLessons: number
  completedLessons: number
  timeSpent: number
  streak: number
  certificates: number
}

export function DashboardStats({
  totalLessons,
  completedLessons,
  timeSpent,
  streak,
  certificates,
}: DashboardStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    completionRate: 0,
    hoursSpent: 0,
    minutesSpent: 0,
    streak: 0,
    certificates: 0,
  })

  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const hoursSpent = Math.floor(timeSpent / 3600)
  const minutesSpent = Math.floor((timeSpent % 3600) / 60)

  useEffect(() => {
    // Animate values on mount
    const duration = 1000
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      setAnimatedValues({
        completionRate: Math.round(completionRate * easeOut),
        hoursSpent: Math.floor(hoursSpent * easeOut),
        minutesSpent: Math.floor(minutesSpent * easeOut),
        streak: Math.floor(streak * easeOut),
        certificates: Math.floor(certificates * easeOut),
      })

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedValues({
          completionRate,
          hoursSpent,
          minutesSpent,
          streak,
          certificates,
        })
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [completionRate, hoursSpent, minutesSpent, streak, certificates])

  const getStreakMessage = () => {
    if (streak === 0) return 'Start your streak today!'
    if (streak < 7) return 'Keep it up!'
    if (streak < 30) return 'On fire! 🔥'
    return 'Incredible streak! 🌟'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Completion Rate */}
      <div className="card group hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-brand-gold/10 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
              <BookOpen className="w-6 h-6 text-brand-gold" />
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white tabular-nums">
                {animatedValues.completionRate}%
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Completion Rate</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-gold to-brand-deep-gold transition-all duration-1000 ease-out"
                style={{ width: `${animatedValues.completionRate}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {completedLessons}/{totalLessons}
            </span>
          </div>
        </div>
      </div>

      {/* Time Spent */}
      <div className="card group hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-brand-gold/10 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
              <Clock className="w-6 h-6 text-brand-gold" />
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white tabular-nums">
                {animatedValues.hoursSpent}h
              </span>
              <span className="text-lg text-muted-foreground tabular-nums ml-1">
                {animatedValues.minutesSpent}m
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Time Spent Learning</p>
          <p className="text-xs text-muted-foreground mt-1">
            {hoursSpent > 0 ? 'Great dedication!' : 'Start learning today!'}
          </p>
        </div>
      </div>

      {/* Current Streak */}
      <div className="card group hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white tabular-nums">
                {animatedValues.streak}
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Day Streak</p>
          <p className="text-xs text-orange-400 mt-1 font-medium">{getStreakMessage()}</p>
        </div>
      </div>

      {/* Certificates */}
      <div className="card group hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-brand-gold/10 rounded-lg group-hover:bg-brand-gold/20 transition-colors">
              <Award className="w-6 h-6 text-brand-gold" />
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white tabular-nums">
                {animatedValues.certificates}
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Certificates Earned</p>
          <p className="text-xs text-muted-foreground mt-1">
            {certificates > 0 ? 'Keep achieving!' : 'Complete courses to earn'}
          </p>
        </div>
      </div>
    </div>
  )
}

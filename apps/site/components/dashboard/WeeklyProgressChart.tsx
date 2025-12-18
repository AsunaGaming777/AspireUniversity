'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Calendar } from 'lucide-react'

interface WeeklyProgressChartProps {
  progressData: Array<{
    date: string
    lessonsCompleted: number
    timeSpent: number // in seconds
  }>
}

export function WeeklyProgressChart({ progressData }: WeeklyProgressChartProps) {
  const [animatedData, setAnimatedData] = useState(
    progressData.map(() => ({ lessonsCompleted: 0, timeSpent: 0 }))
  )

  useEffect(() => {
    // Animate bars on mount
    const timer = setTimeout(() => {
      setAnimatedData(progressData.map(d => ({
        lessonsCompleted: d.lessonsCompleted,
        timeSpent: d.timeSpent,
      })))
    }, 300)

    return () => clearTimeout(timer)
  }, [progressData])

  const maxLessons = Math.max(...progressData.map(d => d.lessonsCompleted), 1)
  const totalLessons = progressData.reduce((sum, d) => sum + d.lessonsCompleted, 0)
  const totalHours = Math.floor(
    progressData.reduce((sum, d) => sum + d.timeSpent, 0) / 3600
  )

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-1">Weekly Progress</h3>
          <p className="text-sm text-muted-foreground">
            {totalLessons} lessons • {totalHours}h this week
          </p>
        </div>
        <div className="p-2 bg-brand-gold/10 rounded-lg">
          <Calendar className="w-5 h-5 text-brand-gold" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Chart */}
        <div className="flex items-end justify-between gap-2 h-32">
          {progressData.map((day, index) => {
            const height = maxLessons > 0 
              ? (animatedData[index].lessonsCompleted / maxLessons) * 100 
              : 0
            const isToday = new Date(day.date).toDateString() === new Date().toDateString()
            
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full h-full flex items-end">
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      isToday 
                        ? 'bg-gradient-to-t from-brand-gold to-brand-deep-gold' 
                        : 'bg-gradient-to-t from-brand-gold/60 to-brand-deep-gold/60'
                    }`}
                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {days[new Date(day.date).getDay()]}
                </div>
                {animatedData[index].lessonsCompleted > 0 && (
                  <div className="text-xs font-semibold text-brand-gold">
                    {animatedData[index].lessonsCompleted}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-brand-gold to-brand-deep-gold" />
            <span className="text-xs text-muted-foreground">Lessons completed</span>
          </div>
          {totalLessons > 0 && (
            <div className="flex items-center gap-1 text-xs text-brand-gold">
              <TrendingUp className="w-3 h-3" />
              <span>Great progress!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


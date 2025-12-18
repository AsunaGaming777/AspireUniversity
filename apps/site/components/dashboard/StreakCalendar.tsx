'use client'

import { Flame, Calendar as CalendarIcon } from 'lucide-react'
import { useMemo } from 'react'
import { formatDate } from '@/lib/date-utils'

interface StreakCalendarProps {
  streak: number
  learningDays: Set<string> // Set of dates (YYYY-MM-DD) when user learned
}

export function StreakCalendar({ streak, learningDays }: StreakCalendarProps) {
  const calendarDays = useMemo(() => {
    const days: Array<{ date: Date; hasActivity: boolean; isToday: boolean }> = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const isToday = date.toDateString() === today.toDateString()
      
      days.push({
        date,
        hasActivity: learningDays.has(dateStr),
        isToday,
      })
    }

    return days
  }, [learningDays])

  const activeDays = calendarDays.filter(d => d.hasActivity).length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">Learning Calendar</h3>
            <p className="text-xs text-muted-foreground">{streak} day streak</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayOfWeek = day.date.getDay()
            const dayNumber = day.date.getDate()
            
            return (
              <div
                key={index}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all duration-200 ${
                  day.hasActivity
                    ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30'
                    : 'bg-gray-800/50 border border-transparent'
                } ${
                  day.isToday ? 'ring-2 ring-brand-gold' : ''
                }`}
                title={formatDate(day.date)}
              >
                <span className={`text-[10px] mb-0.5 ${
                  day.hasActivity ? 'text-orange-400' : 'text-muted-foreground'
                }`}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][dayOfWeek]}
                </span>
                <span className={`text-xs font-medium ${
                  day.hasActivity ? 'text-white' : 'text-muted-foreground'
                }`}>
                  {dayNumber}
                </span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30" />
              <span className="text-muted-foreground">Learned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-800/50" />
              <span className="text-muted-foreground">No activity</span>
            </div>
          </div>
          <div className="text-xs text-brand-gold font-medium">
            {activeDays} active days
          </div>
        </div>
      </div>
    </div>
  )
}


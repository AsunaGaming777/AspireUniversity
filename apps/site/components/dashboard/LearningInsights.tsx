'use client'

import { Lightbulb, Clock, Target, Zap } from 'lucide-react'

interface LearningInsightsProps {
  weeklyTimeSpent: number // seconds
  averageSessionTime: number // seconds
  bestLearningDay: string | null
  completionRate: number
  streak: number
}

export function LearningInsights({
  weeklyTimeSpent,
  averageSessionTime,
  bestLearningDay,
  completionRate,
  streak,
}: LearningInsightsProps) {
  const weeklyHours = Math.floor(weeklyTimeSpent / 3600)
  const weeklyMinutes = Math.floor((weeklyTimeSpent % 3600) / 60)
  const avgMinutes = Math.floor(averageSessionTime / 60)

  const insights = []

  if (weeklyHours > 0) {
    insights.push({
      icon: Clock,
      text: `You've spent ${weeklyHours}h ${weeklyMinutes}m learning this week`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    })
  }

  if (bestLearningDay) {
    insights.push({
      icon: Target,
      text: `Your most productive day is ${bestLearningDay}`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    })
  }

  if (avgMinutes > 0) {
    insights.push({
      icon: Zap,
      text: `Average session: ${avgMinutes} minutes`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    })
  }

  if (insights.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-gold/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-brand-gold" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Learning Insights</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete more lessons to unlock personalized insights!
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-brand-gold/10 rounded-lg">
          <Lightbulb className="w-5 h-5 text-brand-gold" />
        </div>
        <h3 className="text-xl font-display font-bold text-white">Learning Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${insight.bgColor} border border-white/5`}
            >
              <Icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
              <p className="text-sm text-white">{insight.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}


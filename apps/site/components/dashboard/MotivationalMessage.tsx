'use client'

import { Sparkles, TrendingUp, Target, Zap } from 'lucide-react'

const messages = [
  {
    icon: Sparkles,
    text: "Every expert was once a beginner. Keep learning!",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    text: "You're making great progress! Consistency is key.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Target,
    text: "Focus on one course at a time for best results.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Zap,
    text: "Your learning streak is impressive! Keep it going!",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
]

interface MotivationalMessageProps {
  streak: number
  completionRate: number
}

export function MotivationalMessage({ streak, completionRate }: MotivationalMessageProps) {
  // Select message based on user progress
  let selectedMessage = messages[0]
  
  if (streak >= 7) {
    selectedMessage = messages[3] // Streak message
  } else if (completionRate >= 50) {
    selectedMessage = messages[1] // Progress message
  } else if (completionRate > 0) {
    selectedMessage = messages[2] // Focus message
  }

  const Icon = selectedMessage.icon

  return (
    <div className={`card ${selectedMessage.bgColor} border-brand-gold/20`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 ${selectedMessage.bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${selectedMessage.color}`} />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">{selectedMessage.text}</p>
        </div>
      </div>
    </div>
  )
}


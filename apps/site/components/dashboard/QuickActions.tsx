'use client'

import Link from 'next/link'
import { BookOpen, Search, Trophy, Settings, Sparkles, ArrowRight } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      icon: Search,
      label: 'Browse Courses',
      description: 'Explore all available courses',
      href: '/courses',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      hoverBg: 'hover:bg-blue-500/20',
    },
    {
      icon: Trophy,
      label: 'View Achievements',
      description: 'See your accomplishments',
      href: '/dashboard/achievements',
      color: 'text-brand-gold',
      bgColor: 'bg-brand-gold/10',
      hoverBg: 'hover:bg-brand-gold/20',
    },
    {
      icon: Sparkles,
      label: 'Learning Path',
      description: 'Your personalized journey',
      href: '/dashboard/path',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      hoverBg: 'hover:bg-purple-500/20',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Manage your account',
      href: '/settings',
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      hoverBg: 'hover:bg-gray-500/20',
    },
  ]

  return (
    <div className="card">
      <h3 className="text-xl font-display font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`p-4 rounded-xl border border-white/10 ${action.bgColor} ${action.hoverBg} transition-all duration-200 group hover:border-brand-gold/30`}
            >
              <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <h4 className="font-semibold text-white mb-1 group-hover:text-brand-gold transition-colors">
                {action.label}
              </h4>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


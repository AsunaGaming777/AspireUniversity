'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button' // Or use custom button classes if you prefer
import { ArrowRight, Star, Users, ShieldCheck } from 'lucide-react'

export function CTA() {
  const [stats, setStats] = useState({
    totalUsers: 500,
    averageRating: 4.9,
  })

  useEffect(() => {
    // Fetch real stats from API
    const fetchStats = () => {
      fetch('/api/stats?' + Date.now()) // Add timestamp to prevent caching
        .then((res) => res.json())
        .then((data) => {
          setStats({
            totalUsers: Math.max(500, data.totalUsers || data.earlyAdopters || 500),
            averageRating: data.averageRating || 4.9,
          })
        })
        .catch((error) => {
          console.error('Error fetching stats:', error)
          // Keep default values on error
        })
    }
    
    fetchStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 relative overflow-hidden bg-brand-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-width relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Ready to <span className="text-gradient-gold">Ascend?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Join {stats.totalUsers >= 1000 
              ? `${(stats.totalUsers / 1000).toFixed(1)}K+`
              : `${stats.totalUsers}+`} professionals who have already secured their future. The age of AI waits for no one.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/courses" className="w-full sm:w-auto">
              <button className="btn-luxury w-full sm:w-auto group text-lg px-10 py-5">
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform inline-block" />
              </button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <button className="btn-outline-luxury w-full sm:w-auto text-lg px-10 py-5">
                View All Plans
              </button>
            </Link>
          </div>

          <div className="inline-flex items-center gap-8 py-6 px-10 glass-panel rounded-full">
             <div className="flex items-center gap-2">
                 <Users className="w-5 h-5 text-brand-gold" />
                 <span className="text-sm font-semibold text-white">
                   {stats.totalUsers >= 1000 
                     ? `${(stats.totalUsers / 1000).toFixed(1)}K+`
                     : `${stats.totalUsers}+`} Students
                 </span>
             </div>
             <div className="w-px h-6 bg-white/10" />
             <div className="flex items-center gap-2">
                 <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                 <span className="text-sm font-semibold text-white">{stats.averageRating}/5 Rating</span>
             </div>
             <div className="w-px h-6 bg-white/10 hidden sm:block" />
             <div className="hidden sm:flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-brand-gold" />
                 <span className="text-sm font-semibold text-white">30-Day Guarantee</span>
             </div>
          </div>
          
          <div className="mt-12">
             <span className="inline-block px-4 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-widest animate-pulse">
                Limited Time: 50% Off Launch Pricing
             </span>
          </div>
        </div>
      </div>
    </section>
  )
}

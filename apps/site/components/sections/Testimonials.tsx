'use client'

import React, { useEffect, useState } from 'react'
import { Star, Quote, ShieldCheck } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Tech Entrepreneur",
    company: "SaaS Founder",
    content: "Aspire transformed my understanding of AI. I went from zero to building a profitable AI SaaS in 3 months. The business modules are pure gold.",
    rating: 5,
    initial: "S"
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Engineer",
    company: "Software Boutique",
    content: "The coding modules are incredible. I learned to build AI agents that actually work in production. The security section saved my company from a major breach.",
    rating: 5,
    initial: "M"
  },
  {
    name: "Emily Watson",
    role: "Creative Director",
    company: "Freelance Studio",
    content: "I never thought I'd understand AI, but Aspire made it click. Now I'm creating content at scale and my clients are amazed by the results.",
    rating: 5,
    initial: "E"
  },
  {
    name: "David Kim",
    role: "Financial Analyst",
    company: "Independent Trader",
    content: "The finance modules taught me to build ethical trading systems. The compliance focus is exactly what the industry needs. Game-changer.",
    rating: 5,
    initial: "D"
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Manager",
    company: "Marketing Agency",
    content: "Our team's productivity increased 300% after implementing the business automation strategies. The ROI was immediate and measurable.",
    rating: 5,
    initial: "L"
  },
  {
    name: "Alex Johnson",
    role: "Cybersecurity Expert",
    company: "Cyber Sec Consultant",
    content: "Finally, a course that teaches defensive AI properly. The OSINT and security modules are world-class. Every security professional needs this.",
    rating: 5,
    initial: "A"
  }
]

export function Testimonials() {
  const [stats, setStats] = useState({
    earlyAdopters: 500,
    averageRating: 4.9,
    completionRate: 95,
    commitment: 100,
  })

  useEffect(() => {
    // Fetch real stats from API
    const fetchStats = () => {
      fetch('/api/stats?' + Date.now()) // Add timestamp to prevent caching
        .then((res) => res.json())
        .then((data) => {
          setStats({
            earlyAdopters: Math.max(500, data.earlyAdopters || data.totalUsers || 500),
            averageRating: data.averageRating || 4.9,
            completionRate: data.completionRate || 95,
            commitment: 100, // Keep commitment at 100%
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
    <section className="relative py-32 bg-brand-dark-surface border-t border-white/5">
       {/* Background Noise Texture */}
       <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
       
      <div className="container-width relative z-10">
        <div className="text-center mb-20">
          <span className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Success Stories</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
            The Elite <span className="text-gradient-gold">Speak</span>
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Join the ranks of professionals redefining their industries with Aspire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card p-8 hover:bg-white/5 transition-colors duration-300"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-white/10 mb-4" />
              
              <p className="text-gray-300 mb-8 leading-relaxed italic relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                  <span className="text-white font-display font-bold text-lg">
                    {testimonial.initial}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{testimonial.name}</div>
                  <div className="text-brand-gold/80 text-xs uppercase tracking-wide font-medium">
                    {testimonial.role}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats Bar */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                {stats.earlyAdopters >= 1000 
                  ? `${(stats.earlyAdopters / 1000).toFixed(1)}K+`
                  : `${stats.earlyAdopters}+`}
              </div>
              <div className="text-brand-gold text-sm uppercase tracking-widest">Early Adopters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stats.averageRating}</div>
              <div className="text-brand-gold text-sm uppercase tracking-widest">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stats.completionRate}%</div>
              <div className="text-brand-gold text-sm uppercase tracking-widest">Completion</div>
            </div>
             <div className="text-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stats.commitment}%</div>
              <div className="text-brand-gold text-sm uppercase tracking-widest">Commitment</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { Brain, Code, Palette, DollarSign, Shield, Zap, ArrowRight, Layers, Terminal } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Brain,
    title: "AI Foundations",
    description: "Master the fundamentals of LLMs, diffusion models, and prompt engineering.",
    color: "text-blue-400"
  },
  {
    icon: DollarSign,
    title: "AI for Business",
    description: "Automate sales funnels, create viral content, and build growth engines.",
    color: "text-emerald-400"
  },
  {
    icon: Code,
    title: "AI for Coding",
    description: "Build AI agents, rapid SaaS products, and ML-backed applications.",
    color: "text-purple-400"
  },
  {
    icon: Palette,
    title: "AI for Design",
    description: "Create image generation pipelines, video automation, and content at scale.",
    color: "text-pink-400"
  },
  {
    icon: Shield,
    title: "AI Security & OSINT",
    description: "Learn defensive AI, fraud detection, and ethical red-teaming.",
    color: "text-red-400"
  },
  {
    icon: Zap,
    title: "Personal AI",
    description: "Build your personal AI shadow, automate life tasks, and create privacy-first assistants.",
    color: "text-amber-400"
  }
]

export function Features() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-width relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Comprehensive Curriculum</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Master AI Across <span className="text-gradient-gold">Every Domain</span>
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Our curriculum is designed for elite professionals. We strip away the noise and focus on high-impact, applied AI mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className={`w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-brand-gold/30 transition-colors duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              
              <h3 className="font-display text-2xl font-bold mb-4 text-white group-hover:text-brand-gold transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-8">
                {feature.description}
              </p>

              <Link href="/courses" className="inline-flex items-center text-sm font-semibold text-white group-hover:text-brand-gold transition-colors">
                Explore Module <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Floating Stats Bar */}
        <div className="mt-24">
          <div className="glass-panel max-w-5xl mx-auto px-12 py-10 flex flex-wrap justify-between items-center gap-8 md:gap-0">
             <div className="text-center md:text-left">
               <div className="flex items-center gap-3 mb-1">
                 <Terminal className="w-5 h-5 text-brand-gold" />
                 <span className="text-3xl font-display font-bold text-white">50+</span>
               </div>
               <span className="text-sm text-muted-foreground uppercase tracking-wider">Lessons</span>
             </div>
             <div className="w-px h-12 bg-white/10 hidden md:block" />
             <div className="text-center md:text-left">
               <div className="flex items-center gap-3 mb-1">
                 <Layers className="w-5 h-5 text-brand-gold" />
                 <span className="text-3xl font-display font-bold text-white">9</span>
               </div>
               <span className="text-sm text-muted-foreground uppercase tracking-wider">Modules</span>
             </div>
             <div className="w-px h-12 bg-white/10 hidden md:block" />
             <div className="text-center md:text-left">
               <div className="flex items-center gap-3 mb-1">
                 <Brain className="w-5 h-5 text-brand-gold" />
                 <span className="text-3xl font-display font-bold text-white">3</span>
               </div>
               <span className="text-sm text-muted-foreground uppercase tracking-wider">Capstones</span>
             </div>
             <div className="w-px h-12 bg-white/10 hidden md:block" />
             <div className="text-center md:text-left">
               <div className="flex items-center gap-3 mb-1">
                 <Zap className="w-5 h-5 text-brand-gold" />
                 <span className="text-3xl font-display font-bold text-white">30+</span>
               </div>
               <span className="text-sm text-muted-foreground uppercase tracking-wider">Hours</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

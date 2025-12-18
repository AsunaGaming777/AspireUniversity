'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Play, Star, Users, Award, X, ArrowRight, ChevronRight, PlayCircle } from 'lucide-react'

export function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-[20%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>
      
      <div className="container-width relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Elite Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-10 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
            </span>
            <span className="text-brand-gold/90 text-sm font-medium tracking-wide uppercase">
              The Apex of AI Education
            </span>
          </div>

          {/* Luxury Headline */}
          <h1 className="font-display text-5xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tight animate-fade-in-up [animation-delay:200ms]">
            <span className="block text-white">Dominate The</span>
            <span className="block text-gradient-gold">Age of AI</span>
          </h1>

          {/* Sophisticated Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up [animation-delay:400ms]">
            Join the elite circle of professionals mastering applied AI, defensive security, and automated wealth generation. This isn't just a course—it's an unfair advantage.
          </p>

          {/* Premium CTA Area */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up [animation-delay:600ms]">
            <Link href="/courses" className="w-full sm:w-auto">
              <button className="btn-luxury w-full sm:w-auto group flex items-center justify-center gap-2">
                Begin Your Ascent
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <button 
              className="btn-outline-luxury w-full sm:w-auto group flex items-center justify-center gap-2"
              onClick={() => setIsVideoPlaying(true)}
            >
              <PlayCircle className="w-5 h-5 text-brand-gold group-hover:text-white transition-colors" />
              <span>Watch Manifesto</span>
            </button>
          </div>

          {/* High-End Social Proof */}
          <div className="border-t border-white/10 pt-10 animate-fade-in-up [animation-delay:800ms]">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-6 font-medium">Master Industry-Leading Tools</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Tools we teach */}
               <span className="text-xl font-display font-bold text-white">OpenAI</span>
               <span className="text-xl font-display font-bold text-white">Anthropic</span>
               <span className="text-xl font-display font-bold text-white">Gemini</span>
               <span className="text-xl font-display font-bold text-white">Midjourney</span>
               <span className="text-xl font-display font-bold text-white">TensorFlow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal - Glassmorphism Style */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-brand-gold transition-colors z-10 bg-black/50 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-zinc-900 flex items-center justify-center relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-center z-10">
                <div className="w-20 h-20 rounded-full border border-brand-gold/30 flex items-center justify-center mx-auto mb-6 bg-brand-gold/10 group-hover:scale-110 transition-transform duration-500">
                  <Play className="w-8 h-8 text-brand-gold ml-1" />
                </div>
                <p className="text-white/60 font-display text-lg tracking-widest uppercase">Manifesto Loading...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

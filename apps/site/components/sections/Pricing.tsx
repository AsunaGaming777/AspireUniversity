'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight, Shield } from 'lucide-react'

const plans = [
  {
    name: "Standard",
    price: 497,
    originalPrice: 997,
    description: "The essential toolkit for AI literacy and application.",
    features: [
      "9 Comprehensive Modules",
      "50+ Video Lessons",
      "Downloadable Code Assets",
      "Certificate of Completion",
      "Lifetime Access"
    ],
    cta: "Get Standard",
    popular: false,
    image: "/plans/kunai.jpg",
    color: "from-zinc-500 to-zinc-300"
  },
  {
    name: "Mastery",
    price: 997,
    originalPrice: 1997,
    description: "For professionals demanding elite-level capability.",
    features: [
      "Everything in Standard",
      "3 Live Group Calls",
      "Exclusive Capstone Code",
      "1-on-1 Office Hours",
      "Priority Support",
      "Mastermind Community"
    ],
    cta: "Get Mastery",
    popular: true,
    image: "/plans/katana.jpg",
    color: "from-brand-gold to-amber-500"
  },
  {
    name: "Mastermind",
    price: 197,
    period: "month",
    description: "Continuous evolution with the bleeding edge of AI.",
    features: [
      "Everything in Standard",
      "Monthly New Content",
      "Live Q&A Sessions",
      "Cancel Anytime",
      "Latest AI Tools Access"
    ],
    cta: "Start Mastermind",
    popular: false,
    image: "/plans/oni-mask.jpg",
    color: "from-blue-400 to-cyan-400"
  }
]

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="container-width relative z-10">
        <div className="text-center mb-20">
          <span className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4 block">Investment</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
            Choose Your <span className="text-gradient-gold">Trajectory</span>
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-10">
            Select the level of mastery that aligns with your ambition.
          </p>
          
          {/* Custom Billing Toggle */}
          <div className="inline-flex items-center p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isAnnual ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
            >
              One-time
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isAnnual ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="glass-card relative p-8 md:p-10 transition-all duration-300 border border-transparent hover:border-white/20 hover:-translate-y-2"
            >
              
              <div className="mb-8">
                <div className="relative w-16 h-16 mb-6 overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={plan.image}
                    alt={`${plan.name} plan icon`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm h-10">
                  {plan.description}
                </p>
              </div>
              
              <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    ${plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  )}
                </div>
                {plan.originalPrice && (
                  <div className="text-muted-foreground/60 text-sm line-through mt-1">
                    ${plan.originalPrice}
                  </div>
                )}
              </div>
              
              <ul className="space-y-4 mb-10 text-sm">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-brand-gold" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href={`/checkout?plan=${plan.name.toLowerCase()}`} className="block">
                <button 
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white text-brand-black hover:bg-brand-gold hover:shadow-[0_0_20px_rgba(245,215,110,0.4)]"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Guarantee Seal */}
        <div className="mt-20 flex justify-center">
          <div className="glass-panel px-8 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Risk-Free Guarantee</p>
              <p className="text-muted-foreground text-xs">30-day money-back guarantee on all plans.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

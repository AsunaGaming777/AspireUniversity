'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@aspire/ui'

export function OnboardingPrompt() {
  return (
    <div className="card bg-gradient-to-br from-brand-gold/10 to-brand-deep-gold/5 border-brand-gold/30 mb-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-brand-gold/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-brand-gold" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-display font-bold text-white mb-2">
            Personalize Your Learning Experience
          </h3>
          <p className="text-muted-foreground mb-4">
            Answer a few quick questions to get personalized course recommendations and the perfect plan for your goals.
          </p>
          <Link href="/onboarding">
            <Button className="flex items-center gap-2">
              Start Onboarding
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


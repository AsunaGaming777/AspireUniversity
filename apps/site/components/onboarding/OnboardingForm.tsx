'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@aspire/ui'
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'

interface OnboardingData {
  goals: string[]
  experienceLevel: string
  interests: string[]
  timeCommitment: string
  learningStyle: string
  currentRole?: string
}

const GOALS = [
  { id: 'career-change', label: 'Career Change', description: 'Transition to an AI-focused role' },
  { id: 'skill-up', label: 'Skill Up', description: 'Enhance my current skills' },
  { id: 'start-business', label: 'Start a Business', description: 'Build an AI-powered business' },
  { id: 'personal-growth', label: 'Personal Growth', description: 'Learn for personal interest' },
  { id: 'automate-work', label: 'Automate Work', description: 'Automate tasks at my job' },
]

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Complete Beginner', description: 'New to AI' },
  { id: 'some-knowledge', label: 'Some Knowledge', description: 'Familiar with basics' },
  { id: 'intermediate', label: 'Intermediate', description: 'Comfortable with AI tools' },
  { id: 'advanced', label: 'Advanced', description: 'Want to master advanced topics' },
]

const INTERESTS = [
  { id: 'business', label: 'Business & Strategy', icon: '💼' },
  { id: 'coding', label: 'Coding & Development', icon: '💻' },
  { id: 'design', label: 'Design & Creativity', icon: '🎨' },
  { id: 'security', label: 'Security & OSINT', icon: '🔒' },
  { id: 'finance', label: 'Finance & Trading', icon: '💰' },
  { id: 'automation', label: 'Automation', icon: '⚙️' },
  { id: 'research', label: 'Research & Innovation', icon: '🔬' },
  { id: 'healthcare', label: 'Healthcare & Longevity', icon: '🏥' },
]

const TIME_COMMITMENT = [
  { id: '1-3', label: '1-3 hours/week', description: 'Casual learner' },
  { id: '4-7', label: '4-7 hours/week', description: 'Regular commitment' },
  { id: '8-12', label: '8-12 hours/week', description: 'Serious learner' },
  { id: '13+', label: '13+ hours/week', description: 'Intensive study' },
]

const LEARNING_STYLES = [
  { id: 'hands-on', label: 'Hands-On Projects', description: 'Learn by doing' },
  { id: 'structured', label: 'Structured Courses', description: 'Step-by-step lessons' },
  { id: 'self-paced', label: 'Self-Paced', description: 'Go at my own speed' },
  { id: 'community', label: 'Community Learning', description: 'Learn with others' },
]

export function OnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    experienceLevel: '',
    interests: [],
    timeCommitment: '',
    learningStyle: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) {
      // Smooth transition to next step
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save onboarding data')
      }

      // Redirect to dashboard
      router.push('/dashboard?onboarded=true')
    } catch (error) {
      console.error('Onboarding error:', error)
      // Still redirect even if save fails
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.goals.length > 0
      case 2:
        return data.experienceLevel !== ''
      case 3:
        return data.interests.length > 0
      case 4:
        return data.timeCommitment !== ''
      case 5:
        return data.learningStyle !== ''
      default:
        return false
    }
  }

  return (
    <div className={`card transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          <span className="text-sm text-brand-gold font-semibold">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-brand-black rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-gold to-brand-deep-gold transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Goals */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              What are your <span className="gradient-text">goals</span>?
            </h2>
            <p className="text-muted-foreground">
              Select all that apply. We'll personalize your learning path.
            </p>
          </div>

          <div className="grid gap-4">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    goals: data.goals.includes(goal.id)
                      ? data.goals.filter((g) => g !== goal.id)
                      : [...data.goals, goal.id],
                  })
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.goals.includes(goal.id)
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-border hover:border-brand-gold/50 bg-brand-black'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{goal.label}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  {data.goals.includes(goal.id) && (
                    <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Experience Level */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              What's your <span className="gradient-text">experience level</span>?
            </h2>
            <p className="text-muted-foreground">
              Help us recommend the right starting point.
            </p>
          </div>

          <div className="grid gap-4">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setData({ ...data, experienceLevel: level.id })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.experienceLevel === level.id
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-border hover:border-brand-gold/50 bg-brand-black'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{level.label}</h3>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                  {data.experienceLevel === level.id && (
                    <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              What <span className="gradient-text">interests</span> you most?
            </h2>
            <p className="text-muted-foreground">
              Select your top interests. We'll prioritize relevant courses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {INTERESTS.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => {
                  setData({
                    ...data,
                    interests: data.interests.includes(interest.id)
                      ? data.interests.filter((i) => i !== interest.id)
                      : [...data.interests, interest.id],
                  })
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.interests.includes(interest.id)
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-border hover:border-brand-gold/50 bg-brand-black'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="font-medium text-white text-sm">{interest.label}</span>
                  {data.interests.includes(interest.id) && (
                    <CheckCircle2 className="w-4 h-4 text-brand-gold ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Time Commitment */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              How much time can you <span className="gradient-text">commit</span>?
            </h2>
            <p className="text-muted-foreground">
              This helps us recommend the right plan and pace.
            </p>
          </div>

          <div className="grid gap-4">
            {TIME_COMMITMENT.map((commitment) => (
              <button
                key={commitment.id}
                type="button"
                onClick={() => setData({ ...data, timeCommitment: commitment.id })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.timeCommitment === commitment.id
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-border hover:border-brand-gold/50 bg-brand-black'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{commitment.label}</h3>
                    <p className="text-sm text-muted-foreground">{commitment.description}</p>
                  </div>
                  {data.timeCommitment === commitment.id && (
                    <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Learning Style */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              How do you <span className="gradient-text">learn best</span>?
            </h2>
            <p className="text-muted-foreground">
              We'll tailor the experience to your preferences.
            </p>
          </div>

          <div className="grid gap-4">
            {LEARNING_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setData({ ...data, learningStyle: style.id })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  data.learningStyle === style.id
                    ? 'border-brand-gold bg-brand-gold/10'
                    : 'border-border hover:border-brand-gold/50 bg-brand-black'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{style.label}</h3>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                  {data.learningStyle === style.id && (
                    <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {step < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Complete Setup
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}


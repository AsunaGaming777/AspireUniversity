'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@aspire/ui'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      // Send plain password - server will hash it securely
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password, // Server will hash this
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong')
        setIsLoading(false)
        return
      }

      // Automatically sign in the user after successful registration
      try {
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (signInResult?.error) {
          // If auto sign-in fails, still show success but redirect to sign in
          console.error('Auto sign-in failed:', signInResult.error)
          setIsSuccess(true)
          setIsLoading(false)
          setTimeout(() => {
            router.push('/auth/signin?message=Account created. Please sign in.')
          }, 1500)
          return
        }

        // Show success state
        setIsSuccess(true)
        setIsLoading(false)

        // Smooth transition to onboarding after a brief delay
        setTimeout(() => {
          router.push('/onboarding')
        }, 1500)
      } catch (signInError) {
        // If sign-in fails, still show success but redirect to sign in
        console.error('Auto sign-in error:', signInError)
        setIsSuccess(true)
        setIsLoading(false)
        setTimeout(() => {
          router.push('/auth/signin?message=Account created. Please sign in.')
        }, 1500)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 constellation-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/aspire-logo.png"
              alt="Aspire Academy"
              width={60}
              height={60}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-heading font-bold gradient-text mb-2">
            Join Aspire Academy
          </h1>
          <p className="text-brand-muted-text">
            Start your AI mastery journey today
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-8 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-brand-gold" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Account Created Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Setting up your personalized learning experience...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 text-brand-gold animate-spin" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-muted-text mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-brand-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-muted-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-brand-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-muted-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-brand-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <p className="mt-1 text-xs text-brand-muted-text">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-muted-text mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-brand-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          )}

          {!isSuccess && (
            <p className="mt-6 text-center text-sm text-brand-muted-text">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-brand-gold hover:text-brand-deep-gold font-medium"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>

        {!isSuccess && (
          <p className="mt-6 text-center text-xs text-brand-muted-text">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-brand-gold hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand-gold hover:underline">
              Privacy Policy
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
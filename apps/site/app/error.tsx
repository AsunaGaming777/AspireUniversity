'use client'

import { useEffect } from 'react'
import { Button } from '@aspire/ui'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center constellation-bg px-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-white mb-4">
            Something Went Wrong
          </h2>
          <p className="text-brand-muted-text mb-6">
            We encountered an unexpected error. Our team has been notified.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => reset()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}




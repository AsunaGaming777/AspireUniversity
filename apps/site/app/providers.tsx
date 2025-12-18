'use client'

import { SessionProvider, useSession, signOut } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// Convenience hook for auth
export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user,
    status,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    signOut: () => signOut(),
  }
}


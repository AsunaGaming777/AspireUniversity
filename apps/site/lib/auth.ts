import NextAuth from 'next-auth'
import { getServerSession } from 'next-auth/next'
import authConfig from './auth.config'

// Ensure NEXTAUTH_SECRET is set and meets length requirement (at least 32 chars)
const FALLBACK_SECRET = 'development-secret-key-that-is-at-least-32-characters-long-for-nextauth-12345'

let nextAuthSecret = process.env.NEXTAUTH_SECRET || FALLBACK_SECRET

// Ensure secret is at least 32 characters
if (nextAuthSecret.length < 32) {
  console.warn('⚠️  NEXTAUTH_SECRET is too short. Using fallback for development.')
  nextAuthSecret = FALLBACK_SECRET
}

// Set it back to process.env so NextAuth can use it
process.env.NEXTAUTH_SECRET = nextAuthSecret

// Initialize NextAuth configuration
const nextAuthConfig = {
  ...authConfig,
  secret: nextAuthSecret,
}

// Verify providers exist
if (!nextAuthConfig.providers || nextAuthConfig.providers.length === 0) {
  console.error('❌ No providers configured in NextAuth config!')
  throw new Error('NextAuth requires at least one provider. Check your auth.config.ts')
}

console.log(`🔐 Initializing NextAuth with ${nextAuthConfig.providers.length} provider(s)`)

// In NextAuth v4, NextAuth(config) returns a function that handles both GET and POST
// For App Router, we need to wrap it to work with route handlers
const nextAuthHandler = NextAuth(nextAuthConfig)

// Create handlers object for App Router
// The handler function expects (req, context) where context has params
export const handlers = {
  GET: async (req: Request, context: { params: Promise<{ nextauth: string[] }> }) => {
    return nextAuthHandler(req, context)
  },
  POST: async (req: Request, context: { params: Promise<{ nextauth: string[] }> }) => {
    return nextAuthHandler(req, context)
  },
}

// Export auth function using getServerSession
export const auth = async () => {
  return getServerSession(nextAuthConfig)
}

// signIn and signOut are typically used on the client side via next-auth/react
// For server-side, they're handled through the API routes
export const signIn = async (provider?: string, options?: any) => {
  // This redirects to the sign-in page
  return { url: `/api/auth/signin${provider ? `/${provider}` : ''}` }
}

export const signOut = async (options?: any) => {
  // This redirects to the sign-out endpoint
  return { url: '/api/auth/signout' }
}

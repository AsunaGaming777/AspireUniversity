import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AIToolsList from '@/components/ai-tools/AIToolsList'
import { Sparkles, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AIToolsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/ai-tools')
  }

  // Allow team members to bypass (check role first before database query)
  const userRole = session.user.role as string
  const isTeam = ['admin', 'overseer', 'instructor', 'council'].includes(userRole)
  
  // If user is team member, grant access immediately (no DB query needed)
  if (isTeam) {
    return <AIToolsList />
  }

  // Check active subscription (only for non-team members)
  let subscription = null
  try {
    subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    })
  } catch (error) {
    // Database connection error - log but don't block team members
    console.error('Database connection error:', error)
    // If DB is down, we can't verify subscription, so deny access for non-team members
    // Team members already bypassed above
  }
  
  const hasAccess = !!subscription

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white pt-32 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container-width relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 mb-8">
            <Lock className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold text-sm font-medium tracking-wide uppercase">
              Members Only Resource
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">
            Unlock the <span className="text-gradient-gold">AI Tool Directory</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Get instant access to our curated database of 250+ top-tier AI tools. 
            Stop wasting time searching and start building with the right technology.
          </p>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
            {[
              { title: "250+ Curated Tools", desc: "Hand-picked for quality and utility." },
              { title: "Smart Categorization", desc: "Find exactly what you need in seconds." },
              { title: "Always Updated", desc: "New tools added weekly as the market evolves." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-brand-gold mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/pricing" 
              className="px-8 py-4 bg-brand-gold text-black font-bold rounded-xl hover:bg-brand-deep-gold transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Get Access Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/10"
            >
              Back to Dashboard
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Already a member? <Link href="/auth/signin" className="text-brand-gold hover:underline">Sign in</Link> with your active account.
          </p>
        </div>
      </div>
    )
  }

  return <AIToolsList />
}

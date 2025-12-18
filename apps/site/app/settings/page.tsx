import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/settings/SettingsForm'

export const metadata = {
  title: 'Settings - Aspire Academy',
  description: 'Manage your account settings and preferences',
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/settings')
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true,
      learningProfile: true,
    },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-2 text-white">
            Account <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and profile information
          </p>
        </div>

        {/* Settings Form */}
        <SettingsForm user={user} />
      </div>
    </div>
  )
}


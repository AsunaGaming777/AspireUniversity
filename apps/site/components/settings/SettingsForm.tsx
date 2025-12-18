'use client'

import { useState } from 'react'
import { Button } from '@aspire/ui'
import { Save, User, Lock, Bell, Shield, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  twoFactorEnabled: boolean
  publicProfile: boolean
  showOnLeaderboard: boolean
  optInCaseStudy: boolean
  timezone: string | null
  age: number | null
  studentProfile: {
    currentLevel: string | null
    learningGoals: string | null
    preferredTopics: string | null
    timeCommitment: number | null
  } | null
}

interface SettingsFormProps {
  user: User
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    timezone: user.timezone || '',
    age: user.age?.toString() || '',
    currentLevel: user.studentProfile?.currentLevel || '',
    learningGoals: user.studentProfile?.learningGoals || '',
    preferredTopics: user.studentProfile?.preferredTopics || '',
    timeCommitment: user.studentProfile?.timeCommitment?.toString() || '',
    publicProfile: user.publicProfile,
    showOnLeaderboard: user.showOnLeaderboard,
    optInCaseStudy: user.optInCaseStudy,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings')
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' })
      router.refresh()
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save settings' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-brand-gold" />
          <h2 className="text-2xl font-display font-bold text-white">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-brand-black border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 bg-brand-black/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Timezone
              </label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-4 py-2 bg-brand-black border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                placeholder="e.g., America/New_York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 bg-brand-black border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                placeholder="Optional"
                min="13"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-brand-gold" />
          <h2 className="text-2xl font-display font-bold text-white">Learning Preferences</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Current Level
            </label>
            <select
              value={formData.currentLevel}
              onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
              className="w-full px-4 py-2 bg-brand-black border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Learning Goals
            </label>
            <textarea
              value={formData.learningGoals}
              onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
              className="w-full px-4 py-2 bg-brand-black border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
              rows={3}
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Preferred Topics
            </label>
            <input
              type="text"
              value={formData.preferredTopics}
              onChange={(e) => setFormData({ ...formData, preferredTopics: e.target.value })}
              className="w-full px-4 py-2 bg-brand-black border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="e.g., AI for Business, Machine Learning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Time Commitment (hours per week)
            </label>
            <input
              type="number"
              value={formData.timeCommitment}
              onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
              className="w-full px-4 py-2 bg-brand-black border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="e.g., 10"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-brand-gold" />
          <h2 className="text-2xl font-display font-bold text-white">Privacy & Visibility</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.publicProfile}
              onChange={(e) => setFormData({ ...formData, publicProfile: e.target.checked })}
              className="w-5 h-5 rounded border-border bg-brand-black text-brand-gold focus:ring-brand-gold"
            />
            <div>
              <p className="text-white font-medium">Public Profile</p>
              <p className="text-sm text-muted-foreground">
                Allow others to view your profile
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showOnLeaderboard}
              onChange={(e) => setFormData({ ...formData, showOnLeaderboard: e.target.checked })}
              className="w-5 h-5 rounded border-border bg-brand-black text-brand-gold focus:ring-brand-gold"
            />
            <div>
              <p className="text-white font-medium">Show on Leaderboard</p>
              <p className="text-sm text-muted-foreground">
                Display your progress on public leaderboards
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.optInCaseStudy}
              onChange={(e) => setFormData({ ...formData, optInCaseStudy: e.target.checked })}
              className="w-5 h-5 rounded border-border bg-brand-black text-brand-gold focus:ring-brand-gold"
            />
            <div>
              <p className="text-white font-medium">Opt-in for Case Studies</p>
              <p className="text-sm text-muted-foreground">
                Allow us to feature your success story (with permission)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-brand-gold" />
          <h2 className="text-2xl font-display font-bold text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-brand-black rounded-lg">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                {user.twoFactorEnabled ? 'Enabled' : 'Not enabled'}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/settings/2fa')}
            >
              {user.twoFactorEnabled ? 'Manage' : 'Enable'}
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-destructive">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="w-6 h-6 text-destructive" />
          <h2 className="text-2xl font-display font-bold text-white">Danger Zone</h2>
        </div>

        <div className="p-4 bg-brand-black rounded-lg">
          <p className="text-white font-medium mb-2">Delete Account</p>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                router.push('/settings/delete-account')
              }
            }}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
            : 'bg-destructive/20 border border-destructive/50 text-destructive'
        }`}>
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}


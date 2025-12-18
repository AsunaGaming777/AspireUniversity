'use client'

import { useState } from 'react'
import { Download, Upload, Users, Ban, Shield, Send, Plus, CheckSquare, Square } from 'lucide-react'
import { bulkUpdateRoles, bulkBanUsers, exportUsersCSV, createTestUser } from '@/app/actions/owner-advanced-actions'
import { UserRole } from '@prisma/client'

interface BulkOperationsProps {
  onRefresh: () => void
  selectedUserIds?: string[]
}

export function BulkOperations({ onRefresh, selectedUserIds = [] }: BulkOperationsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [testUserCount, setTestUserCount] = useState(1)
  const [testUserSubscription, setTestUserSubscription] = useState<'standard' | 'mastery' | 'mastermind' | 'none'>('none')

  const handleBulkRoleUpdate = async (role: UserRole) => {
    if (selectedUserIds.length === 0) return
    setIsProcessing(true)
    await bulkUpdateRoles(selectedUserIds, role)
    setIsProcessing(false)
    onRefresh()
  }

  const handleBulkBan = async () => {
    if (selectedUserIds.length === 0 || !confirm(`Ban ${selectedUserIds.length} users?`)) return
    setIsProcessing(true)
    await bulkBanUsers(selectedUserIds)
    setIsProcessing(false)
    onRefresh()
  }

  const handleExport = async () => {
    setIsProcessing(true)
    const result = await exportUsersCSV()
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users_export_${Date.now()}.csv`
      a.click()
    }
    setIsProcessing(false)
  }

  const handleCreateTestUser = async () => {
    if (testUserCount < 1 || testUserCount > 100) {
      alert('Please enter a number between 1 and 100')
      return
    }
    
    setIsProcessing(true)
    const result = await createTestUser(
      testUserCount, 
      testUserSubscription === 'none' ? undefined : testUserSubscription
    )
    
    if (result.success) {
      alert(result.message)
      setTestUserCount(1)
      setTestUserSubscription('none')
    } else {
      alert(`Error: ${result.message}`)
    }
    
    setIsProcessing(false)
    onRefresh()
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulk Actions */}
        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Bulk Operations</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              disabled={isProcessing}
              className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export to CSV</span>
            </button>

            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-gray-500 mb-3">
                {selectedUserIds.length > 0 
                  ? `Selected: ${selectedUserIds.length} users (select users in Users tab)`
                  : 'Select users in Users tab to perform bulk actions'}
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleBulkRoleUpdate('admin')}
                  disabled={selectedUserIds.length === 0 || isProcessing}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="w-4 h-4" />
                  Make Admin
                </button>
                
                <button
                  onClick={() => handleBulkRoleUpdate('student')}
                  disabled={selectedUserIds.length === 0 || isProcessing}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Users className="w-4 h-4" />
                  Make Student
                </button>
                
                <button
                  onClick={handleBulkBan}
                  disabled={selectedUserIds.length === 0 || isProcessing}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors text-sm col-span-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ban className="w-4 h-4" />
                  Ban Selected
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Create Test Users</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Number of Users</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={testUserCount}
                    onChange={(e) => setTestUserCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg text-white"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Subscription Plan</label>
                  <select
                    value={testUserSubscription}
                    onChange={(e) => setTestUserSubscription(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg text-white"
                  >
                    <option value="none">No Subscription</option>
                    <option value="standard">Standard</option>
                    <option value="mastery">Mastery</option>
                    <option value="mastermind">Mastermind</option>
                  </select>
                </div>
                <button
                  onClick={handleCreateTestUser}
                  disabled={testUserCount < 1 || isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-gold text-black rounded-lg font-semibold hover:bg-brand-deep-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Create {testUserCount} Test User{testUserCount > 1 ? 's' : ''}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                <Send className="w-5 h-5" />
                Send Announcement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


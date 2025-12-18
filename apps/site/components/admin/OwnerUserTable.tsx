'use client'

import { useState } from 'react'
import { Search, MoreVertical, Shield, CreditCard, Ban, Trash2, X, Check, CheckSquare, Square } from 'lucide-react'
import { UserRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client'
import { updateUserRole, updateUserSubscription, banUser, deleteUser } from '@/app/actions/owner-actions'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '@/lib/date-utils'

interface UserWithDetails {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  subscriptions: {
    status: string
    plan: string
  }[]
  _count: {
    enrollments: number
  }
}

interface OwnerUserTableProps {
  users: UserWithDetails[]
  onSelectionChange?: (selectedIds: string[]) => void
}

export default function OwnerUserTable({ users, onSelectionChange }: OwnerUserTableProps) {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('')

  const filtered = users.filter((u) => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.includes(search)
    const matchesRole = !roleFilter || u.role === roleFilter
    const matchesSubscription = !subscriptionFilter || 
      u.subscriptions.some(s => s.status === subscriptionFilter || s.plan === subscriptionFilter)
    return matchesSearch && matchesRole && matchesSubscription
  })

  const toggleSelect = (userId: string) => {
    const newSelection = selectedIds.includes(userId)
      ? selectedIds.filter(id => id !== userId)
      : [...selectedIds, userId]
    setSelectedIds(newSelection)
    onSelectionChange?.(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
      onSelectionChange?.([])
    } else {
      const allIds = filtered.map(u => u.id)
      setSelectedIds(allIds)
      onSelectionChange?.(allIds)
    }
  }

  const handleUpdateRole = async (newRole: string) => {
    if (!selectedUser) return
    setIsProcessing(true)
    await updateUserRole(selectedUser.id, newRole as UserRole)
    setIsProcessing(false)
    setSelectedUser(null)
  }

  const handleUpdateSub = async (plan: string, status: string) => {
    if (!selectedUser) return
    setIsProcessing(true)
    await updateUserSubscription(selectedUser.id, plan as SubscriptionPlan, status as SubscriptionStatus)
    setIsProcessing(false)
    setSelectedUser(null)
  }

  const handleBan = async () => {
    if (!selectedUser || !confirm('Are you sure you want to ban this user?')) return
    setIsProcessing(true)
    await banUser(selectedUser.id)
    setIsProcessing(false)
    setSelectedUser(null)
  }

  const handleDelete = async () => {
    if (!selectedUser || !confirm('CRITICAL: This will permanently delete the user. Continue?')) return
    setIsProcessing(true)
    await deleteUser(selectedUser.id)
    setIsProcessing(false)
    setSelectedUser(null)
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0c0c0e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-[#0c0c0e] border border-white/10 rounded-lg text-white"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="overseer">Overseer</option>
            <option value="instructor">Instructor</option>
          </select>

          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            className="px-4 py-2 bg-[#0c0c0e] border border-white/10 rounded-lg text-white"
          >
            <option value="">All Subscriptions</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="mastermind">Mastermind</option>
            <option value="mastery">Mastery</option>
            <option value="standard">Standard</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 w-12">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-white">
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6">
                    <button onClick={() => toggleSelect(user.id)} className="text-gray-400 hover:text-white">
                      {selectedIds.includes(user.id) ? (
                        <CheckSquare className="w-5 h-5 text-brand-gold" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{user.name || 'No Name'}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                      <span className="text-xs text-gray-600 font-mono mt-1">{user.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                      user.role === 'overseer' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      user.role === 'student' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.subscriptions.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {user.subscriptions.map((sub, i) => (
                          <span key={i} className={`px-2 py-1 rounded-md text-xs font-medium border w-fit ${
                            sub.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {sub.plan} ({sub.status})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-600 text-sm">No subscription</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal - keeping existing modal code */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c0e] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white">Manage User</h3>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xl">
                    {selectedUser.name?.[0] || selectedUser.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{selectedUser.name}</h4>
                    <p className="text-sm text-gray-400">{selectedUser.email}</p>
                    <p className="text-xs text-gray-600 font-mono mt-1">{selectedUser.id}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role Assignment</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['student', 'mentor', 'instructor', 'admin', 'moderator', 'ambassador', 'overseer'].map((role) => (
                      <button
                        key={role}
                        disabled={isProcessing}
                        onClick={() => handleUpdateRole(role)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          selectedUser.role === role
                            ? 'bg-brand-gold text-black border-brand-gold'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-brand-gold/50 hover:text-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subscription Override</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                      onChange={(e) => handleUpdateSub(e.target.value, 'active')}
                      defaultValue={selectedUser.subscriptions[0]?.plan || ''}
                    >
                      <option value="" disabled>Select Plan</option>
                      {['standard', 'mastery', 'mastermind'].map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                    <select
                      className="bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                      onChange={(e) => handleUpdateSub(selectedUser.subscriptions[0]?.plan || 'standard', e.target.value)}
                      defaultValue={selectedUser.subscriptions[0]?.status || ''}
                    >
                      <option value="" disabled>Select Status</option>
                      {['active', 'cancelled', 'past_due', 'trialing'].map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleBan}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-semibold"
                  >
                    <Ban className="w-4 h-4" />
                    Ban / Suspend
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isProcessing}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 text-red-400 border border-red-900/30 rounded-xl hover:bg-red-900/40 transition-colors font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

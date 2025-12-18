'use client'

import { useState } from 'react'
import { Shield, Users, CreditCard, Activity, DollarSign, BookOpen, Database, FileText, Settings, Zap } from 'lucide-react'
import OwnerUserTable from '@/components/admin/OwnerUserTable'
import { FinancialAnalytics } from '@/components/admin/FinancialAnalytics'
import { CourseManagement } from '@/components/admin/CourseManagement'
import { SystemHealth } from '@/components/admin/SystemHealth'
import { AuditLogs } from '@/components/admin/AuditLogs'
import { BulkOperations } from '@/components/admin/BulkOperations'
import { motion } from 'framer-motion'

interface OwnerPanelClientProps {
  users: any[]
  stats: {
    totalUsers: number
    activeSubs: number
    admins: number
    totalRevenue: number
  }
  financialData: any
  auditLogs: any[]
  courseAnalytics: any[]
  systemHealth: any
}

const tabs = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'system', label: 'System Health', icon: Database },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'bulk', label: 'Bulk Operations', icon: Zap },
]

export default function OwnerPanelClient({
  users,
  stats,
  financialData,
  auditLogs,
  courseAnalytics,
  systemHealth,
}: OwnerPanelClientProps) {
  const [activeTab, setActiveTab] = useState('users')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white pt-16">
      {/* Header */}
      <div className="bg-[#0c0c0e] border-b border-white/10 sticky top-16 z-40 w-full">
        <div className="w-full px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
              <Shield className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display">Owner Control Panel</h1>
              <p className="text-xs text-gray-500">Full System Access</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              systemHealth.database?.status === 'healthy' 
                ? 'bg-white/5 border-white/5' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                systemHealth.database?.status === 'healthy' 
                  ? 'bg-green-500 animate-pulse' 
                  : 'bg-red-500'
              }`} />
              <span className={`text-xs font-medium ${
                systemHealth.database?.status === 'healthy' 
                  ? 'text-gray-300' 
                  : 'text-red-400'
              }`}>
                {systemHealth.database?.status === 'healthy' ? 'System Healthy' : 'Database Connection Issue'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="w-full px-6 py-6 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Users} 
            label="Total Users" 
            value={stats.totalUsers.toLocaleString()} 
            trend="+12% this week"
          />
          <StatCard 
            icon={CreditCard} 
            label="Active Subscribers" 
            value={stats.activeSubs.toLocaleString()} 
            subValue={`${Math.round((stats.activeSubs/stats.totalUsers || 0)*100)}% Conversion`}
            color="text-green-400"
          />
          <StatCard 
            icon={Shield} 
            label="Admins & Overseers" 
            value={stats.admins.toLocaleString()} 
            color="text-purple-400"
          />
          <StatCard 
            icon={Activity} 
            label="Est. Monthly Revenue" 
            value={`$${stats.totalRevenue.toLocaleString()}`} 
            color="text-brand-gold"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full px-6 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <main className="w-full px-6 py-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display">User Database</h2>
                <div className="flex gap-2">
                  {selectedUserIds.length > 0 && (
                    <span className="px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-lg text-sm border border-brand-gold/20">
                      {selectedUserIds.length} selected
                    </span>
                  )}
                </div>
              </div>
              <OwnerUserTable users={users} onSelectionChange={setSelectedUserIds} />
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display">Financial Analytics</h2>
              <FinancialAnalytics data={financialData} />
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display">Course Management</h2>
              <CourseManagement analytics={courseAnalytics} />
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display">System Health</h2>
              <SystemHealth health={systemHealth} />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display">Audit Logs</h2>
              <AuditLogs logs={auditLogs} />
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display">Bulk Operations & Quick Actions</h2>
              <BulkOperations onRefresh={handleRefresh} selectedUserIds={selectedUserIds} />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subValue, trend, color = "text-white" }: any) {
  return (
    <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold mt-1 font-display">{value}</h3>
        {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
      </div>
    </div>
  )
}


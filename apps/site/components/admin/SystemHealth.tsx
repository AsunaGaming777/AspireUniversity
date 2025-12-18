'use client'

import { CheckCircle, XCircle, Database, Server, AlertTriangle } from 'lucide-react'

interface SystemHealth {
  database: { status: string; responseTime?: number; error?: string }
  users: number
  errors: any[]
}

export function SystemHealth({ health }: { health: SystemHealth }) {
  const isHealthy = health.database.status === 'healthy'
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Database Status */}
        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <Database className={`w-8 h-8 ${isHealthy ? 'text-green-400' : 'text-red-400'}`} />
            {isHealthy ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
          </div>
          <p className="text-sm text-gray-500 mb-1">Database</p>
          <h3 className="text-2xl font-bold text-white capitalize">{health.database.status}</h3>
          {health.database.responseTime && (
            <p className="text-xs text-gray-500 mt-2">{health.database.responseTime}ms</p>
          )}
          {health.database.error && (
            <p className="text-xs text-red-400 mt-2">{health.database.error}</p>
          )}
        </div>

        {/* User Count */}
        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <Server className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-white">{health.users.toLocaleString()}</h3>
        </div>

        {/* Error Count */}
        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Recent Errors</p>
          <h3 className="text-2xl font-bold text-white">{health.errors.length}</h3>
        </div>
      </div>

      {/* Error Log */}
      {health.errors.length > 0 && (
        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4">Recent Errors</h3>
          <div className="space-y-2">
            {health.errors.map((error, i) => (
              <div key={i} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error.message || 'Unknown error'}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(error.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


'use client'

import { FileText, User, Calendar, Shield } from 'lucide-react'

interface AuditLog {
  id: string
  action: string
  resource: string | null
  user: { email: string; name: string | null }
  ipAddress: string | null
  createdAt: Date
  details: any
}

export function AuditLogs({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">System Audit Logs</h3>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 transition-colors">
          Export Logs
        </button>
      </div>

      <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-3 px-4 text-sm text-gray-500">Action</th>
                <th className="py-3 px-4 text-sm text-gray-500">User</th>
                <th className="py-3 px-4 text-sm text-gray-500">Resource</th>
                <th className="py-3 px-4 text-sm text-gray-500">IP Address</th>
                <th className="py-3 px-4 text-sm text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-brand-gold/10 text-brand-gold rounded text-xs font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-white">{log.user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{log.resource || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 font-mono">{log.ipAddress || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, BookOpen, AlertCircle, Activity, FileText, Download, Upload, Plus, Send, Filter, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/date-utils'

interface FinancialData {
  payments: any[]
  refunds: any[]
  revenueByPlan: any[]
}

export function FinancialAnalytics({ data }: { data: FinancialData }) {
  const totalRevenue = data.payments
    .filter(p => p.status === 'succeeded')
    .reduce((acc, p) => acc + p.amount, 0) / 100

  const totalRefunds = data.refunds
    .filter(r => r.status === 'succeeded')
    .reduce((acc, r) => acc + r.amount, 0) / 100

  const netRevenue = totalRevenue - totalRefunds

  // Calculate revenue by plan
  const planRevenue = data.revenueByPlan.reduce((acc, item) => {
    acc[item.plan] = (item._sum.amount || 0) / 100
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-brand-gold" />
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Refunds</p>
          <h3 className="text-3xl font-bold text-white">${totalRefunds.toLocaleString()}</h3>
        </div>

        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Net Revenue</p>
          <h3 className="text-3xl font-bold text-white">${netRevenue.toLocaleString()}</h3>
        </div>

        <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Transactions</p>
          <h3 className="text-3xl font-bold text-white">{data.payments.length}</h3>
        </div>
      </div>

      {/* Revenue by Plan */}
      <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4">Revenue by Plan</h3>
        <div className="space-y-4">
          {Object.entries(planRevenue).map(([plan, revenue]) => (
            <div key={plan} className="flex items-center justify-between">
              <span className="text-gray-400 capitalize">{plan}</span>
              <span className="text-white font-bold">${revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4">Recent Payments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-sm text-gray-500">User</th>
                <th className="py-3 px-4 text-sm text-gray-500">Amount</th>
                <th className="py-3 px-4 text-sm text-gray-500">Plan</th>
                <th className="py-3 px-4 text-sm text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.slice(0, 10).map((payment) => (
                <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-sm text-white">{payment.user?.email || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-white">${(payment.amount / 100).toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-400 capitalize">{payment.plan}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      payment.status === 'succeeded' ? 'bg-green-500/10 text-green-400' :
                      payment.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                      'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDate(payment.createdAt)}
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


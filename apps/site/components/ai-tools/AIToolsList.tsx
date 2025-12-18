'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ExternalLink, Sparkles, Check, X } from 'lucide-react'
import { aiTools, AITool } from '@/data/ai-tools'

export default function AIToolsList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPricing, setSelectedPricing] = useState<string | null>(null)

  const categories = Array.from(new Set(aiTools.map(tool => tool.category)))
  const pricings = Array.from(new Set(aiTools.map(tool => tool.pricing)))

  const filteredTools = useMemo(() => {
    return aiTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory ? tool.category === selectedCategory : true
      const matchesPricing = selectedPricing ? tool.pricing === selectedPricing : true

      return matchesSearch && matchesCategory && matchesPricing
    })
  }, [searchQuery, selectedCategory, selectedPricing])

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-20">
      {/* Hero Section */}
      <div className="container-width mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold text-sm font-medium tracking-wide uppercase">
              Curated Intelligence
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Find the <span className="text-gradient-gold">Perfect AI</span> for the Job
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. We've curated the most powerful AI tools across every category so you can build, create, and scale faster.
          </p>
        </motion.div>
      </div>

      <div className="container-width">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm sticky top-20 z-30 shadow-2xl shadow-black/50">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools, tasks, or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 text-white placeholder-gray-500 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 text-gray-300 min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedPricing || ''}
              onChange={(e) => setSelectedPricing(e.target.value || null)}
              className="px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-brand-gold/50 text-gray-300 min-w-[140px]"
            >
              <option value="">Any Price</option>
              {pricings.map(price => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>
            
            {(selectedCategory || selectedPricing || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setSelectedPricing(null)
                  setSearchQuery('')
                }}
                className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 font-display">No tools found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory(null)
                setSelectedPricing(null)
                setSearchQuery('')
              }}
              className="mt-4 text-brand-gold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ToolCard({ tool }: { tool: AITool }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#0c0c0e] border border-white/10 hover:border-brand-gold/30 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(212,175,55,0.1)]"
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-400 border border-white/5">
            {tool.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
            tool.pricing === 'Paid' ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/20' :
            'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}>
            {tool.pricing}
          </span>
        </div>

        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
          {tool.name}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
          {tool.description}
        </p>

        {/* Best For */}
        <div className="mb-6 p-3 bg-white/5 rounded-lg border border-white/5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Best For</p>
          <p className="text-sm text-gray-200">{tool.bestFor}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded border border-white/5">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Action */}
      <div className="p-4 bg-white/5 border-t border-white/5 mt-auto">
        <a 
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-gold text-black font-semibold rounded-lg hover:bg-brand-deep-gold transition-colors"
        >
          Visit Website
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  )
}


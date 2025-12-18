'use client'

import { useState } from 'react'
import { Lightbulb, RotateCcw, MessageSquare, List, GripHorizontal, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Key Takeaways Component
interface KeyTakeawayProps {
  title: string
  points: string[]
  icon?: string
}

export function KeyTakeaway({ title, points, icon = "💡" }: KeyTakeawayProps) {
  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/10 via-brand-gold/5 to-transparent rounded-2xl border border-brand-gold/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center border border-brand-gold/20 text-2xl">
          {icon}
        </div>
        <h4 className="font-display font-bold text-white text-xl">{title}</h4>
      </div>
      <ul className="space-y-4">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-sm font-bold mt-0.5">
              {index + 1}
            </span>
            <span className="text-gray-300 leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Flashcards Component
interface FlashcardItem {
  front: string
  back: string
}

interface FlashcardsProps {
  title: string
  cards: FlashcardItem[]
}

export function Flashcards({ title, cards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, 200)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }, 200)
  }

  return (
    <div className="my-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center border border-brand-gold/20">
            <List className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <h4 className="font-display font-bold text-white text-lg">{title}</h4>
            <p className="text-sm text-gray-400">Master the terminology</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-brand-gold font-mono border border-white/10">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="relative h-80 perspective-1000 group">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full p-10 bg-gradient-to-br from-[#121214] to-[#0a0a0c] rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center hover:border-brand-gold/50 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.15)] transition-all duration-300">
              <span className="text-xs text-brand-gold/60 uppercase tracking-[0.2em] mb-8 font-semibold">Term</span>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300">
                {cards[currentIndex].front}
              </h3>
              <div className="absolute bottom-8 flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                <GripHorizontal className="w-4 h-4" />
                Click to flip
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full p-10 bg-gradient-to-br from-brand-gold/10 to-[#0a0a0c] rounded-2xl border border-brand-gold/30 flex flex-col items-center justify-center text-center shadow-[0_0_30px_-10px_rgba(212,175,55,0.1)]">
              <span className="text-xs text-brand-gold/60 uppercase tracking-[0.2em] mb-6 font-semibold">Definition</span>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-light">
                {cards[currentIndex].back}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={handlePrev}
          className="p-4 rounded-full bg-[#121214] border border-white/10 hover:bg-white/5 hover:border-brand-gold/30 text-gray-400 hover:text-white transition-all duration-300 group"
          disabled={cards.length <= 1}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-8 py-3 rounded-full bg-brand-gold/10 border border-brand-gold/20 hover:bg-brand-gold/20 text-brand-gold text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]"
        >
          {isFlipped ? 'Show Term' : 'Show Definition'}
        </button>
        
        <button
          onClick={handleNext}
          className="p-4 rounded-full bg-[#121214] border border-white/10 hover:bg-white/5 hover:border-brand-gold/30 text-gray-400 hover:text-white transition-all duration-300 group"
          disabled={cards.length <= 1}
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

// Matching Component
interface MatchingPair {
  left: string
  right: string
}

interface MatchingProps {
  title: string
  pairs: MatchingPair[]
}

export function Matching({ title, pairs }: MatchingProps) {
  const [shuffledRight] = useState(() => [...pairs].map(p => p.right).sort(() => Math.random() - 0.5))
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState(false)

  const handleLeftClick = (left: string) => {
    if (matches[left]) return
    setSelectedLeft(left)
  }

  const handleRightClick = (right: string) => {
    if (!selectedLeft) return
    
    // Check if match is correct
    const pair = pairs.find(p => p.left === selectedLeft)
    if (pair && pair.right === right) {
      const newMatches = { ...matches, [selectedLeft]: right }
      setMatches(newMatches)
      setSelectedLeft(null)

      if (Object.keys(newMatches).length === pairs.length) {
        setCompleted(true)
      }
    } else {
      // Shake animation or error feedback could go here
      setSelectedLeft(null)
    }
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-display font-bold text-white text-lg">{title}</h4>
        {completed && (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full border border-green-500/20">
            All Matched!
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          {pairs.map((pair, i) => (
            <button
              key={i}
              onClick={() => handleLeftClick(pair.left)}
              disabled={!!matches[pair.left]}
              className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                matches[pair.left]
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : selectedLeft === pair.left
                    ? 'bg-brand-gold/20 border-brand-gold text-white'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              } border`}
            >
              {pair.left}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {shuffledRight.map((right, i) => {
            const isMatched = Object.values(matches).includes(right)
            return (
              <button
                key={i}
                onClick={() => handleRightClick(right)}
                disabled={isMatched}
                className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                  isMatched
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                } border`}
              >
                {right}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Discussion Component
interface DiscussionProps {
  question: string
  hints?: string[]
}

export function Discussion({ question, hints }: DiscussionProps) {
  const [response, setResponse] = useState('')
  const [showHints, setShowHints] = useState(false)

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl border border-purple-500/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 text-purple-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h4 className="font-display font-bold text-white text-lg">Reflect & Apply</h4>
      </div>

      <p className="text-lg text-white mb-6 leading-relaxed">{question}</p>

      {hints && hints.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {showHints ? 'Hide Thinking Points' : 'Show Thinking Points'}
          </button>
          
          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <ul className="mt-3 space-y-2 pl-4 border-l-2 border-purple-500/20">
                  {hints.map((hint, i) => (
                    <li key={i} className="text-sm text-gray-400">{hint}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full p-4 bg-black/40 rounded-xl border border-white/10 text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/30 min-h-[120px] mb-4"
      />

      <button
        className="px-6 py-2 bg-purple-600/20 text-purple-400 font-medium rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-500/30"
      >
        Save Reflection
      </button>
    </div>
  )
}

// Comparison Table Component
interface ComparisonRow {
  [key: string]: string
}

interface ComparisonProps {
  title: string
  rows: ComparisonRow[]
}

export function Comparison({ title, rows }: ComparisonProps) {
  if (!rows || rows.length === 0) return null

  // Get all unique keys (columns) from all rows
  const columns = Array.from(
    new Set(rows.flatMap(row => Object.keys(row)))
  )

  // First column is typically the feature/item name
  const firstColumn = columns[0]
  const otherColumns = columns.slice(1)

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-2xl border border-blue-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
          <List className="w-5 h-5 text-blue-400" />
        </div>
        <h4 className="font-display font-bold text-white text-xl">{title}</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-brand-gold font-semibold text-sm uppercase tracking-wider">
                {firstColumn}
              </th>
              {otherColumns.map((col, idx) => (
                <th
                  key={idx}
                  className="text-left py-3 px-4 text-brand-gold font-semibold text-sm uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4 text-white font-medium">
                  {row[firstColumn]}
                </td>
                {otherColumns.map((col, colIdx) => (
                  <td key={colIdx} className="py-4 px-4 text-gray-300">
                    {row[col] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

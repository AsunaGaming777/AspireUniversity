'use client'

import { useState, useMemo } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  Clock,
  BookOpen,
  Target,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Lightbulb,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react'
import { Button } from '@aspire/ui'
import { VideoPlayer } from './VideoPlayer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  NeuralNetworkDiagram,
  MLTypesDiagram,
  AITimelineDiagram,
  BackpropDiagram,
  CNNDiagram,
  TransformerDiagram,
} from './Diagrams'
import {
  KeyTakeaway,
  Flashcards,
  Matching,
  Discussion,
  Comparison,
} from './EngagingElements'
import {
  Quiz,
  Challenge,
  CodePlayground,
  Exercise,
  PromptPractice,
  TrueFalse,
} from './InteractiveElements'

// Extract interactive elements and their positions from content
function extractInteractiveElements(content: string) {
  const elements: Array<{ type: string; start: number; end: number; data: any }> = []
  const types = ['QUIZ', 'CHALLENGE', 'CODE', 'EXERCISE', 'PROMPT', 'TRUEFALSE', 'TAKEAWAY', 'FLASHCARDS', 'MATCHING', 'DISCUSSION', 'COMPARISON']
  
  for (const type of types) {
    const pattern = `[${type}:`
    let searchStart = 0
    
    while (true) {
      const startIdx = content.indexOf(pattern, searchStart)
      if (startIdx === -1) break
      
      // Find the matching closing bracket by counting braces
      const jsonStart = startIdx + pattern.length
      let braceCount = 0
      let endIdx = -1
      
      for (let i = jsonStart; i < content.length; i++) {
        if (content[i] === '{') braceCount++
        if (content[i] === '}') braceCount--
        
        if (braceCount === 0 && content[i] === '}') {
          // Check if next char is ]
          if (content[i + 1] === ']') {
            endIdx = i + 2
            break
          }
        }
      }
      
      if (endIdx !== -1) {
        try {
          const jsonStr = content.substring(jsonStart, endIdx - 1)
          const data = JSON.parse(jsonStr)
          elements.push({ type, start: startIdx, end: endIdx, data })
        } catch (e) {
          console.error(`Failed to parse ${type}:`, e)
        }
      }
      
      searchStart = endIdx !== -1 ? endIdx : startIdx + 1
    }
  }
  
  // Sort by position
  elements.sort((a, b) => a.start - b.start)
  return elements
}

// Content with embedded diagrams and interactive elements
function ContentWithDiagrams({ content }: { content: string }) {
  // Extract all interactive elements first
  const interactiveElements = extractInteractiveElements(content)
  
  // Build parts array
  const parts: Array<{ type: 'markdown' | 'diagram' | 'interactive'; content?: string; diagramType?: string; interactiveType?: string; data?: any }> = []
  let lastEnd = 0
  
  // Process content and split by diagrams and interactive elements
  const diagramPattern = /\[DIAGRAM:([A-Z_]+)\]/g
  let match
  
  // Collect all markers (diagrams + interactive)
  const allMarkers: Array<{ type: 'diagram' | 'interactive'; start: number; end: number; name?: string; data?: any }> = []
  
  // Add diagram markers
  while ((match = diagramPattern.exec(content)) !== null) {
    allMarkers.push({
      type: 'diagram',
      start: match.index,
      end: match.index + match[0].length,
      name: match[1]
    })
  }
  
  // Add interactive element markers
  for (const el of interactiveElements) {
    allMarkers.push({
      type: 'interactive',
      start: el.start,
      end: el.end,
      name: el.type,
      data: el.data
    })
  }
  
  // Sort all markers by position
  allMarkers.sort((a, b) => a.start - b.start)
  
  // Build parts
  for (const marker of allMarkers) {
    // Add markdown before this marker
    if (marker.start > lastEnd) {
      const mdContent = content.substring(lastEnd, marker.start).trim()
      if (mdContent) {
        parts.push({ type: 'markdown', content: mdContent })
      }
    }
    
    // Add the marker
    if (marker.type === 'diagram') {
      parts.push({ type: 'diagram', diagramType: marker.name })
    } else {
      parts.push({ type: 'interactive', interactiveType: marker.name, data: marker.data })
    }
    
    lastEnd = marker.end
  }
  
  // Add remaining markdown
  if (lastEnd < content.length) {
    const mdContent = content.substring(lastEnd).trim()
    if (mdContent) {
      parts.push({ type: 'markdown', content: mdContent })
    }
  }
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'diagram') {
          switch (part.diagramType) {
            case 'NEURAL_NETWORK': return <NeuralNetworkDiagram key={index} />
            case 'ML_TYPES': return <MLTypesDiagram key={index} />
            case 'AI_TIMELINE': return <AITimelineDiagram key={index} />
            case 'BACKPROP': return <BackpropDiagram key={index} />
            case 'CNN': return <CNNDiagram key={index} />
            case 'TRANSFORMER': return <TransformerDiagram key={index} />
            default: return null
          }
        }
        
        if (part.type === 'interactive' && part.data) {
          switch (part.interactiveType) {
            case 'QUIZ': return <Quiz key={index} {...part.data} />
            case 'CHALLENGE': return <Challenge key={index} {...part.data} />
            case 'CODE': return <CodePlayground key={index} {...part.data} />
            case 'EXERCISE': return <Exercise key={index} {...part.data} />
            case 'PROMPT': return <PromptPractice key={index} {...part.data} />
            case 'TRUEFALSE': return <TrueFalse key={index} {...part.data} />
            case 'TAKEAWAY': return <KeyTakeaway key={index} {...part.data} />
            case 'FLASHCARDS': return <Flashcards key={index} {...part.data} />
            case 'MATCHING': return <Matching key={index} {...part.data} />
            case 'DISCUSSION': return <Discussion key={index} {...part.data} />
            case 'COMPARISON': return <Comparison key={index} {...part.data} />
            default: return null
          }
        }
        
        if (part.type === 'markdown' && part.content) {
          return <MarkdownContent key={index} content={part.content} />
        }
        
        return null
      })}
    </>
  )
}

// Callout component for tips, warnings, and info boxes
function Callout({ type, title, children }: { type: 'tip' | 'warning' | 'info' | 'important'; title?: string; children: React.ReactNode }) {
  const styles = {
    tip: { bg: 'from-green-500/10', border: 'border-green-500/30', icon: <Lightbulb className="w-5 h-5 text-green-400" />, color: 'text-green-400' },
    warning: { bg: 'from-yellow-500/10', border: 'border-yellow-500/30', icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />, color: 'text-yellow-400' },
    info: { bg: 'from-blue-500/10', border: 'border-blue-500/30', icon: <Info className="w-5 h-5 text-blue-400" />, color: 'text-blue-400' },
    important: { bg: 'from-purple-500/10', border: 'border-purple-500/30', icon: <Zap className="w-5 h-5 text-purple-400" />, color: 'text-purple-400' },
  }
  const s = styles[type]
  
  return (
    <div className={`my-6 p-5 bg-gradient-to-br ${s.bg} to-transparent rounded-xl border ${s.border}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
        <div>
          {title && <h5 className={`font-semibold mb-1 ${s.color}`}>{title}</h5>}
          <div className="text-gray-300 text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}

// Separated markdown content renderer
function MarkdownContent({ content }: { content: string }) {
  // Process callouts in content
  const processedContent = content
    .replace(/:::tip\s*\n([\s\S]*?):::/g, '<div class="callout-tip">$1</div>')
    .replace(/:::warning\s*\n([\s\S]*?):::/g, '<div class="callout-warning">$1</div>')
    .replace(/:::info\s*\n([\s\S]*?):::/g, '<div class="callout-info">$1</div>')
    .replace(/:::important\s*\n([\s\S]*?):::/g, '<div class="callout-important">$1</div>')

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-4xl font-display font-bold text-white mt-12 mb-6 pb-4 border-b border-white/10">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-white mt-10 mb-4 flex items-center gap-3">
            <span className="w-1 h-8 bg-brand-gold rounded-full"></span>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl lg:text-2xl font-semibold text-white mt-8 mb-3">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold text-brand-gold mt-6 mb-2">
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="text-gray-300 mb-5 leading-relaxed text-base lg:text-lg">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-6 space-y-3 ml-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-6 space-y-3 ml-1 list-decimal list-inside">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-3 text-gray-300 leading-relaxed">
            <span className="w-2 h-2 bg-brand-gold rounded-full mt-2 flex-shrink-0"></span>
            <span className="flex-1">{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="text-white font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-gray-300 italic">{children}</em>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            className="text-brand-gold hover:text-brand-deep-gold underline underline-offset-4 transition-colors" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-6 pl-6 py-4 border-l-4 border-brand-gold bg-brand-gold/5 rounded-r-lg">
            <div className="text-gray-300 italic">{children}</div>
          </blockquote>
        ),
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline ? (
            <div className="my-6 rounded-xl overflow-hidden border border-white/10">
              {match && (
                <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider ml-2">{match[1]}</span>
                </div>
              )}
              <pre className="bg-[#0d0d0f] p-4 lg:p-6 overflow-x-auto">
                <code className="text-sm lg:text-base text-gray-300 font-mono leading-relaxed" {...props}>
                  {String(children).replace(/\n$/, '')}
                </code>
              </pre>
            </div>
          ) : (
            <code className="px-2 py-1 bg-brand-gold/10 text-brand-gold text-sm font-mono rounded" {...props}>
              {children}
            </code>
          )
        },
        hr: () => (
          <hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        ),
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-white/5">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-white/5">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-white/5 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-3 text-gray-300 text-sm">{children}</td>
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  )
}

interface CoursePlayerProps {
  course: any
  enrollment: any
  progress: any[]
  userId: string
}

export function CoursePlayer({ course, enrollment, progress, userId }: CoursePlayerProps) {
  const allLessons = useMemo(() => 
    course.modules.flatMap((module: any, moduleIndex: number) => 
      module.lessons.map((lesson: any) => ({ 
        ...lesson, 
        moduleTitle: module.title,
        moduleIndex: moduleIndex + 1 
      }))
    ), [course.modules]
  )
  
  const [currentLesson, setCurrentLesson] = useState(allLessons[0])
  const [expandedModules, setExpandedModules] = useState<string[]>([course.modules[0]?.id])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentLessonIndex = allLessons.findIndex((l: any) => l.id === currentLesson?.id)
  const nextLesson = allLessons[currentLessonIndex + 1]
  const prevLesson = allLessons[currentLessonIndex - 1]

  const completedCount = progress.filter((p) => p.completed).length
  const totalLessons = allLessons.length
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress.some((p) => p.lessonId === lessonId && p.completed)
  }

  const markComplete = async () => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: true,
        }),
      })
      window.location.reload()
    } catch (error) {
      console.error('Failed to mark lesson complete:', error)
    }
  }

  const goToLesson = (lesson: any) => {
    setCurrentLesson(lesson)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-brand-gold font-medium truncate">{course.title}</p>
            <p className="text-sm text-white font-medium truncate">{currentLesson?.title}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        {/* Main Content */}
        <div className="flex-1 lg:pr-96">
          {/* Video Player */}
          <div className="aspect-video bg-black mt-14 lg:mt-0">
            <VideoPlayer
              videoUrl={currentLesson?.videoUrl}
              lessonId={currentLesson?.id}
              userId={userId}
            />
          </div>

          {/* Lesson Content */}
          <div className="p-6 lg:p-10">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="text-brand-gold font-medium">{course.title}</span>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <span className="text-gray-400">{currentLesson?.moduleTitle}</span>
              </div>

              {/* Lesson Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-semibold rounded-full uppercase tracking-wider">
                    Lesson {currentLessonIndex + 1} of {totalLessons}
                  </span>
                  {currentLesson?.videoDuration && (
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {Math.floor(currentLesson.videoDuration / 60)} min
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight">
                  {currentLesson?.title}
                </h1>

                {currentLesson?.description && (
                  <p className="text-lg text-gray-400 leading-relaxed">
                    {currentLesson.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-white/10">
                {!isLessonCompleted(currentLesson?.id) ? (
                  <Button onClick={markComplete} size="lg" className="bg-brand-gold text-black hover:bg-brand-deep-gold">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Mark as Complete
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}

                {nextLesson && (
                  <Button 
                    onClick={() => goToLesson(nextLesson)} 
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Next Lesson
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>

              {/* Learning Objectives */}
              {currentLesson?.objectives && (
                <div className="mb-10 p-6 bg-gradient-to-br from-brand-gold/5 to-transparent border border-brand-gold/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand-gold/10 rounded-lg">
                      <Target className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">Learning Objectives</h3>
                  </div>
                  <ul className="space-y-2">
                    {currentLesson.objectives.split('\n').filter(Boolean).map((objective: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold mt-1 flex-shrink-0" />
                        <span>{objective.replace(/^-\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lesson Content - Markdown with Diagrams */}
              {currentLesson?.content && (
                <article className="lesson-content">
                  <ContentWithDiagrams content={currentLesson.content} />
                </article>
              )}

              {/* Resources */}
              {currentLesson?.assets && currentLesson.assets.length > 0 && (
                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand-gold/10 rounded-lg">
                      <BookOpen className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">Resources</h3>
                  </div>
                  <div className="space-y-2">
                    {currentLesson.assets.map((asset: any) => (
                      <a
                        key={asset.id}
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-black/40 rounded-xl hover:bg-black/60 border border-white/5 hover:border-brand-gold/30 transition-all group"
                      >
                        <span className="text-gray-300 group-hover:text-white transition-colors">{asset.title}</span>
                        <span className="text-brand-gold text-sm font-medium">Download →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                {prevLesson && (
                  <button
                    onClick={() => goToLesson(prevLesson)}
                    className="flex-1 flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/10 hover:border-brand-gold/30 transition-all group text-left"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-brand-gold transition-colors" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Previous</p>
                      <p className="text-white font-medium group-hover:text-brand-gold transition-colors">{prevLesson.title}</p>
                    </div>
                  </button>
                )}
                {nextLesson && (
                  <button
                    onClick={() => goToLesson(nextLesson)}
                    className="flex-1 flex items-center justify-end gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/10 hover:border-brand-gold/30 transition-all group text-right"
                  >
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Next</p>
                      <p className="text-white font-medium group-hover:text-brand-gold transition-colors">{nextLesson.title}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-brand-gold transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`
          fixed lg:fixed top-0 right-0 h-screen w-full sm:w-96 bg-[#0c0c0e] border-l border-white/10 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          lg:translate-x-0
        `}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold text-white">Course Content</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{completedCount} of {totalLessons} lessons</span>
                <span className="text-brand-gold font-semibold">{progressPercentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-gold to-brand-deep-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Module List */}
          <div className="overflow-y-auto h-[calc(100vh-160px)] p-4">
            {course.modules.map((module: any, moduleIndex: number) => {
              const moduleLessons = module.lessons || []
              const completedInModule = moduleLessons.filter((l: any) => isLessonCompleted(l.id)).length
              const isExpanded = expandedModules.includes(module.id)

              return (
                <div key={module.id} className="mb-3">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="w-8 h-8 flex items-center justify-center bg-brand-gold/10 text-brand-gold text-sm font-bold rounded-lg">
                        {moduleIndex + 1}
                      </span>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-brand-gold transition-colors text-sm">
                          {module.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {completedInModule}/{moduleLessons.length} completed
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 ml-4 space-y-1">
                      {moduleLessons.map((lesson: any, lessonIndex: number) => {
                        const completed = isLessonCompleted(lesson.id)
                        const isCurrent = currentLesson?.id === lesson.id

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => goToLesson({ ...lesson, moduleTitle: module.title, moduleIndex: moduleIndex + 1 })}
                            className={`
                              w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left
                              ${isCurrent 
                                ? 'bg-brand-gold text-black' 
                                : 'hover:bg-white/5 text-gray-400 hover:text-white'
                              }
                            `}
                          >
                            <div className={`
                              w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 text-xs font-medium
                              ${completed 
                                ? (isCurrent ? 'bg-black/20 text-black' : 'bg-green-500/20 text-green-400')
                                : (isCurrent ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-500')
                              }
                            `}>
                              {completed ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                lessonIndex + 1
                              )}
                            </div>
                            <span className="flex-1 text-sm truncate">{lesson.title}</span>
                            {lesson.videoDuration && (
                              <span className={`text-xs ${isCurrent ? 'text-black/60' : 'text-gray-600'}`}>
                                {Math.floor(lesson.videoDuration / 60)}m
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

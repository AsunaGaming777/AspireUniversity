'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Lightbulb, Code, ChevronDown, ChevronUp, Play, RotateCcw, Send } from 'lucide-react'

// Color palette matching website theme
const colors = {
  gold: '#D4AF37',
  lightGold: '#F5D76E',
  deepGold: '#AA8420',
  white: '#fafafa',
  muted: '#a1a1aa',
  dark: '#27272a',
  obsidian: '#09090b',
  card: '#0c0c0e',
  success: '#22c55e',
  error: '#ef4444',
}

// Quiz Component
interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizProps {
  title: string
  questions: QuizQuestion[]
}

export function Quiz({ title, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswers[currentQuestion] !== null) return
    
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = optionIndex
    setSelectedAnswers(newAnswers)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(null))
    setShowResults(false)
    setShowExplanation(false)
  }

  const correctCount = selectedAnswers.filter((answer, i) => answer === questions[i].correctIndex).length
  const question = questions[currentQuestion]
  const isCorrect = selectedAnswers[currentQuestion] === question.correctIndex

  if (showResults) {
    const percentage = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
        <div className="text-center">
          <div className={`text-6xl mb-4 ${percentage >= 70 ? '' : 'grayscale'}`}>
            {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '💪' : '📚'}
          </div>
          <h4 className="text-2xl font-display font-bold text-white mb-2">Quiz Complete!</h4>
          <p className="text-gray-400 mb-4">
            You scored <span className="text-brand-gold font-bold">{correctCount}</span> out of{' '}
            <span className="text-white font-bold">{questions.length}</span> ({percentage}%)
          </p>
          
          {/* Progress bar */}
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full transition-all duration-1000 rounded-full"
              style={{ 
                width: `${percentage}%`,
                background: percentage >= 70 
                  ? `linear-gradient(to right, ${colors.deepGold}, ${colors.lightGold})`
                  : percentage >= 50 
                    ? colors.gold
                    : colors.muted
              }}
            />
          </div>
          
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-brand-gold text-black font-semibold rounded-xl hover:bg-brand-deep-gold transition-colors flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center border border-brand-gold/20">
            <span className="text-xl">📝</span>
          </div>
          <div>
            <h4 className="font-display font-bold text-white">{title}</h4>
            <p className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedAnswers[i] !== null
                  ? selectedAnswers[i] === questions[i].correctIndex
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : i === currentQuestion
                    ? 'bg-brand-gold'
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Question */}
      <p className="text-lg text-white font-medium mb-6">{question.question}</p>
      
      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswers[currentQuestion] === i
          const isCorrectOption = i === question.correctIndex
          const hasAnswered = selectedAnswers[currentQuestion] !== null
          
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={hasAnswered}
              className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                hasAnswered
                  ? isCorrectOption
                    ? 'bg-green-500/10 border-green-500/50'
                    : isSelected
                      ? 'bg-red-500/10 border-red-500/50'
                      : 'bg-white/5 border-white/10 opacity-50'
                  : 'bg-white/5 border-white/10 hover:bg-brand-gold/10 hover:border-brand-gold/30'
              } border-2`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                hasAnswered
                  ? isCorrectOption
                    ? 'bg-green-500 text-white'
                    : isSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  : 'bg-brand-gold/20 text-brand-gold'
              }`}>
                {hasAnswered && isCorrectOption ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : hasAnswered && isSelected ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className={hasAnswered && !isCorrectOption && !isSelected ? 'text-gray-500' : 'text-white'}>
                {option}
              </span>
            </button>
          )
        })}
      </div>
      
      {/* Explanation */}
      {showExplanation && (
        <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-brand-gold/10 border border-brand-gold/30'}`}>
          <div className="flex items-start gap-3">
            <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCorrect ? 'text-green-400' : 'text-brand-gold'}`} />
            <div>
              <p className={`font-medium mb-1 ${isCorrect ? 'text-green-400' : 'text-brand-gold'}`}>
                {isCorrect ? 'Correct!' : 'Explanation'}
              </p>
              <p className="text-gray-300 text-sm">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Next button */}
      {showExplanation && (
        <button
          onClick={nextQuestion}
          className="w-full py-3 bg-brand-gold text-black font-semibold rounded-xl hover:bg-brand-deep-gold transition-colors"
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  )
}

// Challenge Component
interface ChallengeProps {
  title: string
  description: string
  hints?: string[] // Optional hints array
  solution: string
}

export function Challenge({ title, description, hints = [], solution }: ChallengeProps) {
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [completed, setCompleted] = useState(false)
  
  // Ensure hints is always an array
  const safeHints = Array.isArray(hints) ? hints : []

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center border border-brand-gold/20">
          <span className="text-xl">🎯</span>
        </div>
        <div>
          <h4 className="font-display font-bold text-white">{title}</h4>
          <p className="text-sm text-brand-gold">Challenge</p>
        </div>
        {completed && (
          <span className="ml-auto px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full flex items-center gap-1 border border-green-500/30">
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </span>
        )}
      </div>
      
      {/* Description */}
      <p className="text-gray-300 mb-6">{description}</p>
      
      {/* Hints */}
      <div className="mb-6">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-brand-gold hover:text-brand-deep-gold transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">
            {showHints ? 'Hide Hints' : `Show Hints (${safeHints.length} available)`}
          </span>
          {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showHints && safeHints.length > 0 && (
          <div className="mt-4 space-y-2">
            {safeHints.slice(0, currentHint + 1).map((hint, i) => (
              <div key={i} className="p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/20 animate-fadeIn">
                <p className="text-sm text-gray-300">
                  <span className="text-brand-gold font-medium">Hint {i + 1}:</span> {hint}
                </p>
              </div>
            ))}
            {currentHint < safeHints.length - 1 && (
              <button
                onClick={() => setCurrentHint(currentHint + 1)}
                className="text-sm text-brand-gold hover:text-brand-deep-gold"
              >
                Show next hint →
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Solution */}
      <div className="mb-6">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <Code className="w-4 h-4" />
          <span className="text-sm font-medium">
            {showSolution ? 'Hide Solution' : 'View Solution'}
          </span>
        </button>
        
        {showSolution && (
          <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/10 animate-fadeIn">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{solution}</pre>
          </div>
        )}
      </div>
      
      {/* Complete button */}
      {!completed && (
        <button
          onClick={() => setCompleted(true)}
          className="w-full py-3 bg-brand-gold text-black font-semibold rounded-xl hover:bg-brand-deep-gold transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Mark as Completed
        </button>
      )}
    </div>
  )
}

// Code Playground Component
interface CodePlaygroundProps {
  title: string
  language: string
  starterCode: string
  expectedOutput?: string
}

export function CodePlayground({ title, language, starterCode, expectedOutput }: CodePlaygroundProps) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const runCode = () => {
    setIsRunning(true)
    setOutput('')
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // For Python-like code simulation
        if (language === 'python') {
          // Very basic simulation - just show expected output or process print statements
          const printStatements = code.match(/print\((.*?)\)/g)
          if (printStatements) {
            const outputs = printStatements.map(stmt => {
              const content = stmt.match(/print\((.*?)\)/)?.[1] || ''
              // Remove quotes from string literals
              return content.replace(/['"]/g, '').replace(/f"(.*?)"/g, '$1')
            })
            setOutput(outputs.join('\n'))
          } else if (expectedOutput) {
            setOutput(expectedOutput)
          } else {
            setOutput('Code executed successfully!')
          }
        } else {
          setOutput(expectedOutput || 'Code executed successfully!')
        }
      } catch (e) {
        setOutput(`Error: ${e}`)
      }
      setIsRunning(false)
    }, 1000)
  }

  const resetCode = () => {
    setCode(starterCode)
    setOutput('')
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-brand-gold/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-gold/10 to-transparent px-4 py-3 flex items-center justify-between border-b border-brand-gold/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-sm text-gray-400">{title}</span>
          <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-xs rounded uppercase border border-brand-gold/20">
            {language}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Code editor */}
      <div className="bg-[#0d0d0f]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-4 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none min-h-[200px] border-none"
          spellCheck={false}
        />
      </div>
      
      {/* Run button */}
      <div className="bg-[#0d0d0f] px-4 py-3 border-t border-white/10">
        <button
          onClick={runCode}
          disabled={isRunning}
          className="px-4 py-2 bg-brand-gold text-black font-medium rounded-lg hover:bg-brand-deep-gold transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Code
            </>
          )}
        </button>
      </div>
      
      {/* Output */}
      {output && (
        <div className="bg-black/60 px-4 py-3 border-t border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Output</p>
          <pre className="text-sm text-brand-gold font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  )
}

// Exercise Component
interface ExerciseProps {
  title: string
  instructions: string
  placeholder?: string
  expectedKeywords?: string[]
}

export function Exercise({ title, instructions, placeholder, expectedKeywords }: ExerciseProps) {
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'partial' | 'retry'; message: string } | null>(null)

  const handleSubmit = () => {
    if (!response.trim()) return
    
    setSubmitted(true)
    
    if (expectedKeywords && expectedKeywords.length > 0) {
      const foundKeywords = expectedKeywords.filter(kw => 
        response.toLowerCase().includes(kw.toLowerCase())
      )
      const percentage = (foundKeywords.length / expectedKeywords.length) * 100
      
      if (percentage >= 80) {
        setFeedback({
          type: 'success',
          message: 'Excellent! Your response covers the key concepts well.'
        })
      } else if (percentage >= 50) {
        setFeedback({
          type: 'partial',
          message: `Good effort! You covered ${foundKeywords.length} of ${expectedKeywords.length} key concepts. Consider expanding on: ${expectedKeywords.filter(kw => !foundKeywords.includes(kw)).join(', ')}`
        })
      } else {
        setFeedback({
          type: 'retry',
          message: 'Try to include more detail about the key concepts mentioned in the instructions.'
        })
      }
    } else {
      setFeedback({
        type: 'success',
        message: 'Response recorded! Great job thinking through this exercise.'
      })
    }
  }

  const reset = () => {
    setResponse('')
    setSubmitted(false)
    setFeedback(null)
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center border border-brand-gold/20">
          <span className="text-xl">✍️</span>
        </div>
        <div>
          <h4 className="font-display font-bold text-white">{title}</h4>
          <p className="text-sm text-brand-gold">Written Exercise</p>
        </div>
      </div>
      
      {/* Instructions */}
      <p className="text-gray-300 mb-6">{instructions}</p>
      
      {/* Response area */}
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder={placeholder || 'Write your response here...'}
        disabled={submitted}
        className="w-full p-4 bg-black/40 rounded-xl border border-white/10 text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-brand-gold/30 min-h-[150px] mb-4"
      />
      
      {/* Feedback */}
      {feedback && (
        <div className={`p-4 rounded-xl mb-4 ${
          feedback.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30' 
            : feedback.type === 'partial'
              ? 'bg-brand-gold/10 border border-brand-gold/30'
              : 'bg-red-500/10 border border-red-500/30'
        }`}>
          <p className={`text-sm ${
            feedback.type === 'success' ? 'text-green-400' : feedback.type === 'partial' ? 'text-brand-gold' : 'text-red-400'
          }`}>
            {feedback.message}
          </p>
        </div>
      )}
      
      {/* Buttons */}
      <div className="flex gap-3">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!response.trim()}
            className="flex-1 py-3 bg-brand-gold text-black font-semibold rounded-xl hover:bg-brand-deep-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Response
          </button>
        ) : (
          <button
            onClick={reset}
            className="flex-1 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

// Prompt Practice Component
// True/False Component
interface TrueFalseQuestion {
  statement: string
  isTrue: boolean
  explanation: string
}

interface TrueFalseProps {
  title: string
  statements: TrueFalseQuestion[]
}

export function TrueFalse({ title, statements }: TrueFalseProps) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(statements.length).fill(null))
  const [showExplanation, setShowExplanation] = useState<boolean[]>(new Array(statements.length).fill(false))

  const handleAnswer = (index: number, answer: boolean) => {
    if (answers[index] !== null) return
    
    const newAnswers = [...answers]
    newAnswers[index] = answer
    setAnswers(newAnswers)
    
    const newShowExplanation = [...showExplanation]
    newShowExplanation[index] = true
    setShowExplanation(newShowExplanation)
  }

  const reset = () => {
    setAnswers(new Array(statements.length).fill(null))
    setShowExplanation(new Array(statements.length).fill(false))
  }

  const allAnswered = answers.every(a => a !== null)
  const score = answers.filter((a, i) => a === statements[i].isTrue).length

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-gold/5 rounded-2xl border border-brand-gold/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center border border-brand-gold/20">
            <span className="text-xl">✅</span>
          </div>
          <div>
            <h4 className="font-display font-bold text-white">{title}</h4>
            <p className="text-sm text-brand-gold">True or False Check</p>
          </div>
        </div>
        
        {allAnswered && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Score</p>
            <p className="text-xl font-bold text-white">
              {score}/{statements.length}
            </p>
          </div>
        )}
      </div>

      {/* Statements */}
      <div className="space-y-4">
        {statements.map((item, i) => {
          const hasAnswered = answers[i] !== null
          const isCorrect = hasAnswered && answers[i] === item.isTrue
          
          return (
            <div key={i} className={`p-4 rounded-xl border transition-all ${
              hasAnswered 
                ? isCorrect 
                  ? 'bg-green-500/5 border-green-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <p className="text-gray-300 font-medium flex-1">{item.statement}</p>
                
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAnswer(i, true)}
                    disabled={hasAnswered}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      hasAnswered
                        ? item.isTrue
                          ? 'bg-green-500 text-white opacity-100'
                          : answers[i] === true 
                            ? 'bg-red-500 text-white opacity-100'
                            : 'bg-white/5 text-gray-500 opacity-50'
                        : 'bg-white/5 text-gray-400 hover:bg-green-500 hover:text-white'
                    }`}
                  >
                    True
                  </button>
                  <button
                    onClick={() => handleAnswer(i, false)}
                    disabled={hasAnswered}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      hasAnswered
                        ? !item.isTrue
                          ? 'bg-green-500 text-white opacity-100'
                          : answers[i] === false
                            ? 'bg-red-500 text-white opacity-100'
                            : 'bg-white/5 text-gray-500 opacity-50'
                        : 'bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    False
                  </button>
                </div>
              </div>

              {/* Explanation */}
              {showExplanation[i] && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-fadeIn">
                  <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-sm text-gray-400">{item.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allAnswered && (
        <button
          onClick={reset}
          className="mt-6 w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Exercise
        </button>
      )}
    </div>
  )
}


import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Quiz Submission and Auto-Grading
 * Provides instant feedback on quiz attempts
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { quizId, answers } = await request.json()

    // Fetch quiz with questions and correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Check attempt limit
    const previousAttempts = await prisma.quizAttempt.count({
      where: {
        quizId,
        userId: session.user.id,
      },
    })

    if (quiz.maxAttempts && previousAttempts >= quiz.maxAttempts) {
      return NextResponse.json(
        { error: 'Maximum attempts exceeded' },
        { status: 400 }
      )
    }

    // Grade quiz
    let correctAnswers = 0
    const totalQuestions = quiz.questions.length

    const results = quiz.questions.map((question) => {
      const userAnswer = answers[question.id]
      const correctAnswer = question.correctAnswers
      
      // For multiple choice, compare arrays
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)

      if (isCorrect) correctAnswers++

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer,
        isCorrect,
        explanation: question.explanation,
      }
    })

    const score = (correctAnswers / totalQuestions) * 100
    const passed = score >= quiz.passingScore

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        answers,
        score,
        passed,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        score,
        passed,
        correctAnswers,
        totalQuestions,
      },
      results,
    })
  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




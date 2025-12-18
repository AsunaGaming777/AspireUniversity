import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CourseLevel } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import vm from 'vm'

// Only allow owner
const OWNER_EMAIL = 'azer.kasim@icloud.com'

async function updateCourse() {
  try {
    const session = await auth()
    
    if (!session?.user?.email || session.user.email !== OWNER_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    console.log('🔄 Updating AI for Business course with comprehensive content...')

    // Find existing course
    const existingCourse = await prisma.course.findUnique({
      where: { slug: 'ai-for-business' },
      include: {
        modules: {
          include: { lessons: true }
        }
      }
    })

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Delete existing modules and lessons (same pattern as seed file)
    console.log('🗑️  Deleting existing content...')
    for (const module of existingCourse.modules) {
      await prisma.lesson.deleteMany({ where: { moduleId: module.id } })
    }
    await prisma.module.deleteMany({ where: { courseId: existingCourse.id } })

    // Read the seed file and extract modules data
    const seedFilePath = path.join(process.cwd(), 'prisma', 'seed.ts')
    const seedContent = fs.readFileSync(seedFilePath, 'utf-8')
    
    // Find the AI for Business course section
    const courseMarker = '// Create AI for Business Course - FULL SCOPE & COMPREHENSIVE'
    const courseStart = seedContent.indexOf(courseMarker)
    if (courseStart === -1) {
      throw new Error('Could not find AI for Business course in seed file')
    }
    
    // Find modules: { create: [
    const modulesMarker = seedContent.indexOf('modules: {', courseStart)
    const createMarker = seedContent.indexOf('create: [', modulesMarker)
    
    if (createMarker === -1) {
      throw new Error('Could not find modules.create array in seed file')
    }
    
    // Find the matching closing bracket for the create array
    // Count brackets to find the end, handling strings properly
    let depth = 0
    let inString = false
    let stringChar = ''
    let endPos = -1
    
    for (let i = createMarker + 9; i < seedContent.length; i++) {
      const char = seedContent[i]
      const prevChar = i > 0 ? seedContent[i - 1] : ''
      
      // Handle strings (template literals, single quotes, double quotes)
      if (!inString && (char === '`' || char === '"' || char === "'")) {
        inString = true
        stringChar = char
      } else if (inString && char === stringChar && prevChar !== '\\') {
        // Check for template literal end (backtick not preceded by $)
        if (stringChar === '`' && prevChar === '$') {
          // This is ${} interpolation, not end of string
          continue
        }
        inString = false
        stringChar = ''
      }
      
      if (inString) continue
      
      if (char === '[') depth++
      if (char === ']') {
        depth--
        if (depth === 0) {
          endPos = i + 1
          break
        }
      }
    }
    
    if (endPos === -1) {
      throw new Error('Could not find end of modules array')
    }
    
    // Extract the modules array string (from 'create: [' to matching ']')
    let modulesArrayStr = seedContent.substring(createMarker + 9, endPos).trim()
    
    // Remove comments more carefully - handle strings properly
    const lines = modulesArrayStr.split('\n')
    const cleanedLines: string[] = []
    
    for (const line of lines) {
      let cleanedLine = line
      let inString = false
      let stringChar = ''
      
      // Process character by character to properly handle strings
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        const prevChar = i > 0 ? line[i - 1] : ''
        
        // Track string boundaries
        if (!inString && (char === "'" || char === '"' || char === '`')) {
          inString = true
          stringChar = char
        } else if (inString && char === stringChar && prevChar !== '\\') {
          inString = false
          stringChar = ''
        }
        
        // If we find // and we're not in a string, remove from here to end of line
        if (!inString && char === '/' && i < line.length - 1 && line[i + 1] === '/') {
          cleanedLine = line.substring(0, i).trimEnd()
          break
        }
      }
      
      // Skip lines that are only whitespace or only comments
      const trimmed = cleanedLine.trim()
      if (trimmed === '' || trimmed === '//') {
        continue
      }
      
      cleanedLines.push(cleanedLine)
    }
    
    modulesArrayStr = cleanedLines.join('\n')
    
    // Wrap in array brackets to make it a valid expression
    const wrappedCode = `[${modulesArrayStr}]`
    
    // Use vm to safely evaluate the code
    let modulesData
    try {
      const context = vm.createContext({})
      modulesData = vm.runInContext(wrappedCode, context)
    } catch (parseError) {
      console.error('Failed to parse modules array:', parseError)
      // Log first 1000 chars for debugging
      console.error('First 1000 chars of wrapped code:', wrappedCode.substring(0, 1000))
      throw new Error(`Failed to parse modules data: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }
    
    // Update course with all modules (same pattern as seed file)
    console.log('📝 Updating course with modules...')
    const updated = await prisma.course.update({
      where: { id: existingCourse.id },
      data: {
        title: 'AI for Business',
        subtitle: 'The Complete Guide to Transforming Your Business with Artificial Intelligence',
        description: 'The most comprehensive AI for business course available. Master every aspect of implementing AI in your business—from strategy to execution, from tools to products, from marketing to operations. Learn how to use AI to drive revenue, reduce costs, automate processes, build products, and create new income streams. This course covers everything you need to know to become an AI-powered business leader.',
        level: CourseLevel.intermediate,
        duration: 60,
        published: true,
        featured: true,
        objectives: `By the end of this comprehensive course, you will master:
- Complete understanding of how AI creates business value across all functions
- Strategic AI planning and implementation frameworks
- All major AI tools for content, images, video, automation, and operations
- AI-powered marketing, sales, and customer acquisition strategies
- Customer service automation and AI chatbots
- Financial analysis and business intelligence with AI
- Building and selling AI-powered products and SaaS
- Complete AI implementation and integration processes
- Scaling AI across entire organizations
- Multiple monetization strategies (services, products, consulting, content)
- ROI measurement and optimization techniques
- Industry-specific AI applications and case studies
- AI ethics, governance, and responsible implementation
- Future trends and staying ahead of the AI curve`,
        prerequisites: 'Basic business understanding. No technical background required—we cover everything from the ground up. Access to internet and willingness to implement AI tools (we cover free options extensively).',
        modules: {
          create: modulesData,
        },
      },
    })

    // Get updated course with modules to return counts
    const courseWithModules = await prisma.course.findUnique({
      where: { id: updated.id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    })

    const moduleCount = courseWithModules?.modules.length || 0
    const lessonCount = courseWithModules?.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 0

    return NextResponse.json({ 
      success: true,
      message: 'AI for Business course updated successfully with comprehensive content',
      courseId: updated.id,
      modules: moduleCount,
      lessons: lessonCount
    })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update course', 
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  return updateCourse()
}

export async function POST(req: NextRequest) {
  return updateCourse()
}

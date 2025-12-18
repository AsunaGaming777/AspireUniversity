import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CourseLevel } from '@prisma/client'

/**
 * API endpoint to seed/update the AI for Coding course
 * This uses the app's working database connection
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🌱 Starting AI for Coding course seed via API...')

    // Check if course already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug: 'ai-for-coding' },
      include: { modules: { include: { lessons: true } } },
    })

    if (existingCourse) {
      console.log('📝 Course exists, deleting modules and lessons to update...')
      // Delete modules (which will cascade delete lessons) to allow updating course
      await prisma.module.deleteMany({
        where: { courseId: existingCourse.id },
      })
      console.log('🗑️  Deleted existing modules and lessons')
      
      // Update the existing course
      await prisma.course.update({
        where: { slug: 'ai-for-coding' },
        data: {
          title: 'AI for Coding',
          subtitle: 'The Complete Guide to AI-Enhanced Development and Building AI-Powered Applications',
          description:
            'The most comprehensive AI for coding course available. Master every aspect of using AI to enhance your development workflow—from AI coding assistants to building production-ready AI applications. Learn how to use AI to write better code faster, debug efficiently, build AI-powered SaaS products, create AI agents, and integrate AI into every part of your development process. This course covers everything you need to know to become an AI-powered developer.',
          level: CourseLevel.intermediate,
          duration: 80,
          published: true,
          featured: true,
          plans: 'standard,mastery,mastermind',
          objectives: `By the end of this comprehensive course, you will master:
- Complete understanding of AI coding assistants (GitHub Copilot, Cursor, Codeium, etc.)
- Advanced prompt engineering for code generation and debugging
- Building AI-powered applications from scratch
- Creating AI agents that can write, test, and deploy code
- AI-powered debugging, testing, and code review techniques
- Integrating AI APIs (OpenAI, Anthropic, etc.) into applications
- Building production-ready SaaS products with AI
- AI for documentation, technical writing, and code explanation
- Code optimization and refactoring with AI assistance
- AI-powered development workflows and automation
- Building AI tools for developers
- Multiple monetization strategies (SaaS, services, products)
- Best practices for AI-assisted development
- Security and ethics in AI-powered coding`,
          prerequisites:
            'Basic programming knowledge (any language). Familiarity with command line and Git helpful but not required. We cover everything from setup to advanced techniques.',
        },
      })
      console.log('✅ Updated existing course')
    }

    // Create or get the course
    const aiForCodingCourse = existingCourse 
      ? await prisma.course.findUnique({ where: { slug: 'ai-for-coding' } })
      : await prisma.course.create({
      data: {
        title: 'AI for Coding',
        subtitle: 'The Complete Guide to AI-Enhanced Development and Building AI-Powered Applications',
        description:
          'The most comprehensive AI for coding course available. Master every aspect of using AI to enhance your development workflow—from AI coding assistants to building production-ready AI applications. Learn how to use AI to write better code faster, debug efficiently, build AI-powered SaaS products, create AI agents, and integrate AI into every part of your development process. This course covers everything you need to know to become an AI-powered developer.',
        slug: 'ai-for-coding',
        level: CourseLevel.intermediate,
        duration: 80,
        published: true,
        featured: true,
        plans: 'standard,mastery,mastermind',
        objectives: `By the end of this comprehensive course, you will master:
- Complete understanding of AI coding assistants (GitHub Copilot, Cursor, Codeium, etc.)
- Advanced prompt engineering for code generation and debugging
- Building AI-powered applications from scratch
- Creating AI agents that can write, test, and deploy code
- AI-powered debugging, testing, and code review techniques
- Integrating AI APIs (OpenAI, Anthropic, etc.) into applications
- Building production-ready SaaS products with AI
- AI for documentation, technical writing, and code explanation
- Code optimization and refactoring with AI assistance
- AI-powered development workflows and automation
- Building AI tools for developers
- Multiple monetization strategies (SaaS, services, products)
- Best practices for AI-assisted development
- Security and ethics in AI-powered coding`,
        prerequisites:
          'Basic programming knowledge (any language). Familiarity with command line and Git helpful but not required. We cover everything from setup to advanced techniques.',
        modules: {
          create: [
            {
              order: 1,
              title: 'CHUNK 1: AI Coding Assistants & Development Workflow',
              description:
                'Master AI coding assistants, setup, configuration, and fundamental workflows for AI-enhanced development.',
              duration: 900, // 15 hours
              lessons: {
                create: [
                  {
                    order: 1,
                    title: 'The AI Coding Revolution: Why Every Developer Needs AI',
                    description:
                      'Understanding how AI is transforming software development and why developers using AI are 10x more productive.',
                    content: `# The AI Coding Revolution: Why Every Developer Needs AI

## The Productivity Multiplier

AI isn't replacing developers—it's making them **10x more productive**. Developers using AI coding assistants are seeing:
- **50-80% faster code completion**
- **40-60% reduction in debugging time**
- **3-5x more code written per day**
- **90% reduction in boilerplate writing**
- **Instant documentation and code explanation**

### The Competitive Edge

**Before AI:**
- Writing boilerplate: 30 minutes
- Debugging errors: 2-4 hours
- Writing tests: 1-2 hours
- Documentation: 1 hour
- **Total: 5-8 hours for a feature**

**With AI:**
- AI generates boilerplate: 2 minutes
- AI helps debug: 30 minutes
- AI writes tests: 15 minutes
- AI creates documentation: 5 minutes
- **Total: 1 hour for the same feature**

**That's 5-8x faster development.**

[TAKEAWAY:{"title":"AI Coding Productivity","icon":"⚡","points":["AI coding assistants make developers 5-8x more productive","50-80% faster code completion with AI","40-60% reduction in debugging time","90% reduction in boilerplate writing"]}]

## Three Ways AI Transforms Coding

### 1. Code Generation (Speed)

**What AI Does:**
- Generates functions, classes, and entire modules from descriptions
- Writes boilerplate code instantly
- Creates tests from code
- Generates documentation automatically

**Real Examples:**
- **GitHub Copilot:** Completes entire functions as you type
- **Cursor:** Generates full features from natural language
- **Codeium:** Suggests optimizations and refactors

**Time Saved:** 70-90% on repetitive coding tasks

### 2. Debugging & Problem Solving (Quality)

**What AI Does:**
- Explains error messages in plain English
- Suggests fixes for bugs
- Identifies security vulnerabilities
- Optimizes performance bottlenecks

**Real Examples:**
- **ChatGPT:** Debugs complex errors by analyzing stack traces
- **GitHub Copilot Chat:** Explains code and suggests improvements
- **Replit AI:** Fixes bugs automatically

**Time Saved:** 60-80% on debugging

### 3. Learning & Understanding (Knowledge)

**What AI Does:**
- Explains complex code in simple terms
- Teaches new frameworks and libraries
- Generates examples and tutorials
- Answers technical questions instantly

**Real Examples:**
- **Cursor Chat:** Explains entire codebases
- **Phind:** Answers technical questions with code examples
- **ChatGPT:** Teaches new programming concepts

**Knowledge Gain:** Learn new technologies 5x faster

[QUIZ:{"title":"AI Coding Benefits Quiz","questions":[{"question":"What percentage of code completion speed improvement do developers typically see with AI assistants?","options":["20-30%","50-80%","100-150%","200%+"],"correctIndex":1,"explanation":"Developers using AI coding assistants typically see 50-80% faster code completion, allowing them to write code much more efficiently."},{"question":"How much time is typically saved on debugging with AI assistance?","options":["20-30%","40-60%","70-90%","100%"],"correctIndex":1,"explanation":"AI-powered debugging tools help reduce debugging time by 40-60% by quickly identifying issues and suggesting fixes."},{"question":"What percentage reduction in boilerplate writing do developers see with AI?","options":["50%","70%","90%","100%"],"correctIndex":2,"explanation":"AI coding assistants can reduce boilerplate writing by up to 90%, handling repetitive code generation automatically."}]}]

## Real-World Success Stories

### Case Study 1: Solo Developer (10x Productivity)

**The Developer:** Freelance full-stack developer

**The Problem:**
- Could only handle 2-3 projects at a time
- Spending 60% of time on boilerplate and debugging
- Revenue capped at $8,000/month

**The AI Solution:**
- Implemented Cursor AI for all development
- Used GitHub Copilot for code completion
- ChatGPT for debugging and learning

**The Result:**
- Can now handle 8-10 projects simultaneously
- Revenue increased to $25,000/month
- **3x growth in 4 months**
- Higher code quality (AI catches bugs early)

### Case Study 2: Startup Team (Faster MVP)

**The Startup:** Early-stage SaaS company

**The Problem:**
- MVP timeline: 6 months
- Limited budget for developers
- Need to move fast

**The AI Solution:**
- Entire team uses AI coding assistants
- AI generates boilerplate and tests
- AI helps with architecture decisions

**The Result:**
- MVP completed in 2 months (3x faster)
- 40% cost savings on development
- Higher code quality
- **Launched 4 months ahead of schedule**

### Case Study 3: Enterprise Team (Code Quality)

**The Company:** Large tech company

**The Problem:**
- High bug rate in production
- Slow code reviews
- Inconsistent code quality

**The AI Solution:**
- AI-powered code review tools
- AI generates comprehensive tests
- AI documentation for all code

**The Result:**
- 50% reduction in production bugs
- 70% faster code reviews
- Consistent code quality across team
- **$500K+ saved in bug fixes**

[CHALLENGE:{"title":"Identify Your AI Coding Opportunity","description":"Apply AI to your development workflow","difficulty":"medium","task":"For your current development workflow, identify:\\n\\n1. **Time Waster:** What repetitive coding task takes the most time? (boilerplate, tests, documentation)\\n\\n2. **Pain Point:** What's your biggest development challenge? (debugging, learning new tech, code quality)\\n\\n3. **AI Solution:** Which AI tool could solve this? (Copilot, Cursor, ChatGPT, etc.)\\n\\nWrite down specific numbers: current time spent, potential time saved, productivity gain.","hints":["Start with tasks you do repeatedly every day","Look for areas where you spend hours but AI could do in minutes","Consider what would happen if you could code 5x faster","Think about learning new technologies faster"],"solution":"The key is to be specific:\\n\\n**Time Waster:** 'I spend 2 hours/day writing boilerplate. AI could do this in 10 minutes, saving 1.5 hours/day = 7.5 hours/week.'\\n\\n**Pain Point:** 'Debugging takes 4 hours per bug. AI could reduce this to 1 hour, saving 3 hours per bug.'\\n\\n**AI Solution:** 'Cursor AI for feature generation, GitHub Copilot for code completion, ChatGPT for debugging.'"}]

## The AI Coding Tool Landscape

### Level 1: Code Completion (Easiest - Start Here)
- **GitHub Copilot:** Inline code suggestions
- **Tabnine:** AI-powered autocomplete
- **Codeium:** Free alternative to Copilot
- **Time to Setup:** 5 minutes
- **Cost:** Free-$20/month
- **ROI:** Immediate

### Level 2: AI Chat Assistants (Medium)
- **Cursor:** AI-powered editor with chat
- **GitHub Copilot Chat:** Conversational coding
- **Replit AI:** Full development environment
- **Time to Setup:** 15-30 minutes
- **Cost:** $10-30/month
- **ROI:** High within days

### Level 3: AI Agents (Advanced)
- **Aider:** AI pair programmer
- **Windsurf:** AI-first IDE
- **v0.dev:** AI generates entire UIs
- **Time to Setup:** 1-2 hours
- **Cost:** $20-50/month
- **ROI:** Very high for complex projects

**Start at Level 1, prove value, then scale up.**

## Common Myths Debunked

### Myth 1: "AI Will Replace Developers"
**Reality:** AI makes developers more valuable. It handles repetitive tasks, freeing developers for creative problem-solving and architecture.

### Myth 2: "AI-Generated Code is Low Quality"
**Reality:** AI code quality matches or exceeds human code when properly guided. AI also catches bugs humans miss.

### Myth 3: "You Need to be an Expert to Use AI"
**Reality:** AI actually helps beginners learn faster. It explains code, suggests best practices, and teaches as you go.

### Myth 4: "AI Coding Tools are Expensive"
**Reality:** Many tools are free or very affordable. The productivity gains pay for themselves immediately.

## What You'll Learn in This Course

This comprehensive course covers:

1. **AI Coding Assistants Mastery**
   - GitHub Copilot, Cursor, Codeium, and more
   - Setup, configuration, and optimization
   - Advanced features and workflows

2. **Prompt Engineering for Code**
   - Writing effective prompts for code generation
   - Debugging with AI
   - Code explanation and documentation

3. **Building AI-Powered Applications**
   - Integrating AI APIs (OpenAI, Anthropic, etc.)
   - Building chatbots and AI features
   - Creating AI SaaS products

4. **AI Development Workflows**
   - AI-powered testing and debugging
   - Code review with AI
   - Documentation automation

5. **Advanced Topics**
   - AI agents for development
   - Custom AI tools
   - Production deployment

## Getting Started

**Prerequisites:**
- Basic programming knowledge (any language)
- Code editor (VS Code recommended)
- Internet connection

**What You'll Need:**
- GitHub account (for Copilot)
- OpenAI API key (optional, for advanced features)
- Willingness to learn and experiment

**Time Investment:**
- 15-20 hours for fundamentals
- 40-60 hours for mastery
- Lifetime access to updates

## The Future of Coding

AI is not a trend—it's the future. Developers who master AI tools now will:
- Build products 5-10x faster
- Write higher quality code
- Learn new technologies faster
- Command higher salaries
- Create more innovative solutions

**The question isn't "Should I use AI?"**  
**It's "How fast can I master it?"**

Let's begin your journey to becoming an AI-powered developer! 🚀`,
                    objectives: `- Understand how AI transforms software development
- Identify productivity gains from AI coding assistants
- Recognize the competitive advantage of AI-enhanced development
- Learn the AI coding tool landscape
- Debunk common myths about AI in coding`,
                    videoUrl: 'https://example.com/video-ai-coding-intro.mp4',
                    videoDuration: 1200,
                    published: true,
                    isFree: true,
                  },
                ],
              },
            },
          ],
        },
      },
    })

    // Ensure modules are created (whether course was new or existing)
    const courseId = aiForCodingCourse!.id
    const existingModules = await prisma.module.findMany({
      where: { courseId },
    })

    if (existingModules.length === 0) {
      // Create all 4 modules with initial lessons
      const modules = await Promise.all([
        prisma.module.create({
          data: {
            courseId,
            order: 1,
            title: 'CHUNK 1: AI Coding Assistants & Development Workflow',
            description:
              'Master AI coding assistants, setup, configuration, and fundamental workflows for AI-enhanced development.',
            duration: 900,
            lessons: {
              create: {
                order: 1,
                title: 'The AI Coding Revolution: Why Every Developer Needs AI',
                description:
                  'Understanding how AI is transforming software development and why developers using AI are 10x more productive.',
                content: `# The AI Coding Revolution: Why Every Developer Needs AI

## The Productivity Multiplier

AI isn't replacing developers—it's making them **10x more productive**. Developers using AI coding assistants are seeing:
- **50-80% faster code completion**
- **40-60% reduction in debugging time**
- **3-5x more code written per day**
- **90% reduction in boilerplate writing**

[TAKEAWAY:{"title":"AI Coding Productivity","icon":"⚡","points":["AI coding assistants make developers 5-8x more productive","50-80% faster code completion with AI","40-60% reduction in debugging time","90% reduction in boilerplate writing"]}]

## Three Ways AI Transforms Coding

### 1. Code Generation (Speed)
- Generates functions, classes, and entire modules
- Writes boilerplate code instantly
- Creates tests from code
- Generates documentation automatically

### 2. Debugging & Problem Solving (Quality)
- Explains error messages in plain English
- Suggests fixes for bugs
- Identifies security vulnerabilities
- Optimizes performance bottlenecks

### 3. Learning & Understanding (Knowledge)
- Explains complex code in simple terms
- Teaches new frameworks and libraries
- Generates examples and tutorials
- Answers technical questions instantly

Let's begin your journey to becoming an AI-powered developer! 🚀`,
                objectives: `- Understand how AI transforms software development
- Identify productivity gains from AI coding assistants
- Recognize the competitive advantage of AI-enhanced development`,
                videoUrl: 'https://example.com/video-ai-coding-intro.mp4',
                videoDuration: 1200,
                published: true,
                isFree: true,
              },
            },
          },
        }),
        prisma.module.create({
          data: {
            courseId,
            order: 2,
            title: 'CHUNK 2: Prompt Engineering for Code Generation',
            description:
              'Master the art of prompting AI to generate perfect code, debug effectively, and explain complex codebases.',
            duration: 900,
            lessons: {
              create: {
                order: 1,
                title: 'The Art of Prompting for Code',
                description:
                  'Learn fundamental principles of writing effective prompts that generate high-quality, production-ready code.',
                content: `# The Art of Prompting for Code

## Why Prompting Matters

The difference between a good prompt and a great prompt is:
- **Good prompt:** Gets you code that works
- **Great prompt:** Gets you production-ready, optimized, well-documented code

## Fundamental Principles

### 1. Be Specific and Detailed
Provide clear requirements, input/output formats, error handling, and code style preferences.

### 2. Provide Context
Include language, framework, existing patterns, and related code.

### 3. Show Examples
Demonstrate the expected behavior with concrete examples.

### 4. Specify Requirements
Always include language, framework, input/output format, error handling, and performance considerations.

Master these principles to get the best results from AI code generation!`,
                objectives: `- Understand fundamental principles of code prompting
- Write specific, detailed prompts for code generation
- Use prompt templates effectively`,
                videoUrl: 'https://example.com/video-prompting-code.mp4',
                videoDuration: 1800,
                published: true,
                isFree: false,
              },
            },
          },
        }),
        prisma.module.create({
          data: {
            courseId,
            order: 3,
            title: 'CHUNK 3: Building AI-Powered Applications',
            description:
              'Learn to build production-ready AI applications, integrate AI APIs, and create AI-powered SaaS products.',
            duration: 1200,
            lessons: {
              create: {
                order: 1,
                title: 'Integrating AI APIs: OpenAI, Anthropic, and More',
                description:
                  'Master integrating major AI APIs into your applications for text generation, chat, and more.',
                content: `# Integrating AI APIs: OpenAI, Anthropic, and More

## Overview

Learn to integrate the most powerful AI APIs into your applications. We'll cover OpenAI, Anthropic Claude, and other major providers.

## OpenAI API Integration

### Setup
\`\`\`bash
pip install openai
\`\`\`

### Basic Usage
\`\`\`python
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
\`\`\`

## Building Chat Applications

Learn to build complete chat interfaces with AI, handle context, manage conversations, and create production-ready applications.

Master AI API integration and unlock unlimited possibilities! 🚀`,
                objectives: `- Integrate OpenAI API into applications
- Use Anthropic Claude API
- Build chat applications with AI
- Implement error handling and rate limiting`,
                videoUrl: 'https://example.com/video-ai-apis.mp4',
                videoDuration: 2400,
                published: true,
                isFree: false,
              },
            },
          },
        }),
        prisma.module.create({
          data: {
            courseId,
            order: 4,
            title: 'CHUNK 4: Advanced AI Development & Production Deployment',
            description:
              'Master advanced topics: AI agents, custom tools, production deployment, and scaling AI applications.',
            duration: 900,
            lessons: {
              create: {
                order: 1,
                title: 'Building AI Agents for Development',
                description:
                  'Create autonomous AI agents that can write, test, and deploy code automatically.',
                content: `# Building AI Agents for Development

## What are AI Agents?

AI agents are autonomous systems that can:
- Understand tasks
- Break them into steps
- Execute actions
- Learn from results
- Complete complex workflows

## Agent Architecture

### Core Components
1. **Planning Module:** Breaks tasks into steps
2. **Execution Module:** Performs actions
3. **Memory Module:** Stores context and learns
4. **Tool Module:** Accesses external APIs and tools

## Building a Code Generation Agent

Learn to create agents that can generate code, test it, fix errors, and complete entire features autonomously.

AI agents are the future of development! 🚀`,
                objectives: `- Understand AI agent architecture
- Build basic code generation agents
- Create multi-step development agents
- Use LangChain for agent development`,
                videoUrl: 'https://example.com/video-ai-agents.mp4',
                videoDuration: 2400,
                published: true,
                isFree: false,
              },
            },
          },
        }),
      ])

      console.log(`✅ Created ${modules.length} modules with initial lessons`)
    }

    console.log(`✅ ${existingCourse ? 'Updated' : 'Created'} comprehensive course: ${aiForCodingCourse!.title}`)

    return NextResponse.json({
      success: true,
      message: 'AI for Coding course created successfully',
      course: {
        id: aiForCodingCourse.id,
        title: aiForCodingCourse.title,
        slug: aiForCodingCourse.slug,
      },
    })
  } catch (error: any) {
    console.error('❌ Error seeding AI for Coding course:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed course',
        details: error.stack,
      },
      { status: 500 }
    )
  }
}



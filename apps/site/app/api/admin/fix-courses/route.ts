import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CourseLevel } from '@prisma/client'

/**
 * API endpoint to fix both AI for Business and AI for Coding courses
 * Restores AI for Business content and expands AI for Coding to 15 lessons
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🔧 Starting course fixes...')

    // ============================================
    // FIX AI FOR BUSINESS COURSE
    // ============================================
    console.log('📚 Fixing AI for Business course...')
    
    const existingBusinessCourse = await prisma.course.findUnique({
      where: { slug: 'ai-for-business' },
      include: { modules: { include: { lessons: true } } },
    })

    if (existingBusinessCourse) {
      // Delete existing modules to recreate
      await prisma.module.deleteMany({
        where: { courseId: existingBusinessCourse.id },
      })
      console.log('🗑️  Deleted existing AI for Business modules')
    }

    const businessCourse = existingBusinessCourse 
      ? await prisma.course.update({
          where: { slug: 'ai-for-business' },
          data: {
            title: 'AI for Business',
            subtitle: 'The Complete Guide to Transforming Your Business with Artificial Intelligence',
            description: 'The most comprehensive AI for business course available. Master every aspect of implementing AI in your business—from strategy to execution, from tools to products, from marketing to operations. Learn how to use AI to drive revenue, reduce costs, automate processes, build products, and create new income streams. This course covers everything you need to know to become an AI-powered business leader.',
            level: CourseLevel.intermediate,
            duration: 80,
            published: true,
            featured: true,
            plans: 'standard,mastery,mastermind',
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
          },
        })
      : await prisma.course.create({
          data: {
            title: 'AI for Business',
            subtitle: 'The Complete Guide to Transforming Your Business with Artificial Intelligence',
            description: 'The most comprehensive AI for business course available. Master every aspect of implementing AI in your business—from strategy to execution, from tools to products, from marketing to operations.',
            slug: 'ai-for-business',
            level: CourseLevel.intermediate,
            duration: 80,
            published: true,
            featured: true,
            plans: 'standard,mastery,mastermind',
            objectives: `Master AI for business implementation, strategy, tools, and monetization.`,
            prerequisites: 'Basic business understanding. No technical background required.',
          },
        })

    // Create CHUNK 1: AI Business Strategy & Fundamentals
    const chunk1 = await prisma.module.create({
      data: {
        courseId: businessCourse.id,
        order: 1,
        title: 'CHUNK 1: AI Business Strategy & Fundamentals',
        description: 'Master the complete foundation of AI for business: strategy, value creation, opportunity identification, and comprehensive planning frameworks.',
        duration: 900,
        lessons: {
          create: [
            {
              order: 1,
              title: 'Why AI is the Ultimate Business Multiplier',
              description: 'Understanding the economic impact of AI and why businesses that adopt AI early dominate their markets.',
              content: `# Why AI is the Ultimate Business Multiplier

## The AI Revolution is Here

We're not talking about the future—AI is transforming businesses **right now**. Companies using AI are seeing:
- **40-60% cost reduction** in operations
- **20-30% revenue increase** from better targeting
- **10x productivity** in content creation
- **24/7 automated customer service** at a fraction of the cost

### The Competitive Advantage Window

Right now, there's a **2-3 year window** where early AI adopters will dominate their markets. After that, AI becomes table stakes—everyone has it, and you're just keeping up.

**The question isn't "Should I use AI?"**  
**It's "How fast can I implement it?"**

[TAKEAWAY:{"title":"The AI Advantage Window","icon":"⏰","points":["Early adopters gain 2-3 years of competitive advantage","AI implementation is accelerating—don't wait","Companies using AI are seeing 40-60% cost reductions","Revenue increases of 20-30% are common with AI adoption"]}]

## Three Ways AI Creates Business Value

### 1. Cost Reduction (Bottom Line Impact)
- Customer Service: 99% cost reduction with AI chatbots
- Content Creation: 90% time saved
- Data Analysis: Instant insights vs days of analysis

### 2. Revenue Generation (Top Line Impact)
- Personalization: Amazon generates 35% of revenue from AI recommendations
- Lead Generation: 60% reduction in cost per lead
- Upselling: 20-40% increase in average order value

### 3. New Business Models (Market Creation)
- AI-Enabled SaaS Products
- AI Consulting Services
- AI-Powered Marketplaces
- Content at Scale

[QUIZ:{"title":"AI Business Value Quiz","questions":[{"question":"What is the typical cost reduction percentage companies see when implementing AI for customer service?","options":["10-20%","40-60%","80-90%","100%"],"correctIndex":1,"explanation":"Companies implementing AI for customer service typically see 40-60% cost reductions by automating routine queries and handling more volume with fewer human agents."}]}]

## Real-World Success Stories

### Case Study 1: Content Agency (10x Growth)
- Problem: Could only handle 5 clients
- Solution: Implemented Jasper AI
- Result: Revenue increased from $10,000/month to $40,000/month in 6 months

### Case Study 2: E-commerce Store (30% Revenue Increase)
- Problem: Low conversion rate (2%), high cart abandonment (70%)
- Solution: AI personalization engine
- Result: 30% revenue increase in 3 months

## The AI Implementation Spectrum

### Level 1: AI Tools (Easiest - Start Here)
- Use existing AI tools (ChatGPT, Jasper, Midjourney)
- Time: Days to implement
- Cost: $20-200/month
- ROI: Immediate

### Level 2: AI Integrations (Medium)
- Integrate AI APIs into existing systems
- Time: Weeks to implement
- Cost: $500-5,000 setup + usage fees
- ROI: High within months

### Level 3: Custom AI Solutions (Advanced)
- Build custom AI models for specific needs
- Time: Months to implement
- Cost: $10,000-100,000+
- ROI: Very high but takes longer

**Start at Level 1, prove value, then scale up.**`,
              objectives: `- Understand how AI creates business value
- Identify the competitive advantage window
- Learn the three ways AI creates value
- Recognize real-world success stories
- Understand the AI implementation spectrum`,
              videoUrl: 'https://example.com/video-ai-business-intro.mp4',
              videoDuration: 1800,
              published: true,
              isFree: true,
            },
          ],
        },
      },
    })

    // Fetch the created module with lessons to get count
    const chunk1WithLessons = await prisma.module.findUnique({
      where: { id: chunk1.id },
      include: { lessons: true }
    })
    console.log(`✅ Created AI for Business CHUNK 1 with ${chunk1WithLessons?.lessons?.length || 0} lesson(s)`)

    // ============================================
    // EXPAND AI FOR CODING TO 15 LESSONS
    // ============================================
    console.log('💻 Expanding AI for Coding course to 15 lessons...')
    
    const existingCodingCourse = await prisma.course.findUnique({
      where: { slug: 'ai-for-coding' },
      include: { modules: { include: { lessons: true } } },
    })

    if (existingCodingCourse) {
      await prisma.module.deleteMany({
        where: { courseId: existingCodingCourse.id },
      })
      console.log('🗑️  Deleted existing AI for Coding modules')
    }

    const codingCourse = existingCodingCourse
      ? await prisma.course.update({
          where: { slug: 'ai-for-coding' },
          data: {
            title: 'AI for Coding',
            subtitle: 'Master AI-Powered Development: From Coding Assistants to Building AI Applications',
            description: 'The complete guide to using AI to enhance your coding workflow. Learn how to use AI coding assistants (GitHub Copilot, Cursor, etc.), master prompt engineering for code generation, debug with AI, build AI-powered applications, and become 10x more productive as a developer.',
            level: CourseLevel.intermediate,
            duration: 80,
            published: true,
            featured: true,
            plans: 'standard,mastery,mastermind',
            objectives: `By the end of this course, you will:
- Master AI coding assistants (GitHub Copilot, Cursor, Codeium)
- Write perfect prompts for code generation
- Debug code 10x faster with AI
- Build AI-powered applications
- Integrate AI APIs into your projects
- Create AI agents for development
- Optimize your entire coding workflow with AI`,
            prerequisites: 'Basic programming knowledge (any language). We cover everything from setup to advanced techniques.',
          },
        })
      : await prisma.course.create({
          data: {
            title: 'AI for Coding',
            subtitle: 'Master AI-Powered Development: From Coding Assistants to Building AI Applications',
            description: 'The complete guide to using AI to enhance your coding workflow.',
            slug: 'ai-for-coding',
            level: CourseLevel.intermediate,
            duration: 80,
            published: true,
            featured: true,
            plans: 'standard,mastery,mastermind',
            objectives: `Master AI coding assistants, prompts, debugging, and building AI applications.`,
            prerequisites: 'Basic programming knowledge.',
          },
        })

    // Create comprehensive modules with 15 lessons total
    const codingModules = await Promise.all([
      // Module 1: AI Coding Assistants (5 lessons)
      prisma.module.create({
        data: {
          courseId: codingCourse.id,
          order: 1,
          title: 'Module 1: AI Coding Assistants Mastery',
          description: 'Master GitHub Copilot, Cursor, and other AI coding assistants to write code 10x faster.',
          duration: 1200,
          lessons: {
            create: [
              {
                order: 1,
                title: 'The AI Coding Revolution: Why Every Developer Needs AI',
                description: 'Understanding how AI transforms software development and makes developers 10x more productive.',
                content: `# The AI Coding Revolution

## The Productivity Multiplier

AI isn't replacing developers—it's making them **10x more productive**:
- **50-80% faster code completion**
- **40-60% reduction in debugging time**
- **3-5x more code written per day**
- **90% reduction in boilerplate writing**

### Before vs After AI

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

**That's 5-8x faster development!**

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
- Learn the three ways AI transforms coding`,
                videoUrl: 'https://example.com/video-ai-coding-intro.mp4',
                videoDuration: 1200,
                published: true,
                isFree: true,
              },
              {
                order: 2,
                title: 'Setting Up GitHub Copilot: Your AI Pair Programmer',
                description: 'Complete setup guide for GitHub Copilot - the most popular AI coding assistant.',
                content: `# Setting Up GitHub Copilot

## What is GitHub Copilot?

GitHub Copilot is an AI pair programmer that suggests code as you type. It's powered by OpenAI's Codex and trained on billions of lines of code.

## Installation Steps

### For VS Code:
1. Open VS Code
2. Go to Extensions (Cmd/Ctrl + Shift + X)
3. Search for "GitHub Copilot"
4. Click Install
5. Sign in with GitHub account
6. Start your free trial (or subscribe for $10/month)

### For Other Editors:
- JetBrains IDEs: Install from plugin marketplace
- Neovim: Use copilot.vim plugin
- Emacs: Use copilot.el package

## Configuration

\`\`\`json
// VS Code settings.json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false
  },
  "github.copilot.editor.enableAutoCompletions": true
}
\`\`\`

## First Test

Create a new file and type:
\`\`\`python
# Function to calculate fibonacci
def fibonacci
\`\`\`

Copilot should suggest the complete function!

## Best Practices

1. **Be Specific in Comments:** Write detailed comments to get better suggestions
2. **Use Type Hints:** Copilot works better with type hints
3. **Provide Examples:** Show Copilot what you want with examples

You're now ready to code with AI assistance! 🚀`,
                objectives: `- Install and configure GitHub Copilot
- Set up Copilot in VS Code
- Configure Copilot for optimal suggestions
- Test Copilot with your first code generation`,
                videoUrl: 'https://example.com/video-copilot-setup.mp4',
                videoDuration: 900,
                published: true,
                isFree: false,
              },
              {
                order: 3,
                title: 'Mastering Cursor: The AI-First Code Editor',
                description: 'Deep dive into Cursor - the most powerful AI coding tool available.',
                content: `# Mastering Cursor: The AI-First Code Editor

## Why Cursor is Revolutionary

Cursor is built from the ground up for AI-assisted development. Unlike traditional editors with AI plugins, Cursor is designed for AI-first workflows.

## Key Features

### 1. Composer (Cmd/Ctrl + I)
Generate entire features with natural language:
- Describe what you want
- Cursor generates complete implementation
- Edit and refine iteratively

### 2. Chat (Cmd/Ctrl + L)
Ask questions about your codebase:
- "How does this authentication work?"
- "What's the best way to add caching here?"
- "Explain this complex function"

### 3. Inline Editing
Select code and ask Cursor to:
- Refactor it
- Add error handling
- Optimize performance
- Add documentation

## Advanced Workflows

### Multi-File Editing

\`\`\`
"Create a user authentication system with:
- User model in models/user.py
- Auth routes in routes/auth.py
- Middleware in middleware/auth.py
- Tests in tests/test_auth.py"
\`\`\`

Cursor understands your entire codebase and generates coordinated code across multiple files!

## Best Practices

1. **Be Specific:** Describe exactly what you want
2. **Use Context:** Reference existing code patterns
3. **Iterate:** Refine generated code
4. **Review:** Always review AI-generated code

Master Cursor, and you'll code 10x faster! 🚀`,
                objectives: `- Master Cursor's Composer feature
- Use Cursor Chat effectively
- Perform multi-file edits
- Build complete features with AI`,
                videoUrl: 'https://example.com/video-cursor-mastery.mp4',
                videoDuration: 1800,
                published: true,
                isFree: false,
              },
              {
                order: 4,
                title: 'Using Codeium and Other Free AI Coding Tools',
                description: 'Explore free alternatives to Copilot and Cursor for AI-assisted coding.',
                content: `# Using Codeium and Other Free AI Coding Tools

## Free AI Coding Assistants

### Codeium
- **Free forever** (with usage limits)
- Works in VS Code, JetBrains, Vim, and more
- Similar features to Copilot
- No credit card required

### Tabnine
- Free tier available
- AI-powered autocomplete
- Works offline
- Multiple language support

### Amazon CodeWhisperer
- Free for individual developers
- AWS integration
- Security scanning built-in

## Setting Up Codeium

1. Install Codeium extension in VS Code
2. Sign up for free account
3. Start coding - suggestions appear automatically!

## Comparison

| Feature | Copilot | Cursor | Codeium |
|---------|---------|--------|---------|
| Cost | $10/month | $20/month | Free |
| Quality | Excellent | Excellent | Very Good |
| Setup | Easy | Easy | Easy |

## Best Practices

1. **Try Multiple Tools:** Find what works best for you
2. **Use Free Options First:** Start with Codeium
3. **Upgrade When Needed:** Move to paid tools for advanced features

Start with free tools, then upgrade as needed! 🚀`,
                objectives: `- Set up Codeium for free AI coding assistance
- Explore other free AI coding tools
- Compare different AI coding assistants
- Choose the right tool for your needs`,
                videoUrl: 'https://example.com/video-codeium.mp4',
                videoDuration: 1200,
                published: true,
                isFree: false,
              },
              {
                order: 5,
                title: 'Optimizing Your AI Coding Workflow',
                description: 'Learn advanced techniques to maximize productivity with AI coding assistants.',
                content: `# Optimizing Your AI Coding Workflow

## Workflow Optimization Strategies

### 1. Start with Comments
Write detailed comments first, then let AI generate code:
\`\`\`python
# Function to process user orders:
# - Validate order data
# - Check inventory
# - Calculate total with tax
# - Create order record
# - Send confirmation email
# - Return order ID
\`\`\`

### 2. Use Test-Driven Development
Write tests first, then generate implementation:
\`\`\`python
def test_calculate_total():
    assert calculate_total([1, 2, 3]) == 6
    assert calculate_total([]) == 0

# Now ask AI to implement calculate_total
\`\`\`

### 3. Iterative Refinement
- Generate initial code
- Review and refine
- Ask AI to improve specific aspects
- Repeat until perfect

## Keyboard Shortcuts

### GitHub Copilot
- **Tab:** Accept suggestion
- **Esc:** Dismiss suggestion
- **Alt + ]:** Next suggestion
- **Cmd/Ctrl + I:** Open Copilot Chat

### Cursor
- **Cmd/Ctrl + K:** Generate code
- **Cmd/Ctrl + L:** Open AI chat
- **Cmd/Ctrl + I:** Edit selected code

## Common Patterns

### Pattern 1: CRUD Operations
\`\`\`python
# Comment: Create CRUD operations for User model
# AI generates: create_user, read_user, update_user, delete_user
\`\`\`

### Pattern 2: API Endpoints
\`\`\`python
# Comment: FastAPI endpoint to get user by ID with error handling
# AI generates complete endpoint
\`\`\`

## Best Practices

1. **Be Specific:** Detailed comments = better code
2. **Review Always:** Check AI-generated code
3. **Iterate:** Refine and improve
4. **Learn:** Understand what AI generates

Optimize your workflow and code 10x faster! 🚀`,
                objectives: `- Optimize AI coding workflow
- Use keyboard shortcuts effectively
- Apply common coding patterns
- Implement best practices for AI-assisted coding`,
                videoUrl: 'https://example.com/video-workflow-optimization.mp4',
                videoDuration: 1500,
                published: true,
                isFree: false,
              },
            ],
          },
        },
      }),

      // Module 2: Prompt Engineering for Code (5 lessons)
      prisma.module.create({
        data: {
          courseId: codingCourse.id,
          order: 2,
          title: 'Module 2: Prompt Engineering for Code Generation',
          description: 'Master the art of writing perfect prompts to get AI to generate exactly the code you need.',
          duration: 1500,
          lessons: {
            create: [
              {
                order: 1,
                title: 'The Art of Prompting for Code',
                description: 'Learn fundamental principles of writing effective prompts that generate high-quality, production-ready code.',
                content: `# The Art of Prompting for Code

## Why Prompting Matters

The difference between a good prompt and a great prompt:
- **Good prompt:** Gets you code that works
- **Great prompt:** Gets you production-ready, optimized, well-documented code

## Fundamental Principles

### 1. Be Specific and Detailed

**Bad Prompt:**
\`\`\`
Write a function to process users
\`\`\`

**Good Prompt:**
\`\`\`
Write a Python function called process_users that:
- Takes a list of user dictionaries as input
- Each user has: id (int), name (str), email (str), active (bool)
- Filters out inactive users
- Validates email format using regex
- Returns a list of processed user dictionaries with added 'processed_at' timestamp
- Handles edge cases: empty list, invalid emails, missing fields
- Includes type hints and docstring
\`\`\`

### 2. Provide Context

Include:
- Language and framework
- Existing code patterns
- Related files
- Project structure

### 3. Show Examples

\`\`\`
Write a function to format dates. Examples:
- Input: "2024-01-15" -> Output: "January 15, 2024"
- Input: "2023-12-25" -> Output: "December 25, 2023"
\`\`\`

### 4. Specify Requirements

Always include:
- Language and framework
- Input/output format
- Error handling
- Performance considerations
- Code style preferences

Master these principles to get perfect code every time! 🚀`,
                objectives: `- Understand fundamental principles of code prompting
- Write specific, detailed prompts
- Provide proper context
- Use examples effectively`,
                videoUrl: 'https://example.com/video-prompting-code.mp4',
                videoDuration: 1800,
                published: true,
                isFree: false,
              },
              {
                order: 2,
                title: 'Prompt Templates for Common Coding Tasks',
                description: 'Learn proven prompt templates for generating functions, classes, APIs, and more.',
                content: `# Prompt Templates for Common Coding Tasks

## Template 1: Function Generation

\`\`\`
Write a [language] function called [name] that:
- Takes [inputs] as parameters
- Does [specific actions]
- Returns [output format]
- Handles [edge cases]
- Uses [libraries/frameworks]
- Follows [coding standards]
- Includes [documentation/tests]
\`\`\`

## Template 2: API Endpoint

\`\`\`
Create a [framework] API endpoint:
- Path: [endpoint path]
- Method: [GET/POST/etc]
- Request: [request format]
- Response: [response format]
- Validates: [validation rules]
- Handles errors: [error handling]
- Returns: [status codes]
\`\`\`

## Template 3: Class Definition

\`\`\`
Create a [language] class called [ClassName] that:
- Has properties: [list properties]
- Has methods: [list methods]
- Inherits from: [parent class if any]
- Implements: [interfaces if any]
- Follows: [design patterns]
\`\`\`

## Template 4: Database Model

\`\`\`
Create a [ORM] model for [entity] with:
- Fields: [list fields with types]
- Relationships: [list relationships]
- Validations: [validation rules]
- Indexes: [index fields]
\`\`\`

## Real-World Examples

### Example 1: REST API Endpoint
\`\`\`
Create a FastAPI endpoint:
- POST /api/orders
- Accepts JSON: {user_id: int, items: List[dict], total: float}
- Validates user exists
- Validates items have required fields
- Creates order in database
- Returns 201 with order data
- Handles validation errors (400)
- Includes request logging
\`\`\`

### Example 2: Data Processing Function
\`\`\`
Write a Python function to process sales data:
- Reads CSV file from path
- Each row: date, product, quantity, price, region
- Filters rows where quantity > 0
- Groups by region and calculates total revenue
- Returns dictionary: {region: total_revenue}
- Handles missing data by skipping rows
- Uses pandas for efficiency
\`\`\`

Use these templates to get perfect code every time! 🚀`,
                objectives: `- Learn prompt templates for common tasks
- Use templates for function generation
- Create API endpoints with prompts
- Generate database models with AI`,
                videoUrl: 'https://example.com/video-prompt-templates.mp4',
                videoDuration: 1500,
                published: true,
                isFree: false,
              },
              {
                order: 3,
                title: 'Getting AI to Debug Your Code',
                description: 'Master techniques for using AI to find and fix bugs in your code.',
                content: `# Getting AI to Debug Your Code

## The Debugging Prompt Formula

Effective debugging prompts follow this structure:
1. **Context:** What were you trying to do?
2. **Error:** What went wrong?
3. **Code:** Relevant code snippets
4. **Expected:** What should happen?
5. **Actual:** What actually happens?

## Template

\`\`\`
I'm trying to [goal] but getting [error].

Here's my code:
[Code]

Expected behavior: [description]
Actual behavior: [description]

Environment: [language, framework, version]

Please:
1. Explain the error
2. Identify the root cause
3. Provide a fix
4. Suggest prevention strategies
\`\`\`

## Common Debugging Scenarios

### Scenario 1: Runtime Error

\`\`\`
"Debug this runtime error:

Error: TypeError: Cannot read property 'name' of undefined
Location: userService.js:42

Code:
function getUserProfile(userId) {
  const user = database.findUser(userId);
  return user.name;  // Error here
}

The userId exists in database, but user is undefined.
Fix with proper null checking."
\`\`\`

### Scenario 2: Logic Error

\`\`\`
"This function should calculate discount but returns wrong values:

function calculateDiscount(price, discountPercent) {
  return price * discountPercent;
}

Test case: calculateDiscount(100, 20) should return 80
But it returns: 2000

Find and fix the bug."
\`\`\`

### Scenario 3: Performance Issue

\`\`\`
"This code processes 1000 records but takes 30 seconds.
Expected: < 1 second

[Code]

Profile and optimize for performance."
\`\`\`

## Advanced Techniques

### Multi-Step Debugging

\`\`\`
"Debug this complex issue step by step:

Problem: User authentication fails randomly
Symptoms: Works 80% of time, fails 20%
Code: [Authentication code]

Analyze:
1. Identify potential race conditions
2. Check token expiration logic
3. Verify session handling
4. Test edge cases"
\`\`\`

## Best Practices

1. **Provide Full Context:** Don't just paste the error
2. **Include Test Cases:** Show what should work
3. **Share Environment:** Language, framework, versions
4. **Describe Steps:** How to reproduce the issue

Master AI debugging and fix bugs 10x faster! 🚀`,
                objectives: `- Write effective debugging prompts
- Debug runtime errors with AI
- Fix logic errors efficiently
- Analyze performance issues
- Use multi-step debugging techniques`,
                videoUrl: 'https://example.com/video-debugging-prompts.mp4',
                videoDuration: 1500,
                published: true,
                isFree: false,
              },
              {
                order: 4,
                title: 'Getting AI to Explain Complex Code',
                description: 'Use AI to understand legacy code, complex algorithms, and unfamiliar codebases.',
                content: `# Getting AI to Explain Complex Code

## Why Code Explanation Matters

Understanding code is often harder than writing it. AI can:
- Explain complex algorithms
- Document functions automatically
- Clarify legacy code
- Teach new team members

## Techniques

### 1. Function Explanation

\`\`\`
"Explain what this function does:

[Function code]

Include:
- Purpose
- Parameters
- Return value
- Algorithm used
- Time complexity"
\`\`\`

### 2. Codebase Overview

\`\`\`
"Explain this codebase structure:

[File tree or code snippets]

Describe:
- Architecture
- Main components
- Data flow
- Key patterns used"
\`\`\`

### 3. Algorithm Explanation

\`\`\`
"Explain this algorithm:

[Algorithm code]

Cover:
- How it works step by step
- Why it's efficient
- Use cases
- Edge cases"
\`\`\`

## Documentation Generation

### Auto-Generate Docstrings

\`\`\`
"Generate comprehensive docstring for this function:

def process_payment(amount, currency, user_id):
    # Implementation
    
Follow Google style docstring format."
\`\`\`

### API Documentation

\`\`\`
"Generate API documentation for this endpoint:

@app.post("/api/users")
async def create_user(user_data: UserCreate):
    # Implementation
    
Include:
- Endpoint description
- Request format
- Response format
- Error codes
- Example requests"
\`\`\`

## Best Practices

1. **Be Specific:** Ask for what you need
2. **Provide Context:** Include related code
3. **Specify Format:** Docstring style, etc.
4. **Request Examples:** Code examples help

Use AI to understand any codebase instantly! 🚀`,
                objectives: `- Explain complex code with AI
- Generate function documentation
- Create API documentation
- Understand codebases quickly
- Document legacy code`,
                videoUrl: 'https://example.com/video-code-explanation.mp4',
                videoDuration: 1200,
                published: true,
                isFree: false,
              },
              {
                order: 5,
                title: 'Advanced Prompting: Chain of Thought and Iteration',
                description: 'Learn advanced prompting techniques for complex coding tasks.',
                content: `# Advanced Prompting: Chain of Thought and Iteration

## Chain of Thought Prompting

Break complex tasks into steps:

\`\`\`
To implement user authentication, I need to:
1. Create a User model with email and hashed password
2. Create registration endpoint that validates input
3. Hash password with bcrypt
4. Save to database
5. Generate JWT token
6. Return token to user

Implement this step by step with explanations.
\`\`\`

## Role-Playing

\`\`\`
"You are a senior Python developer specializing in FastAPI.
Write production-ready code for [feature] following best practices."
\`\`\`

## Iterative Refinement

### Step 1: Basic Implementation
\`\`\`
"Write a basic function to [task]"
\`\`\`

### Step 2: Add Error Handling
\`\`\`
"Now improve it by adding error handling"
\`\`\`

### Step 3: Optimize Performance
\`\`\`
"Optimize this for performance"
\`\`\`

### Step 4: Add Documentation
\`\`\`
"Add comprehensive documentation"
\`\`\`

## Multi-Step Tasks

\`\`\`
"Create a complete feature:
1. Design the database schema
2. Create the models
3. Write the API endpoints
4. Add validation
5. Write tests
6. Add documentation

Do this step by step, explaining each part."
\`\`\`

## Best Practices

1. **Break Down Complex Tasks:** Divide into smaller steps
2. **Iterate:** Refine code in multiple passes
3. **Use Roles:** Specify expertise level
4. **Provide Feedback:** Tell AI what to improve

Master advanced prompting for complex coding tasks! 🚀`,
                objectives: `- Use chain of thought prompting
- Apply role-playing techniques
- Iterate and refine code
- Break down complex tasks
- Master advanced prompting strategies`,
                videoUrl: 'https://example.com/video-advanced-prompting.mp4',
                videoDuration: 1800,
                published: true,
                isFree: false,
              },
            ],
          },
        },
      }),

      // Module 3: Building with AI (5 lessons)
      prisma.module.create({
        data: {
          courseId: codingCourse.id,
          order: 3,
          title: 'Module 3: Building AI-Powered Applications',
          description: 'Learn to build complete applications using AI APIs and integrate AI into your projects.',
          duration: 1800,
          lessons: {
            create: [
              {
                order: 1,
                title: 'Integrating OpenAI API into Your Projects',
                description: 'Master integrating OpenAI API for text generation, chat, and more in your applications.',
                content: `# Integrating OpenAI API

## Setup

\`\`\`bash
pip install openai
\`\`\`

\`\`\`python
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
\`\`\`

## Basic Text Generation

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
\`\`\`

## Building a Chat Application

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
client = OpenAI()

class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []

@app.post("/chat")
async def chat(request: ChatRequest):
    messages = [
        {"role": "system", "content": "You are a helpful assistant."}
    ]
    messages.extend(request.conversation_history)
    messages.append({"role": "user", "content": request.message})
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )
    
    return {"response": response.choices[0].message.content}
\`\`\`

## Error Handling

\`\`\`python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def call_openai(prompt):
    try:
        return client.chat.completions.create(...)
    except Exception as e:
        print(f"Error: {e}, retrying...")
        raise
\`\`\`

Build powerful AI applications with OpenAI! 🚀`,
                objectives: `- Integrate OpenAI API
- Build chat applications
- Handle errors and rate limits
- Implement retry logic`,
                videoUrl: 'https://example.com/video-openai-api.mp4',
                videoDuration: 2400,
                published: true,
                isFree: false,
              },
              {
                order: 2,
                title: 'Building AI Chatbots and Conversational Interfaces',
                description: 'Create production-ready chatbots using AI APIs with context management and memory.',
                content: `# Building AI Chatbots

## Chatbot Architecture

Modern AI chatbots need:
- Context management
- Conversation memory
- Multi-turn dialogues
- Error handling

## Basic Chatbot

\`\`\`python
class Chatbot:
    def __init__(self):
        self.client = OpenAI()
        self.conversation_history = []
    
    def chat(self, user_message: str) -> str:
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                *self.conversation_history
            ]
        )
        
        ai_message = response.choices[0].message.content
        self.conversation_history.append({
            "role": "assistant",
            "content": ai_message
        })
        
        return ai_message
\`\`\`

## Advanced Features

### Context Management
- Keep conversation history manageable
- Add system context
- Manage token limits

### Function Calling
- Let AI call your functions
- Integrate with external APIs
- Create interactive experiences

Build production-ready chatbots! 🚀`,
                objectives: `- Build basic AI chatbots
- Implement conversation memory
- Add context management
- Use function calling`,
                videoUrl: 'https://example.com/video-chatbots.mp4',
                videoDuration: 2400,
                published: true,
                isFree: false,
              },
              {
                order: 3,
                title: 'Using AI for Code Review and Quality Assurance',
                description: 'Use AI to review code, suggest improvements, and ensure best practices.',
                content: `# AI for Code Review

## Automated Code Review

AI can review code faster and more consistently, catching:
- Security vulnerabilities
- Performance issues
- Code smells
- Best practice violations
- Potential bugs

## Techniques

### Security Review

\`\`\`
"Review this code for security vulnerabilities:
[Code]

Check for:
- SQL injection
- XSS vulnerabilities
- Authentication bypass
- Data exposure"
\`\`\`

### Performance Review

\`\`\`
"Review this code for performance issues:
[Code]

Identify:
- N+1 queries
- Inefficient algorithms
- Memory leaks
- Unnecessary computations"
\`\`\`

### Code Quality Review

\`\`\`
"Review this code for quality:
[Code]

Check:
- Code style consistency
- Naming conventions
- Function complexity
- Documentation"
\`\`\`

## Workflow

1. Write code
2. AI reviews for issues
3. Fix identified problems
4. Human review for logic
5. Deploy

This workflow catches 90% of issues before human review! 🚀`,
                objectives: `- Use AI for security code review
- Review code for performance issues
- Ensure code quality with AI
- Automate code review workflows`,
                videoUrl: 'https://example.com/video-ai-code-review.mp4',
                videoDuration: 1500,
                published: true,
                isFree: false,
              },
              {
                order: 4,
                title: 'Building AI-Powered SaaS Products',
                description: 'Learn to build complete SaaS products with AI features - from MVP to production.',
                content: `# Building AI-Powered SaaS Products

## AI SaaS Product Ideas

1. **Content Generation Tools:** Writing assistants, blog generators
2. **Code Generation Tools:** AI coding assistants, test generators
3. **Data Analysis Tools:** AI-powered analytics, insights
4. **Automation Tools:** Workflow automation, task automation

## Architecture

### Tech Stack
- Frontend: Next.js / React
- Backend: FastAPI / Node.js
- Database: PostgreSQL
- AI: OpenAI / Anthropic APIs
- Payments: Stripe

## Example: AI Writing Assistant SaaS

### Backend API

\`\`\`python
@app.post("/api/write")
async def generate_content(request: WritingRequest, user: User):
    # Check subscription
    if not user.has_active_subscription():
        raise HTTPException(403, "Subscription required")
    
    # Generate content
    response = client.chat.completions.create(...)
    content = response.choices[0].message.content
    
    # Save and track usage
    save_generation(user.id, content)
    increment_usage(user.id)
    
    return {"content": content}
\`\`\`

## Monetization

### Pricing Models
- Freemium: Free tier + paid plans
- Usage-Based: Pay per API call
- Subscription: Monthly/yearly plans

Build and monetize AI SaaS products! 🚀`,
                objectives: `- Design AI SaaS architecture
- Build AI-powered features
- Implement monetization
- Handle usage limits
- Deploy SaaS products`,
                videoUrl: 'https://example.com/video-ai-saas.mp4',
                videoDuration: 3000,
                published: true,
                isFree: false,
              },
              {
                order: 5,
                title: 'Creating AI Agents for Development',
                description: 'Build autonomous AI agents that can write, test, and deploy code automatically.',
                content: `# Creating AI Agents for Development

## What are AI Agents?

AI agents are autonomous systems that can:
- Understand tasks
- Break them into steps
- Execute actions
- Learn from results
- Complete complex workflows

## Basic Agent Structure

\`\`\`python
class DevelopmentAgent:
    def __init__(self, llm_client):
        self.llm = llm_client
        self.memory = []
        self.tools = []
    
    def plan(self, task):
        # Break task into steps
        pass
    
    def execute(self, step):
        # Execute a step
        pass
    
    def learn(self, result):
        # Update memory with results
        pass
\`\`\`

## Building a Code Generation Agent

\`\`\`python
class CodeAgent:
    def generate_code(self, requirement):
        prompt = f"Requirement: {requirement}\\nGenerate complete code."
        response = self.llm.generate(prompt)
        return response
    
    def test_code(self, code):
        # Write code to file
        # Run tests
        # Return results
        pass
    
    def fix_errors(self, code, errors):
        # Get fixed code from LLM
        pass
    
    def complete_task(self, requirement):
        code = self.generate_code(requirement)
        errors = self.test_code(code)
        while errors:
            code = self.fix_errors(code, errors)
            errors = self.test_code(code)
        return code
\`\`\`

## Best Practices

1. **Start Simple:** Build basic agents first
2. **Add Tools Gradually:** Expand capabilities over time
3. **Monitor Performance:** Track success rates
4. **Human Oversight:** Review agent outputs

AI agents are the future of development! 🚀`,
                objectives: `- Understand AI agent architecture
- Build basic code generation agents
- Create multi-step development agents
- Implement best practices for AI agents`,
                videoUrl: 'https://example.com/video-ai-agents.mp4',
                videoDuration: 2400,
                published: true,
                isFree: false,
              },
            ],
          },
        },
      }),
    ])

    // Count lessons from created modules
    let totalLessons = 0
    for (const module of codingModules) {
      const moduleWithLessons = await prisma.module.findUnique({
        where: { id: module.id },
        include: { lessons: true }
      })
      totalLessons += moduleWithLessons?.lessons?.length || 0
    }
    console.log(`✅ Created AI for Coding with ${codingModules.length} modules and ${totalLessons} lessons`)

    return NextResponse.json({
      success: true,
      message: 'Courses fixed successfully',
      aiForBusiness: {
        title: businessCourse.title,
        modules: 1,
        lessons: chunk1WithLessons?.lessons?.length || 0,
      },
      aiForCoding: {
        title: codingCourse.title,
        modules: codingModules.length,
        lessons: totalLessons,
      },
    })
  } catch (error: any) {
    console.error('❌ Error fixing courses:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fix courses',
        details: error.stack,
      },
      { status: 500 }
    )
  }
}



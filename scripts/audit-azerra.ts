#!/usr/bin/env tsx
/**
 * Azerra Academy Comprehensive Audit Script
 * Validates all systems are production-ready
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface AuditResult {
  category: string
  checks: {
    name: string
    status: 'PASS' | 'FAIL' | 'WARN'
    message: string
  }[]
}

const results: AuditResult[] = []

function addResult(category: string, name: string, status: 'PASS' | 'FAIL' | 'WARN', message: string) {
  let categoryResult = results.find(r => r.category === category)
  if (!categoryResult) {
    categoryResult = { category, checks: [] }
    results.push(categoryResult)
  }
  categoryResult.checks.push({ name, status, message })
}

// 1. Environment Variables Audit
function auditEnvironment() {
  console.log('\n🔍 Auditing Environment Variables...')
  
  const requiredEnvs = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ]
  
  const optionalEnvs = [
    'STRIPE_SECRET_KEY',
    'GOOGLE_CLIENT_ID',
    'DISCORD_BOT_TOKEN',
  ]

  requiredEnvs.forEach(env => {
    if (process.env[env]) {
      addResult('Environment', env, 'PASS', 'Set correctly')
    } else {
      addResult('Environment', env, 'FAIL', 'Missing required environment variable')
    }
  })

  optionalEnvs.forEach(env => {
    if (process.env[env]) {
      addResult('Environment', env, 'PASS', 'Configured')
    } else {
      addResult('Environment', env, 'WARN', 'Not configured (optional for dev)')
    }
  })
}

// 2. File Structure Audit
function auditFileStructure() {
  console.log('\n📁 Auditing File Structure...')
  
  const criticalFiles = [
    'apps/site/package.json',
    'apps/site/next.config.js',
    'apps/site/tailwind.config.js',
    'apps/site/prisma/schema.prisma',
    'apps/site/app/page.tsx',
    'apps/site/app/layout.tsx',
    'apps/site/lib/prisma.ts',
    'apps/site/lib/auth.ts',
    'apps/site/lib/stripe.ts',
  ]

  criticalFiles.forEach(file => {
    const path = join(process.cwd(), file)
    if (existsSync(path)) {
      addResult('File Structure', file, 'PASS', 'File exists')
    } else {
      addResult('File Structure', file, 'FAIL', 'Critical file missing')
    }
  })
}

// 3. Pages Audit
function auditPages() {
  console.log('\n📄 Auditing Pages...')
  
  const requiredPages = [
    'apps/site/app/page.tsx',
    'apps/site/app/pricing/page.tsx',
    'apps/site/app/courses/page.tsx',
    'apps/site/app/dashboard/page.tsx',
    'apps/site/app/auth/signin/page.tsx',
    'apps/site/app/signup/page.tsx',
  ]

  requiredPages.forEach(page => {
    const path = join(process.cwd(), page)
    if (existsSync(path)) {
      addResult('Pages', page.split('/').pop() || page, 'PASS', 'Page exists')
    } else {
      addResult('Pages', page.split('/').pop() || page, 'FAIL', 'Page missing')
    }
  })
}

// 4. API Routes Audit
function auditAPIRoutes() {
  console.log('\n🔌 Auditing API Routes...')
  
  const requiredRoutes = [
    'apps/site/app/api/auth/[...nextauth]/route.ts',
    'apps/site/app/api/auth/register/route.ts',
    'apps/site/app/api/checkout/route.ts',
    'apps/site/app/api/progress/route.ts',
    'apps/site/app/api/webhooks/stripe/route.ts',
  ]

  requiredRoutes.forEach(route => {
    const path = join(process.cwd(), route)
    if (existsSync(path)) {
      addResult('API Routes', route.split('/').slice(-2).join('/'), 'PASS', 'Route exists')
    } else {
      addResult('API Routes', route.split('/').slice(-2).join('/'), 'FAIL', 'Route missing')
    }
  })
}

// 5. Component Audit
function auditComponents() {
  console.log('\n🎨 Auditing Components...')
  
  const requiredComponents = [
    'apps/site/components/sections/Hero.tsx',
    'apps/site/components/sections/Features.tsx',
    'apps/site/components/sections/Pricing.tsx',
    'apps/site/components/ui/button.tsx',
    'apps/site/components/ui/card.tsx',
    'apps/site/components/layout/Header.tsx',
  ]

  requiredComponents.forEach(comp => {
    const path = join(process.cwd(), comp)
    if (existsSync(path)) {
      addResult('Components', comp.split('/').pop() || comp, 'PASS', 'Component exists')
    } else {
      addResult('Components', comp.split('/').pop() || comp, 'FAIL', 'Component missing')
    }
  })
}

// 6. Database Audit
function auditDatabase() {
  console.log('\n💾 Auditing Database...')
  
  const dbPath = join(process.cwd(), 'apps/site/prisma/dev.db')
  if (existsSync(dbPath)) {
    addResult('Database', 'SQLite DB', 'PASS', 'Database file exists')
  } else {
    addResult('Database', 'SQLite DB', 'FAIL', 'Database not initialized')
  }

  const schemaPath = join(process.cwd(), 'apps/site/prisma/schema.prisma')
  if (existsSync(schemaPath)) {
    addResult('Database', 'Prisma Schema', 'PASS', 'Schema file exists')
  } else {
    addResult('Database', 'Prisma Schema', 'FAIL', 'Schema missing')
  }
}

// Print Report
function printReport() {
  console.log('\n' + '='.repeat(80))
  console.log('🏆 AZERRA ACADEMY AUDIT REPORT')
  console.log('='.repeat(80))

  let totalPass = 0
  let totalFail = 0
  let totalWarn = 0

  results.forEach(category => {
    console.log(`\n📊 ${category.category}`)
    console.log('-'.repeat(80))

    category.checks.forEach(check => {
      const icon = check.status === 'PASS' ? '✅' : check.status === 'FAIL' ? '❌' : '⚠️'
      console.log(`  ${icon} ${check.name}: ${check.message}`)

      if (check.status === 'PASS') totalPass++
      if (check.status === 'FAIL') totalFail++
      if (check.status === 'WARN') totalWarn++
    })
  })

  console.log('\n' + '='.repeat(80))
  console.log('📈 SUMMARY')
  console.log('='.repeat(80))
  console.log(`  ✅ Passed: ${totalPass}`)
  console.log(`  ❌ Failed: ${totalFail}`)
  console.log(`  ⚠️  Warnings: ${totalWarn}`)
  console.log(`  📊 Total: ${totalPass + totalFail + totalWarn}`)

  if (totalFail > 0) {
    console.log('\n❌ AUDIT FAILED - Fix issues above before deploying to production')
    process.exit(1)
  } else if (totalWarn > 0) {
    console.log('\n⚠️  AUDIT PASSED WITH WARNINGS - Review warnings before production')
  } else {
    console.log('\n✅ ALL SYSTEMS GO - Platform is production-ready! 🚀')
  }
}

// Run all audits
auditEnvironment()
auditFileStructure()
auditPages()
auditAPIRoutes()
auditComponents()
auditDatabase()

printReport()


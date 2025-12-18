# 🚀 Deployment Guide

## Overview

Complete deployment guide for Azerra AI School platform across multiple services.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Stack                     │
├─────────────────────────────────────────────────────────┤
│ Frontend & API: Vercel (apps/site)                      │
│ Database: Neon/Railway (PostgreSQL)                     │
│ Cache/Queue: Upstash (Redis)                            │
│ Discord Bot: Fly.io/Render (apps/discord-bot)           │
│ Storage: Cloudflare R2 (S3-compatible)                  │
│ CDN: Cloudflare                                         │
│ Email: Postmark/SendGrid                                │
│ Monitoring: Sentry + OpenTelemetry                      │
│ Payments: Stripe                                        │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 20+ installed
- pnpm 8+ installed
- Vercel CLI installed: `npm i -g vercel`
- Fly.io CLI installed (for bot): `curl -L https://fly.io/install.sh | sh`
- Git repository

## 1. Vercel Deployment (Website)

### Initial Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project (run in apps/site)
cd apps/site
vercel link

# Follow prompts:
# - Set up and deploy: Y
# - Scope: [your-team]
# - Link to existing project: N
# - Project name: azerra-ai-school
# - Directory: ./apps/site
```

### Environment Variables

```bash
# Add all environment variables to Vercel
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add STRIPE_SECRET_KEY production
# ... (see env.example for complete list)

# Or use Vercel dashboard:
# https://vercel.com/[team]/azerra-ai-school/settings/environment-variables
```

### Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Via Git (recommended)
git push origin main
# Vercel auto-deploys on push to main
```

### Custom Domain

```bash
# Add domain in Vercel dashboard or CLI
vercel domains add azerra.ai
vercel domains add www.azerra.ai

# Update DNS:
# A record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com

# SSL is automatic (Let's Encrypt)
```

## 2. Database Deployment (Neon/Railway)

### Option A: Neon (Recommended)

```bash
# 1. Create Neon account: https://neon.tech
# 2. Create project: "azerra-ai-school"
# 3. Copy connection string

# Connection string format:
postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require

# 4. Add to Vercel:
vercel env add DATABASE_URL production
# Paste Neon connection string

vercel env add DIRECT_URL production
# Paste Neon connection string (non-pooled)

# 5. Run migrations
pnpm --filter site prisma migrate deploy
```

### Option B: Railway

```bash
# 1. Create Railway account: https://railway.app
# 2. New project → PostgreSQL
# 3. Copy DATABASE_URL from variables tab
# 4. Add to Vercel environment variables
# 5. Run migrations
```

### Database Configuration

```sql
-- Recommended settings (run as admin)
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Connection pooling (if not using Prisma Accelerate)
-- Use pgBouncer or Neon's built-in pooling
```

## 3. Redis Deployment (Upstash)

```bash
# 1. Create Upstash account: https://upstash.com
# 2. Create Redis database
# 3. Region: Choose closest to Vercel region
# 4. Copy REDIS_URL

# 5. Add to Vercel:
vercel env add REDIS_URL production
# Paste: redis://default:[password]@[endpoint]:6379

# 6. Configure eviction:
# - Eviction policy: allkeys-lru
# - Max memory: 256MB+
```

## 4. Discord Bot Deployment (Fly.io)

### Setup Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Navigate to bot directory
cd apps/discord-bot

# Launch app
fly launch
# - App name: azerra-discord-bot
# - Region: Choose closest to your users
# - PostgreSQL: N (using shared DB)
# - Redis: N (using shared Redis)

# Set secrets
fly secrets set DISCORD_BOT_TOKEN="your-token"
fly secrets set DISCORD_CLIENT_ID="your-client-id"
fly secrets set DISCORD_GUILD_ID="your-guild-id"
fly secrets set SITE_URL="https://azerra.ai"
fly secrets set WEBHOOK_SECRET="your-webhook-secret"
fly secrets set DATABASE_URL="your-database-url"
fly secrets set REDIS_URL="your-redis-url"
fly secrets set SENTRY_DSN="your-sentry-dsn"

# Deploy
fly deploy

# Check status
fly status
fly logs

# Scale (if needed)
fly scale count 1
fly scale memory 512
```

### Alternative: Render

```bash
# 1. Create Render account: https://render.com
# 2. New → Web Service
# 3. Connect GitHub repository
# 4. Settings:
#    - Name: azerra-discord-bot
#    - Environment: Docker
#    - Docker Context: /apps/discord-bot
#    - Docker Command: (auto-detected)
#    - Instance Type: Starter ($7/mo)
# 5. Add environment variables (same as Fly.io)
# 6. Deploy
```

### Register Slash Commands

```bash
# After bot is deployed
fly ssh console -a azerra-discord-bot

# Inside container:
node dist/scripts/register-commands.js

# Or locally:
pnpm --filter discord-bot register
```

## 5. Storage (Cloudflare R2)

```bash
# 1. Cloudflare account: https://cloudflare.com
# 2. R2 → Create bucket: "azerra-uploads"
# 3. Generate API token
# 4. Add to Vercel:
vercel env add S3_ACCESS_KEY_ID production
vercel env add S3_SECRET_ACCESS_KEY production
vercel env add S3_BUCKET production
vercel env add S3_ENDPOINT production
# Endpoint: https://[account-id].r2.cloudflarestorage.com

# 5. Configure CORS:
# In R2 bucket settings → CORS policy:
[
  {
    "AllowedOrigins": ["https://azerra.ai"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## 6. Monitoring & Observability

### Sentry Setup

```bash
# 1. Create Sentry organization: https://sentry.io
# 2. Create project: "azerra-ai-site"
# 3. Get DSN
# 4. Add to Vercel:
vercel env add SENTRY_DSN production
vercel env add SENTRY_ORG production
vercel env add SENTRY_PROJECT production
vercel env add SENTRY_AUTH_TOKEN production

# 5. Create another project for Discord bot
# 6. Configure alerts in Sentry dashboard

# Alert rules to create:
# - Error rate > 10 errors/min
# - Webhook failure > 5%
# - Discord bot offline
# - Payment processing errors
```

### OpenTelemetry (Optional)

```bash
# If using managed OTLP backend (Honeycomb, New Relic):
vercel env add OTEL_EXPORTER_OTLP_ENDPOINT production
# Example: https://api.honeycomb.io:443
```

## 7. Email Service (Postmark)

```bash
# 1. Create Postmark account: https://postmarkapp.com
# 2. Create server: "Azerra AI School"
# 3. Get API token
# 4. Add sender signature: noreply@azerra.ai
# 5. Verify domain (DNS records)
# 6. Add to Vercel:
vercel env add POSTMARK_API_KEY production

# 7. Create email templates in Postmark:
# - enrollment-welcome
# - payment-confirmation
# - refund-confirmation
# - assignment-graded
# - certificate-issued
# - password-reset
```

## 8. Analytics (Google Analytics 4)

```bash
# 1. Google Analytics account: https://analytics.google.com
# 2. Create GA4 property: "Azerra AI School"
# 3. Create data stream (Web)
# 4. Copy Measurement ID (G-XXXXXXXXXX)
# 5. Add to Vercel:
vercel env add NEXT_PUBLIC_GA4_ID production

# 6. Configure events in GA4:
# - sign_up
# - purchase
# - begin_checkout
# - enrollment
# - lesson_complete
# - quiz_pass
# - assignment_submit
# - certificate_earn
```

## 9. CI/CD Setup

### GitHub Secrets

```bash
# Add secrets to GitHub repository:
# Settings → Secrets and variables → Actions → New repository secret

Required secrets:
- VERCEL_TOKEN (from Vercel account settings)
- VERCEL_ORG_ID (from Vercel project settings)
- VERCEL_PROJECT_ID (from Vercel project settings)
- STRIPE_TEST_SECRET_KEY (for CI tests)
- NEXTAUTH_SECRET (same as production)
- SENTRY_AUTH_TOKEN (for source map upload)
- SLACK_WEBHOOK (optional, for notifications)
```

### Branch Protection

```bash
# Enable in GitHub:
# Settings → Branches → Add rule

Branch name pattern: main

Require:
✓ Pull request reviews (1+)
✓ Status checks to pass:
  - Typecheck
  - Lint
  - Unit Tests
  - Integration Tests
  - E2E Tests
  - Build
✓ Conversations resolved
✓ Signed commits (optional)
✓ Linear history
```

## 10. DNS & SSL

### DNS Configuration

```bash
# Configure at your domain registrar:

# A Record (Apex)
Type: A
Name: @
Value: 76.76.21.21 (Vercel)
TTL: 3600

# CNAME (www)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

# MX Records (Email)
Type: MX
Name: @
Value: [your-email-provider-mx-records]
Priority: 10

# TXT Records (Verification)
Type: TXT
Name: @
Value: [Vercel verification]
Value: [Google Site Verification]
Value: [SPF record for email]

# DKIM (Email authentication)
Type: CNAME
Name: [postmark-dkim-selector]
Value: [postmark-dkim-value]
```

### SSL/TLS

- ✅ Automatic with Vercel (Let's Encrypt)
- ✅ Auto-renewal every 90 days
- ✅ HTTPS redirect enabled by default
- ✅ HSTS header configured (see next.config.js)

## 11. Backup & Disaster Recovery

### Database Backups

```bash
# Automated backups (configure in provider):
# - Daily backups
# - 30-day retention
# - Point-in-time recovery (if available)

# Manual backup:
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Test restore:
psql $DATABASE_URL < backup-20250930.sql
```

### Redis Backups

```bash
# Upstash: Automatic daily backups
# Manual snapshot via dashboard if needed
```

### Code Backups

```bash
# Git repository is source of truth
# Ensure:
- Multiple team members have access
- Regular commits
- Tagged releases
```

## 12. Scaling Considerations

### Vercel

```bash
# Pro plan includes:
# - Unlimited bandwidth
# - 100GB-hours compute
# - Analytics
# - Log drains
# - Password protection
# - Preview deployments

# Upgrade if needed:
vercel upgrade
```

### Database

```bash
# Neon scaling:
# - Auto-scaling compute
# - Scale storage as needed
# - Read replicas (for heavy load)

# Monitor:
# - Connection count
# - Query performance
# - Storage usage
```

### Redis

```bash
# Upstash scaling:
# - Upgrade plan for more memory
# - Regional replication
# - Multi-region for global apps
```

### Discord Bot

```bash
# Fly.io scaling:
fly scale count 2  # Multiple instances
fly scale memory 1024  # More RAM

# Render scaling:
# Upgrade instance type in dashboard
```

## 13. Monitoring & Alerts

### Uptime Monitoring

```bash
# UptimeRobot (free tier):
1. Create monitor: https://azerra.ai
2. Create monitor: https://azerra.ai/api/health/readiness
3. Create monitor: [bot-url]/heartbeat
4. Alert contacts: email, SMS, Slack
5. Check interval: 5 minutes
```

### Error Budget

```bash
# SLO: 99.9% uptime
# Error budget: 43.2 minutes/month downtime

# If exceeded:
1. Incident review meeting
2. Root cause analysis
3. Prevention measures
4. Update runbook
```

## 14. Security Hardening

### Secrets Rotation

```bash
# Rotate every 90 days:
# - NEXTAUTH_SECRET
# - COOKIE_SECRET
# - WEBHOOK_SECRET
# - API keys (Stripe, Postmark, etc.)

# Procedure:
1. Generate new secret
2. Add to Vercel with different key
3. Deploy with both old and new
4. Update code to use new
5. Deploy again
6. Remove old secret
```

### Security Scan

```bash
# Before launch:
npm audit
pnpm audit

# Fix all critical and high vulnerabilities
npm audit fix
```

## 15. Performance Optimization

### CDN Configuration

```bash
# Cloudflare (recommended):
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Enable "Full (strict)" SSL
4. Enable "Auto Minify" (JS, CSS, HTML)
5. Enable "Brotli" compression
6. Cache rules:
   - Static assets: 1 year
   - API routes: No cache
   - Pages: 1 hour (with stale-while-revalidate)
```

### Image Optimization

```bash
# Next.js handles this automatically
# Ensure images use next/image component
# Configure domains in next.config.js
```

### Database Optimization

```bash
# Add indexes for common queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_enrollment_user ON enrollments(user_id, status);
CREATE INDEX idx_payment_session ON payments(stripe_session_id);
CREATE INDEX idx_audit_user_created ON audit_logs(user_id, created_at DESC);

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

## 16. Post-Deployment Verification

### Smoke Tests

```bash
# 1. Homepage loads
curl -I https://azerra.ai
# Expect: 200 OK

# 2. Health check
curl https://azerra.ai/api/health/readiness
# Expect: {"status":"healthy",...}

# 3. Bot health
curl https://[bot-url]/health
# Expect: {"status":"healthy",...}

# 4. Security headers
curl -I https://azerra.ai | grep -E "(Strict-Transport|Content-Security|X-Frame)"
# Expect: All security headers present
```

### Sentry Test

```bash
# Trigger test error
curl https://azerra.ai/api/test/sentry

# Verify in Sentry dashboard:
# - Error appears within 60 seconds
# - Source maps loaded correctly
# - Stack trace is readable
# - User context included
```

## 17. Rollback Procedures

### Quick Rollback (Vercel)

```bash
# Via CLI
vercel rollback

# Via Dashboard
# 1. Go to Deployments
# 2. Find last stable deployment
# 3. Click "..." → "Promote to Production"

# Rollback is instant (< 60 seconds)
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d $DATABASE_URL backup-20250930.sql

# Or point-in-time recovery (Neon)
# Use Neon dashboard to restore to specific timestamp
```

## 18. Maintenance Windows

### Planned Downtime

```bash
# For database migrations:
1. Post maintenance notice (24h advance)
2. Enable maintenance mode
3. Run migrations
4. Verify health checks
5. Disable maintenance mode
6. Monitor for 1 hour
```

### Emergency Maintenance

```bash
# For critical issues:
1. Rollback deployment
2. Post status update
3. Fix issue
4. Deploy to staging
5. Verify fix
6. Deploy to production
7. Monitor closely
```

## 19. Team Access

### Vercel Team Members

```bash
# Add team members:
vercel teams add [email]

# Roles:
# - Owner: Full access
# - Member: Deploy + env vars
# - Viewer: Read-only
```

### GitHub Access

```bash
# Repository access:
# - Admin: 2+ people
# - Maintainer: Core team
# - Write: Developers
# - Read: Contractors
```

## 20. Cost Estimation

### Monthly Costs (Estimated)

```
Vercel Pro: $20/user/month
Neon Pro: $19/month (compute + storage)
Upstash Pro: $10/month (256MB Redis)
Fly.io: $7/month (512MB bot instance)
Cloudflare R2: $0.015/GB storage + $0.36/million requests
Postmark: $15/month (50k emails)
Sentry: $26/month (50k events)
Stripe: 2.9% + $0.30 per transaction
Domain: $12/year

Total (excluding transaction fees): ~$120-150/month
At 100 students: ~$1.50/student/month infrastructure
```

## 21. Launch Day Procedure

### T-1 Week
- [ ] Complete staging tests
- [ ] Finalize content
- [ ] Train support team
- [ ] Prepare marketing materials

### T-1 Day
- [ ] Final staging test
- [ ] Database backup
- [ ] Team briefing
- [ ] Monitor channels ready

### T-4 Hours
- [ ] Switch to Stripe live mode
- [ ] Update environment variables
- [ ] Test live purchase
- [ ] Verify webhook delivery

### Launch (T=0)
- [ ] Deploy to production
- [ ] Verify all systems green
- [ ] Announce on Discord
- [ ] Send launch email
- [ ] Social media posts

### T+1 Hour
- [ ] Monitor Sentry (zero errors)
- [ ] Check health endpoints
- [ ] Verify first purchases
- [ ] Discord bot active

### T+24 Hours
- [ ] Review metrics
- [ ] Check customer feedback
- [ ] Verify email delivery
- [ ] Review error logs

## 22. Support Channels

### Monitoring
- Vercel Dashboard: Deployments, logs, analytics
- Sentry: Errors and performance
- Stripe Dashboard: Payments and refunds
- Uptime Monitor: Service availability

### Logs
```bash
# Vercel logs
vercel logs --follow

# Fly.io logs (bot)
fly logs

# Database logs
# Access via provider dashboard
```

### Team Communication
- Slack/Discord channel for incidents
- On-call rotation documented
- Escalation process clear
- Response time SLAs defined

---

## 🎯 QUICK DEPLOY COMMANDS

### Fresh Deployment

```bash
# 1. Build and test locally
pnpm install
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm -r build

# 2. Push to GitHub
git add .
git commit -m "feat: production ready"
git push origin main

# 3. Vercel auto-deploys
# 4. Deploy bot
fly deploy

# 5. Verify
curl https://azerra.ai/api/health/readiness
```

### Update Deployment

```bash
# Make changes
git add .
git commit -m "fix: bug description"
git push

# Auto-deploys via GitHub Actions
# Or manual: vercel --prod
```

---

**Last Updated:** September 30, 2025  
**Deployment Status:** Ready for Production  
**Next Steps:** Complete go-live checklist 🚀

## Overview

Complete deployment guide for Azerra AI School platform across multiple services.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Stack                      │
├─────────────────────────────────────────────────────────┤
│ Frontend & API: Vercel (apps/site)                      │
│ Database: Neon/Railway (PostgreSQL)                     │
│ Cache/Queue: Upstash (Redis)                            │
│ Discord Bot: Fly.io/Render (apps/discord-bot)           │
│ Storage: Cloudflare R2 (S3-compatible)                  │
│ CDN: Cloudflare                                          │
│ Email: Postmark/SendGrid                                 │
│ Monitoring: Sentry + OpenTelemetry                      │
│ Payments: Stripe                                         │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 20+ installed
- pnpm 8+ installed
- Vercel CLI installed: `npm i -g vercel`
- Fly.io CLI installed (for bot): `curl -L https://fly.io/install.sh | sh`
- Git repository

## 1. Vercel Deployment (Website)

### Initial Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project (run in apps/site)
cd apps/site
vercel link

# Follow prompts:
# - Set up and deploy: Y
# - Scope: [your-team]
# - Link to existing project: N
# - Project name: azerra-ai-school
# - Directory: ./apps/site
```

### Environment Variables

```bash
# Add all environment variables to Vercel
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add STRIPE_SECRET_KEY production
# ... (see env.example for complete list)

# Or use Vercel dashboard:
# https://vercel.com/[team]/azerra-ai-school/settings/environment-variables
```

### Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Via Git (recommended)
git push origin main
# Vercel auto-deploys on push to main
```

### Custom Domain

```bash
# Add domain in Vercel dashboard or CLI
vercel domains add azerra.ai
vercel domains add www.azerra.ai

# Update DNS:
# A record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com

# SSL is automatic (Let's Encrypt)
```

## 2. Database Deployment (Neon/Railway)

### Option A: Neon (Recommended)

```bash
# 1. Create Neon account: https://neon.tech
# 2. Create project: "azerra-ai-school"
# 3. Copy connection string

# Connection string format:
postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require

# 4. Add to Vercel:
vercel env add DATABASE_URL production
# Paste Neon connection string

vercel env add DIRECT_URL production
# Paste Neon connection string (non-pooled)

# 5. Run migrations
pnpm --filter site prisma migrate deploy
```

### Option B: Railway

```bash
# 1. Create Railway account: https://railway.app
# 2. New project → PostgreSQL
# 3. Copy DATABASE_URL from variables tab
# 4. Add to Vercel environment variables
# 5. Run migrations
```

### Database Configuration

```sql
-- Recommended settings (run as admin)
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Connection pooling (if not using Prisma Accelerate)
-- Use pgBouncer or Neon's built-in pooling
```

## 3. Redis Deployment (Upstash)

```bash
# 1. Create Upstash account: https://upstash.com
# 2. Create Redis database
# 3. Region: Choose closest to Vercel region
# 4. Copy REDIS_URL

# 5. Add to Vercel:
vercel env add REDIS_URL production
# Paste: redis://default:[password]@[endpoint]:6379

# 6. Configure eviction:
# - Eviction policy: allkeys-lru
# - Max memory: 256MB+
```

## 4. Discord Bot Deployment (Fly.io)

### Setup Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Navigate to bot directory
cd apps/discord-bot

# Launch app
fly launch
# - App name: azerra-discord-bot
# - Region: Choose closest to your users
# - PostgreSQL: N (using shared DB)
# - Redis: N (using shared Redis)

# Set secrets
fly secrets set DISCORD_BOT_TOKEN="your-token"
fly secrets set DISCORD_CLIENT_ID="your-client-id"
fly secrets set DISCORD_GUILD_ID="your-guild-id"
fly secrets set SITE_URL="https://azerra.ai"
fly secrets set WEBHOOK_SECRET="your-webhook-secret"
fly secrets set DATABASE_URL="your-database-url"
fly secrets set REDIS_URL="your-redis-url"
fly secrets set SENTRY_DSN="your-sentry-dsn"

# Deploy
fly deploy

# Check status
fly status
fly logs

# Scale (if needed)
fly scale count 1
fly scale memory 512
```

### Alternative: Render

```bash
# 1. Create Render account: https://render.com
# 2. New → Web Service
# 3. Connect GitHub repository
# 4. Settings:
#    - Name: azerra-discord-bot
#    - Environment: Docker
#    - Docker Context: /apps/discord-bot
#    - Docker Command: (auto-detected)
#    - Instance Type: Starter ($7/mo)
# 5. Add environment variables (same as Fly.io)
# 6. Deploy
```

### Register Slash Commands

```bash
# After bot is deployed
fly ssh console -a azerra-discord-bot

# Inside container:
node dist/scripts/register-commands.js

# Or locally:
pnpm --filter discord-bot register
```

## 5. Storage (Cloudflare R2)

```bash
# 1. Cloudflare account: https://cloudflare.com
# 2. R2 → Create bucket: "azerra-uploads"
# 3. Generate API token
# 4. Add to Vercel:
vercel env add S3_ACCESS_KEY_ID production
vercel env add S3_SECRET_ACCESS_KEY production
vercel env add S3_BUCKET production
vercel env add S3_ENDPOINT production
# Endpoint: https://[account-id].r2.cloudflarestorage.com

# 5. Configure CORS:
# In R2 bucket settings → CORS policy:
[
  {
    "AllowedOrigins": ["https://azerra.ai"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## 6. Monitoring & Observability

### Sentry Setup

```bash
# 1. Create Sentry organization: https://sentry.io
# 2. Create project: "azerra-ai-site"
# 3. Get DSN
# 4. Add to Vercel:
vercel env add SENTRY_DSN production
vercel env add SENTRY_ORG production
vercel env add SENTRY_PROJECT production
vercel env add SENTRY_AUTH_TOKEN production

# 5. Create another project for Discord bot
# 6. Configure alerts in Sentry dashboard

# Alert rules to create:
# - Error rate > 10 errors/min
# - Webhook failure > 5%
# - Discord bot offline
# - Payment processing errors
```

### OpenTelemetry (Optional)

```bash
# If using managed OTLP backend (Honeycomb, New Relic):
vercel env add OTEL_EXPORTER_OTLP_ENDPOINT production
# Example: https://api.honeycomb.io:443
```

## 7. Email Service (Postmark)

```bash
# 1. Create Postmark account: https://postmarkapp.com
# 2. Create server: "Azerra AI School"
# 3. Get API token
# 4. Add sender signature: noreply@azerra.ai
# 5. Verify domain (DNS records)
# 6. Add to Vercel:
vercel env add POSTMARK_API_KEY production

# 7. Create email templates in Postmark:
# - enrollment-welcome
# - payment-confirmation
# - refund-confirmation
# - assignment-graded
# - certificate-issued
# - password-reset
```

## 8. Analytics (Google Analytics 4)

```bash
# 1. Google Analytics account: https://analytics.google.com
# 2. Create GA4 property: "Azerra AI School"
# 3. Create data stream (Web)
# 4. Copy Measurement ID (G-XXXXXXXXXX)
# 5. Add to Vercel:
vercel env add NEXT_PUBLIC_GA4_ID production

# 6. Configure events in GA4:
# - sign_up
# - purchase
# - begin_checkout
# - enrollment
# - lesson_complete
# - quiz_pass
# - assignment_submit
# - certificate_earn
```

## 9. CI/CD Setup

### GitHub Secrets

```bash
# Add secrets to GitHub repository:
# Settings → Secrets and variables → Actions → New repository secret

Required secrets:
- VERCEL_TOKEN (from Vercel account settings)
- VERCEL_ORG_ID (from Vercel project settings)
- VERCEL_PROJECT_ID (from Vercel project settings)
- STRIPE_TEST_SECRET_KEY (for CI tests)
- NEXTAUTH_SECRET (same as production)
- SENTRY_AUTH_TOKEN (for source map upload)
- SLACK_WEBHOOK (optional, for notifications)
```

### Branch Protection

```bash
# Enable in GitHub:
# Settings → Branches → Add rule

Branch name pattern: main

Require:
✓ Pull request reviews (1+)
✓ Status checks to pass:
  - Typecheck
  - Lint
  - Unit Tests
  - Integration Tests
  - E2E Tests
  - Build
✓ Conversations resolved
✓ Signed commits (optional)
✓ Linear history
```

## 10. DNS & SSL

### DNS Configuration

```bash
# Configure at your domain registrar:

# A Record (Apex)
Type: A
Name: @
Value: 76.76.21.21 (Vercel)
TTL: 3600

# CNAME (www)
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

# MX Records (Email)
Type: MX
Name: @
Value: [your-email-provider-mx-records]
Priority: 10

# TXT Records (Verification)
Type: TXT
Name: @
Value: [Vercel verification]
Value: [Google Site Verification]
Value: [SPF record for email]

# DKIM (Email authentication)
Type: CNAME
Name: [postmark-dkim-selector]
Value: [postmark-dkim-value]
```

### SSL/TLS

- ✅ Automatic with Vercel (Let's Encrypt)
- ✅ Auto-renewal every 90 days
- ✅ HTTPS redirect enabled by default
- ✅ HSTS header configured (see next.config.js)

## 11. Backup & Disaster Recovery

### Database Backups

```bash
# Automated backups (configure in provider):
# - Daily backups
# - 30-day retention
# - Point-in-time recovery (if available)

# Manual backup:
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Test restore:
psql $DATABASE_URL < backup-20250930.sql
```

### Redis Backups

```bash
# Upstash: Automatic daily backups
# Manual snapshot via dashboard if needed
```

### Code Backups

```bash
# Git repository is source of truth
# Ensure:
- Multiple team members have access
- Regular commits
- Tagged releases
```

## 12. Scaling Considerations

### Vercel

```bash
# Pro plan includes:
# - Unlimited bandwidth
# - 100GB-hours compute
# - Analytics
# - Log drains
# - Password protection
# - Preview deployments

# Upgrade if needed:
vercel upgrade
```

### Database

```bash
# Neon scaling:
# - Auto-scaling compute
# - Scale storage as needed
# - Read replicas (for heavy load)

# Monitor:
# - Connection count
# - Query performance
# - Storage usage
```

### Redis

```bash
# Upstash scaling:
# - Upgrade plan for more memory
# - Regional replication
# - Multi-region for global apps
```

### Discord Bot

```bash
# Fly.io scaling:
fly scale count 2  # Multiple instances
fly scale memory 1024  # More RAM

# Render scaling:
# Upgrade instance type in dashboard
```

## 13. Monitoring & Alerts

### Uptime Monitoring

```bash
# UptimeRobot (free tier):
1. Create monitor: https://azerra.ai
2. Create monitor: https://azerra.ai/api/health/readiness
3. Create monitor: [bot-url]/heartbeat
4. Alert contacts: email, SMS, Slack
5. Check interval: 5 minutes
```

### Error Budget

```bash
# SLO: 99.9% uptime
# Error budget: 43.2 minutes/month downtime

# If exceeded:
1. Incident review meeting
2. Root cause analysis
3. Prevention measures
4. Update runbook
```

## 14. Security Hardening

### Secrets Rotation

```bash
# Rotate every 90 days:
# - NEXTAUTH_SECRET
# - COOKIE_SECRET
# - WEBHOOK_SECRET
# - API keys (Stripe, Postmark, etc.)

# Procedure:
1. Generate new secret
2. Add to Vercel with different key
3. Deploy with both old and new
4. Update code to use new
5. Deploy again
6. Remove old secret
```

### Security Scan

```bash
# Before launch:
npm audit
pnpm audit

# Fix all critical and high vulnerabilities
npm audit fix
```

## 15. Performance Optimization

### CDN Configuration

```bash
# Cloudflare (recommended):
1. Add site to Cloudflare
2. Update nameservers at registrar
3. Enable "Full (strict)" SSL
4. Enable "Auto Minify" (JS, CSS, HTML)
5. Enable "Brotli" compression
6. Cache rules:
   - Static assets: 1 year
   - API routes: No cache
   - Pages: 1 hour (with stale-while-revalidate)
```

### Image Optimization

```bash
# Next.js handles this automatically
# Ensure images use next/image component
# Configure domains in next.config.js
```

### Database Optimization

```bash
# Add indexes for common queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_enrollment_user ON enrollments(user_id, status);
CREATE INDEX idx_payment_session ON payments(stripe_session_id);
CREATE INDEX idx_audit_user_created ON audit_logs(user_id, created_at DESC);

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

## 16. Post-Deployment Verification

### Smoke Tests

```bash
# 1. Homepage loads
curl -I https://azerra.ai
# Expect: 200 OK

# 2. Health check
curl https://azerra.ai/api/health/readiness
# Expect: {"status":"healthy",...}

# 3. Bot health
curl https://[bot-url]/health
# Expect: {"status":"healthy",...}

# 4. Security headers
curl -I https://azerra.ai | grep -E "(Strict-Transport|Content-Security|X-Frame)"
# Expect: All security headers present
```

### Sentry Test

```bash
# Trigger test error
curl https://azerra.ai/api/test/sentry

# Verify in Sentry dashboard:
# - Error appears within 60 seconds
# - Source maps loaded correctly
# - Stack trace is readable
# - User context included
```

## 17. Rollback Procedures

### Quick Rollback (Vercel)

```bash
# Via CLI
vercel rollback

# Via Dashboard
# 1. Go to Deployments
# 2. Find last stable deployment
# 3. Click "..." → "Promote to Production"

# Rollback is instant (< 60 seconds)
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d $DATABASE_URL backup-20250930.sql

# Or point-in-time recovery (Neon)
# Use Neon dashboard to restore to specific timestamp
```

## 18. Maintenance Windows

### Planned Downtime

```bash
# For database migrations:
1. Post maintenance notice (24h advance)
2. Enable maintenance mode
3. Run migrations
4. Verify health checks
5. Disable maintenance mode
6. Monitor for 1 hour
```

### Emergency Maintenance

```bash
# For critical issues:
1. Rollback deployment
2. Post status update
3. Fix issue
4. Deploy to staging
5. Verify fix
6. Deploy to production
7. Monitor closely
```

## 19. Team Access

### Vercel Team Members

```bash
# Add team members:
vercel teams add [email]

# Roles:
# - Owner: Full access
# - Member: Deploy + env vars
# - Viewer: Read-only
```

### GitHub Access

```bash
# Repository access:
# - Admin: 2+ people
# - Maintainer: Core team
# - Write: Developers
# - Read: Contractors
```

## 20. Cost Estimation

### Monthly Costs (Estimated)

```
Vercel Pro: $20/user/month
Neon Pro: $19/month (compute + storage)
Upstash Pro: $10/month (256MB Redis)
Fly.io: $7/month (512MB bot instance)
Cloudflare R2: $0.015/GB storage + $0.36/million requests
Postmark: $15/month (50k emails)
Sentry: $26/month (50k events)
Stripe: 2.9% + $0.30 per transaction
Domain: $12/year

Total (excluding transaction fees): ~$120-150/month
At 100 students: ~$1.50/student/month infrastructure
```

## 21. Launch Day Procedure

### T-1 Week
- [ ] Complete staging tests
- [ ] Finalize content
- [ ] Train support team
- [ ] Prepare marketing materials

### T-1 Day
- [ ] Final staging test
- [ ] Database backup
- [ ] Team briefing
- [ ] Monitor channels ready

### T-4 Hours
- [ ] Switch to Stripe live mode
- [ ] Update environment variables
- [ ] Test live purchase
- [ ] Verify webhook delivery

### Launch (T=0)
- [ ] Deploy to production
- [ ] Verify all systems green
- [ ] Announce on Discord
- [ ] Send launch email
- [ ] Social media posts

### T+1 Hour
- [ ] Monitor Sentry (zero errors)
- [ ] Check health endpoints
- [ ] Verify first purchases
- [ ] Discord bot active

### T+24 Hours
- [ ] Review metrics
- [ ] Check customer feedback
- [ ] Verify email delivery
- [ ] Review error logs

## 22. Support Channels

### Monitoring
- Vercel Dashboard: Deployments, logs, analytics
- Sentry: Errors and performance
- Stripe Dashboard: Payments and refunds
- Uptime Monitor: Service availability

### Logs
```bash
# Vercel logs
vercel logs --follow

# Fly.io logs (bot)
fly logs

# Database logs
# Access via provider dashboard
```

### Team Communication
- Slack/Discord channel for incidents
- On-call rotation documented
- Escalation process clear
- Response time SLAs defined

---

## 🎯 QUICK DEPLOY COMMANDS

### Fresh Deployment

```bash
# 1. Build and test locally
pnpm install
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm -r build

# 2. Push to GitHub
git add .
git commit -m "feat: production ready"
git push origin main

# 3. Vercel auto-deploys
# 4. Deploy bot
fly deploy

# 5. Verify
curl https://azerra.ai/api/health/readiness
```

### Update Deployment

```bash
# Make changes
git add .
git commit -m "fix: bug description"
git push

# Auto-deploys via GitHub Actions
# Or manual: vercel --prod
```

---

**Last Updated:** September 30, 2025  
**Deployment Status:** Ready for Production  
**Next Steps:** Complete go-live checklist 🚀



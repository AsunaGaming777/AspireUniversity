# 🚀 Azerra AI School - Go-Live Checklist

## Pre-Launch Verification (Complete Before Production)

### 1. Infrastructure Setup

#### Domain & DNS
- [ ] Domain purchased and owned (e.g., azerra.ai)
- [ ] DNS configured with nameservers
- [ ] A record pointing to Vercel
- [ ] CNAME for www pointing to production
- [ ] SSL certificate auto-provisioned by Vercel
- [ ] HTTPS redirect enabled
- [ ] CAA records configured (optional but recommended)

#### Vercel Project
- [ ] Vercel project created for `apps/site`
- [ ] Production domain connected
- [ ] Framework preset: Next.js
- [ ] Root directory: `apps/site`
- [ ] Build command: `cd ../.. && pnpm install && pnpm --filter site build`
- [ ] Install command: `pnpm install`
- [ ] Output directory: `.next`
- [ ] Node.js version: 20.x

#### Database (Managed PostgreSQL)
- [ ] Production database provisioned (Neon/Railway/Supabase)
- [ ] Connection pooling enabled
- [ ] Backups configured (daily minimum)
- [ ] DATABASE_URL saved to Vercel secrets
- [ ] DIRECT_URL configured (for migrations)
- [ ] Run migrations: `pnpm --filter site prisma migrate deploy`
- [ ] Verify schema: `pnpm --filter site prisma db push --preview-feature`
- [ ] Test connection from Vercel (use `/api/health/readiness`)

#### Redis (Managed)
- [ ] Production Redis provisioned (Upstash/Railway)
- [ ] TLS enabled
- [ ] REDIS_URL saved to Vercel secrets
- [ ] Connection pool limits configured
- [ ] Eviction policy: allkeys-lru
- [ ] Max memory: 256MB minimum
- [ ] Test connection from Vercel

### 2. Third-Party Services

#### Stripe (Payments)
- [ ] Stripe account activated
- [ ] Business verified (for live mode)
- [ ] **Live API keys generated** (sk_live_..., pk_live_...)
- [ ] Webhook endpoint created: `https://azerra.ai/api/webhooks/stripe`
- [ ] Webhook secret saved (whsec_...)
- [ ] Test webhook delivery in Stripe Dashboard
- [ ] Events enabled:
  - [ ] `checkout.session.completed`
  - [ ] `charge.refunded`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
- [ ] Products created:
  - [ ] Standard ($497)
  - [ ] Mastery ($997)
  - [ ] Mastermind ($197/mo)
- [ ] Tax settings configured (if applicable)
- [ ] Receipt email template customized
- [ ] Refund policy documented

#### OAuth Providers
- [ ] **Google OAuth**
  - [ ] Production credentials created
  - [ ] Authorized redirect URIs: `https://azerra.ai/api/auth/callback/google`
  - [ ] GOOGLE_CLIENT_ID and SECRET saved to Vercel
- [ ] **Discord OAuth**
  - [ ] Production application created
  - [ ] Redirect URIs: `https://azerra.ai/api/auth/callback/discord`
  - [ ] DISCORD_CLIENT_ID and SECRET saved
- [ ] **GitHub OAuth**
  - [ ] Production OAuth app created
  - [ ] Callback URL: `https://azerra.ai/api/auth/callback/github`
  - [ ] GITHUB_CLIENT_ID and SECRET saved

#### Email (Postmark/SendGrid)
- [ ] Email service account created
- [ ] API key generated and saved to Vercel
- [ ] Sender email verified
- [ ] Domain verified (SPF, DKIM records)
- [ ] Email templates created:
  - [ ] Welcome/enrollment
  - [ ] Password reset
  - [ ] Payment confirmation
  - [ ] Refund confirmation
  - [ ] Certificate notification
  - [ ] Assignment graded
- [ ] Test email sent successfully

#### Analytics & Monitoring
- [ ] **Google Analytics 4**
  - [ ] GA4 property created
  - [ ] Measurement ID (G-...) saved
  - [ ] Data stream configured
  - [ ] Events tested
- [ ] **Sentry**
  - [ ] Organization and project created
  - [ ] DSN saved to Vercel
  - [ ] Source maps upload configured
  - [ ] Alert rules configured
  - [ ] On-call rotation set (if applicable)
- [ ] **OpenTelemetry** (optional)
  - [ ] OTLP endpoint configured
  - [ ] Traces visible in backend

### 3. Discord Bot Deployment

#### Discord Application Setup
- [ ] Production Discord bot created
- [ ] Bot token saved (MTxxxxxxx...)
- [ ] Bot invited to production server
- [ ] Permissions granted:
  - [ ] Manage Roles
  - [ ] Send Messages
  - [ ] Embed Links
  - [ ] Attach Files
  - [ ] Read Message History
- [ ] Guild ID saved
- [ ] Slash commands registered: `pnpm --filter discord-bot register`

#### Bot Hosting (Fly.io/Render)
- [ ] Container service created
- [ ] Docker image built and pushed
- [ ] Environment variables configured
- [ ] Health check endpoint verified: `/health`
- [ ] Heartbeat endpoint verified: `/heartbeat`
- [ ] Logs accessible
- [ ] Auto-restart enabled
- [ ] Resource limits set (512MB RAM minimum)

#### Discord Server Setup
- [ ] Production server created
- [ ] Roles created:
  - [ ] Student, Standard, Mastery, Mastermind
  - [ ] Mentor, Instructor, Admin, Moderator
  - [ ] Ambassador, Alumni, Council, Overseer
- [ ] Channels created:
  - [ ] #welcome
  - [ ] #announcements
  - [ ] #general
  - [ ] #support
  - [ ] #assignments
  - [ ] #resources
  - [ ] Admin channels (restricted)
- [ ] Permissions configured per role
- [ ] Welcome message configured
- [ ] Moderation rules set

### 4. Security Configuration

#### Environment Variables (Vercel)
- [ ] All secrets added to Vercel Environment Variables
- [ ] Production secrets separate from preview
- [ ] No secrets in code or git
- [ ] `.env.local` added to `.gitignore`

#### API Security
- [ ] Rate limiting tested
- [ ] CORS configured correctly
- [ ] CSP headers verified
- [ ] HTTPS enforced
- [ ] Webhook signatures verified

#### User Security
- [ ] 2FA enforced for all admins
- [ ] 2FA enforced for all mentors
- [ ] Password requirements: min 8 chars, complexity
- [ ] Session timeout: 7 days absolute
- [ ] Password reset flow tested
- [ ] Email verification required

### 5. Content & Data

#### No Fake Data Policy
- [ ] All demo/seed data removed from production
- [ ] Content importer tool ready
- [ ] First course content prepared
- [ ] All testimonials have consent + proof
- [ ] Revenue numbers accurate (not mocked)
- [ ] Demo mode disabled: `DEMO_MODE=false`

#### Initial Content
- [ ] At least Module 0-1 content ready
- [ ] Welcome video recorded
- [ ] First 5 lessons with transcripts
- [ ] Quizzes created and validated
- [ ] Assignments with rubrics ready
- [ ] Certificate template finalized

### 6. Testing & Validation

#### Pre-Production Testing
- [ ] All unit tests passing (≥80% coverage)
- [ ] All integration tests passing
- [ ] E2E golden path test passing
- [ ] Accessibility tests passing (0 violations)
- [ ] Load test passing (p95 < 300ms)
- [ ] Health check endpoints returning 200

#### Staging Environment
- [ ] Staging environment deployed
- [ ] Test purchase in Stripe test mode
- [ ] Test refund flow
- [ ] Test enrollment creation
- [ ] Test Discord role sync
- [ ] Test certificate generation
- [ ] Test affiliate commission
- [ ] Test email delivery
- [ ] Test 2FA setup
- [ ] Test admin actions

### 7. Operations & Support

#### Admin Setup
- [ ] At least 2 admin accounts created
- [ ] 2FA enabled for all admins
- [ ] Admin ops console access verified
- [ ] First cohort created
- [ ] Mentor accounts created
- [ ] Support email configured

#### Monitoring & Alerts
- [ ] Sentry alerts configured:
  - [ ] Error rate spike (>10 errors/min)
  - [ ] Webhook failure rate >5%
  - [ ] Discord bot offline
- [ ] Health check monitoring (UptimeRobot/Pingdom)
- [ ] Alert channels configured (Slack/email)
- [ ] On-call rotation documented

#### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Admin manual created
- [ ] Student onboarding guide ready
- [ ] FAQ updated
- [ ] Terms of Service final
- [ ] Privacy Policy final
- [ ] Refund Policy final

### 8. Legal & Compliance

#### Legal Pages
- [ ] Terms of Service reviewed by legal
- [ ] Privacy Policy compliant (GDPR, CCPA)
- [ ] Refund Policy clear (30-day guarantee)
- [ ] Cookie Policy published
- [ ] Accessibility Statement published

#### Data Protection
- [ ] GDPR compliance verified
- [ ] Cookie consent banner tested
- [ ] Data export functionality working
- [ ] Data deletion functionality working
- [ ] Privacy policy link in footer
- [ ] Contact email for privacy requests

#### Business
- [ ] Business entity registered
- [ ] Tax ID obtained (if required)
- [ ] Payment processor agreement signed
- [ ] Affiliate agreement template ready
- [ ] Refund process documented

---

## 🎯 LAUNCH DAY CHECKLIST

### T-24 Hours
- [ ] Final staging test of complete flow
- [ ] Database backup taken
- [ ] All team members briefed
- [ ] Support channels monitored
- [ ] Marketing emails queued

### T-4 Hours
- [ ] Switch Stripe to live mode
- [ ] Update STRIPE_SECRET_KEY in Vercel
- [ ] Update STRIPE_PUBLISHABLE_KEY in Vercel
- [ ] Re-verify webhook endpoint with live keys
- [ ] Test purchase with real card (refund immediately)

### T-1 Hour
- [ ] All systems status verified (green)
- [ ] Health endpoints returning 200
- [ ] Discord bot heartbeat active
- [ ] Sentry receiving telemetry
- [ ] Cache warmed (visit key pages)

### Launch (T=0)
- [ ] Flip to production (environment variable change if needed)
- [ ] Verify homepage loads
- [ ] Verify pricing page works
- [ ] Verify test purchase works
- [ ] Announce in Discord
- [ ] Send launch email (if list exists)
- [ ] Post on social media

### T+1 Hour
- [ ] Monitor error rates in Sentry
- [ ] Check health endpoints
- [ ] Verify payments processing
- [ ] Check Discord bot activity
- [ ] Review first purchases

### T+24 Hours
- [ ] Review all metrics
- [ ] Check for any errors
- [ ] Verify email delivery
- [ ] Check webhook success rate
- [ ] Review user feedback

---

## 🧪 ACCEPTANCE TESTS (Before Launch)

### Test 1: Live Purchase (Test Mode)
```bash
# Procedure:
1. Create new account: launch-test@example.com
2. Navigate to /pricing
3. Click "Get Started" on Standard plan
4. Complete Stripe Checkout (use test card: 4242 4242 4242 4242)
5. Verify redirect to /dashboard?success=true
6. Verify enrollment created in database
7. Verify Discord role assigned (if linked)
8. Verify welcome email sent

# Expected Results:
✓ Payment successful
✓ Enrollment status = active
✓ Dashboard shows "Standard Plan"
✓ Course modules unlocked (0-8)
✓ Discord role "Student" + "Standard" assigned
✓ Welcome email received
✓ Audit log entry created
```

**Confirmation Screenshot Required:** Dashboard showing successful enrollment

### Test 2: Refund Flow
```bash
# Procedure:
1. Log into Stripe Dashboard
2. Find the test payment
3. Issue full refund
4. Wait for webhook (should be instant)
5. Verify enrollment status changed to "cancelled"
6. Verify Discord roles removed
7. Verify refund email sent
8. Check affiliate commission (if applicable) reversed

# Expected Results:
✓ Refund processed
✓ Enrollment status = cancelled
✓ Access revoked
✓ Discord roles removed
✓ Refund email sent
✓ Commission clawed back (if applicable)
```

**Confirmation Screenshot Required:** Enrollment showing "cancelled" status

### Test 3: Affiliate Payout CSV
```bash
# Procedure:
1. Log into /admin/ops
2. Navigate to Affiliates section
3. Click "Generate Payout CSV"
4. Download CSV file
5. Verify format:
   - Affiliate ID
   - Name
   - Email
   - Total Commissions
   - Amount Owed
   - Stripe Connect ID (if connected)
6. Verify calculations match database

# Expected Results:
✓ CSV generated successfully
✓ All affiliates with pending commissions listed
✓ Commission amounts accurate
✓ Ready for processing
```

**Confirmation Required:** CSV file with correct data (paste sample rows)

### Test 4: End-to-End Golden Path
```bash
# Full user journey:
1. Sign up with email
2. Purchase Standard plan
3. Open Module 1, Lesson 1
4. Watch video
5. Take quiz and pass (≥70%)
6. Submit assignment
7. Mentor grades assignment (admin account)
8. Certificate issued
9. Verify Discord roles updated
10. Check KPIs in Ops Console updated

# Expected Results:
✓ Complete flow works end-to-end
✓ No errors in Sentry
✓ All audit logs created
✓ Performance within SLOs (p95 < 300ms)
```

**Confirmation Required:** Screenshot of certificate + Ops Console KPIs

---

## 📊 HEALTH CHECK VERIFICATION

### System Health
```bash
# Run these commands and paste results:

# 1. Readiness check
curl https://azerra.ai/api/health/readiness

# Expected:
{
  "status": "healthy",
  "timestamp": "2025-09-30T...",
  "checks": {
    "database": { "status": "pass", "responseTime": 15 },
    "redis": { "status": "pass", "responseTime": 5 },
    "stripe": { "status": "pass", "responseTime": 120 }
  }
}

# 2. Bot heartbeat
curl https://your-bot-url.fly.dev/heartbeat

# Expected:
{
  "status": "alive",
  "ping": 45,
  "uptime": 3600,
  "lastHeartbeat": "2025-09-30T...",
  "guilds": 1,
  "users": 150
}

# 3. Sentry test
curl https://azerra.ai/api/test/sentry

# Expected: Error logged in Sentry dashboard
```

### Performance Verification
```bash
# Run k6 load test
k6 run --env BASE_URL=https://azerra.ai infra/load/lesson-view.k6.js

# Expected output:
✓ http_req_duration{p(95)}<300ms
✓ http_req_failed{rate}<0.01
✓ lesson_load_time{p(95)}<300ms

# Paste actual results here:
```

---

## 🔐 SECURITY VERIFICATION

### Security Headers Check
```bash
# Test security headers
curl -I https://azerra.ai

# Expected headers:
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()...
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'
```

### Admin 2FA Verification
- [ ] All admin accounts have 2FA enabled
- [ ] All mentor accounts have 2FA enabled
- [ ] Tested 2FA login flow
- [ ] Backup codes generated and stored securely

### Rate Limiting Check
```bash
# Test rate limiting (should block after 5 attempts)
for i in {1..10}; do
  curl -X POST https://azerra.ai/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Expected: 429 Too Many Requests after 5 attempts
```

---

## 💰 PAYMENT VERIFICATION TESTS

### Test Purchase (Stripe Test Mode)

**Important:** Keep test mode enabled until all verifications pass!

```bash
# Test Card: 4242 4242 4242 4242 (Visa)
# Exp: Any future date
# CVC: Any 3 digits
# ZIP: Any 5 digits

# Steps:
1. Visit https://azerra.ai/pricing
2. Sign in or create account
3. Click "Get Started" on Standard plan
4. Use test card details above
5. Complete checkout

# Verification checklist:
- [ ] Checkout redirects to success page
- [ ] Dashboard shows "Payment Successful" banner
- [ ] Enrollment record created (check DB or admin panel)
- [ ] User role updated to "student"
- [ ] Course modules unlocked (0-8 for Standard)
- [ ] Welcome email sent
- [ ] Discord role assigned (if linked)
- [ ] Audit log entry created
- [ ] KPI updated in Ops Console (+1 enrollment)
```

**📸 PASTE CONFIRMATION:**
```
Screenshot of:
1. Dashboard showing "Standard Plan - Active"
2. Admin ops console showing the new enrollment in KPIs
```

### Test Refund

```bash
# Steps:
1. Log into Stripe Dashboard
2. Find the test payment
3. Click "Refund" → Full refund
4. Confirm refund
5. Wait 5-10 seconds for webhook

# Verification checklist:
- [ ] Webhook received (check logs or webhook viewer)
- [ ] Enrollment status changed to "cancelled"
- [ ] Access revoked (dashboard shows "Enroll Now" again)
- [ ] Discord roles removed
- [ ] Refund email sent
- [ ] If affiliate commission exists, status = "cancelled"
- [ ] Audit log entry created
```

**📸 PASTE CONFIRMATION:**
```
Screenshot of:
1. Enrollment showing "Cancelled" status in admin panel
2. Webhook event log showing "charge.refunded" processed
```

### Test Affiliate Payout

```bash
# Prerequisites:
1. Create affiliate account: /api/affiliate/create
2. Get referral code
3. Make test purchase with referral code
4. Generate payout

# Steps:
1. Log into /admin/ops/affiliates
2. Verify commission created (10% of $497 = $49.70)
3. Click "Generate Payout CSV"
4. Download CSV
5. Open and verify

# Verification checklist:
- [ ] Commission calculated correctly ($49.70)
- [ ] Commission status = "pending" or "approved"
- [ ] CSV contains correct data
- [ ] Format: affiliate_id, email, amount, stripe_connect_id
- [ ] Ready for batch processing
```

**📋 PASTE CSV SAMPLE:**
```csv
affiliate_id,name,email,commission_amount,stripe_connect_id,status
aff_xxx,John Doe,affiliate@example.com,49.70,acct_xxx,pending
```

---

## 🎯 FINAL VERIFICATION

### Smoke Tests (Production)
- [ ] Homepage loads (https://azerra.ai)
- [ ] Pricing page works
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] OAuth providers work (Google, Discord, GitHub)
- [ ] Dashboard accessible
- [ ] Course catalog accessible
- [ ] Lesson viewer works
- [ ] Admin console accessible (with proper role)
- [ ] Ops console shows KPIs
- [ ] Discord bot responds to /help

### Performance Metrics
- [ ] Homepage LCP < 2.5s (PageSpeed Insights)
- [ ] Core Web Vitals passing
- [ ] p95 response time < 300ms (k6 test)
- [ ] No console errors on key pages

### Monitoring Verification
- [ ] Errors appear in Sentry (test with /api/test/sentry)
- [ ] Logs visible in Vercel logs
- [ ] Health checks returning 200
- [ ] Discord bot heartbeat visible in Ops Console
- [ ] OpenTelemetry traces visible (if configured)

---

## 🚨 ROLLBACK PLAN

If critical issues found after launch:

### Immediate Actions
1. **Revert deployment** in Vercel (previous deployment)
2. **Disable new signups** (environment variable)
3. **Post status update** in Discord #announcements
4. **Notify active users** via email

### Investigation
1. Check Sentry for errors
2. Review webhook logs
3. Check database for anomalies
4. Review health check status
5. Check Discord bot logs

### Recovery
1. Fix critical issue in development
2. Deploy to staging
3. Re-run all acceptance tests
4. Deploy to production
5. Verify fix
6. Post resolution update

---

## 📞 SUPPORT READINESS

### Team Preparation
- [ ] Support email monitored (support@azerra.ai)
- [ ] Discord #support channel monitored
- [ ] Response time SLA defined (< 24 hours)
- [ ] Escalation process documented
- [ ] Common issues FAQ created

### Launch Communication
- [ ] Launch announcement prepared
- [ ] Email to waitlist (if exists)
- [ ] Social media posts scheduled
- [ ] Discord announcement ready
- [ ] Blog post published

---

## ✅ SIGN-OFF

### Technical Lead
- [ ] All infrastructure provisioned
- [ ] All tests passing
- [ ] All integrations verified
- [ ] Monitoring operational

**Signature:** _________________ Date: _______

### Product Owner
- [ ] Content ready
- [ ] UX reviewed
- [ ] Copy finalized
- [ ] Launch plan approved

**Signature:** _________________ Date: _______

### Security Officer
- [ ] Security audit completed
- [ ] All vulnerabilities addressed
- [ ] 2FA enforced for admins
- [ ] Secrets management verified

**Signature:** _________________ Date: _______

---

## 🎉 POST-LAUNCH MONITORING

### First 24 Hours
- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor conversion rates
- [ ] Check email delivery rates
- [ ] Verify Discord activity
- [ ] Review customer feedback
- [ ] Track first purchases

### First Week
- [ ] Daily health check reviews
- [ ] Student feedback analysis
- [ ] Performance optimization based on real traffic
- [ ] Content adjustments based on user behavior
- [ ] Support ticket review

### First Month
- [ ] Monthly KPI review
- [ ] Feature usage analysis
- [ ] Cohort success metrics
- [ ] Revenue vs. forecast
- [ ] Churn analysis
- [ ] Plan for iterations

---

**Generated:** September 30, 2025  
**Platform:** Azerra AI School  
**Version:** 1.0.0  
**Status:** Ready for Production Launch 🚀

## Pre-Launch Verification (Complete Before Production)

### 1. Infrastructure Setup

#### Domain & DNS
- [ ] Domain purchased and owned (e.g., azerra.ai)
- [ ] DNS configured with nameservers
- [ ] A record pointing to Vercel
- [ ] CNAME for www pointing to production
- [ ] SSL certificate auto-provisioned by Vercel
- [ ] HTTPS redirect enabled
- [ ] CAA records configured (optional but recommended)

#### Vercel Project
- [ ] Vercel project created for `apps/site`
- [ ] Production domain connected
- [ ] Framework preset: Next.js
- [ ] Root directory: `apps/site`
- [ ] Build command: `cd ../.. && pnpm install && pnpm --filter site build`
- [ ] Install command: `pnpm install`
- [ ] Output directory: `.next`
- [ ] Node.js version: 20.x

#### Database (Managed PostgreSQL)
- [ ] Production database provisioned (Neon/Railway/Supabase)
- [ ] Connection pooling enabled
- [ ] Backups configured (daily minimum)
- [ ] DATABASE_URL saved to Vercel secrets
- [ ] DIRECT_URL configured (for migrations)
- [ ] Run migrations: `pnpm --filter site prisma migrate deploy`
- [ ] Verify schema: `pnpm --filter site prisma db push --preview-feature`
- [ ] Test connection from Vercel (use `/api/health/readiness`)

#### Redis (Managed)
- [ ] Production Redis provisioned (Upstash/Railway)
- [ ] TLS enabled
- [ ] REDIS_URL saved to Vercel secrets
- [ ] Connection pool limits configured
- [ ] Eviction policy: allkeys-lru
- [ ] Max memory: 256MB minimum
- [ ] Test connection from Vercel

### 2. Third-Party Services

#### Stripe (Payments)
- [ ] Stripe account activated
- [ ] Business verified (for live mode)
- [ ] **Live API keys generated** (sk_live_..., pk_live_...)
- [ ] Webhook endpoint created: `https://azerra.ai/api/webhooks/stripe`
- [ ] Webhook secret saved (whsec_...)
- [ ] Test webhook delivery in Stripe Dashboard
- [ ] Events enabled:
  - [ ] `checkout.session.completed`
  - [ ] `charge.refunded`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
- [ ] Products created:
  - [ ] Standard ($497)
  - [ ] Mastery ($997)
  - [ ] Mastermind ($197/mo)
- [ ] Tax settings configured (if applicable)
- [ ] Receipt email template customized
- [ ] Refund policy documented

#### OAuth Providers
- [ ] **Google OAuth**
  - [ ] Production credentials created
  - [ ] Authorized redirect URIs: `https://azerra.ai/api/auth/callback/google`
  - [ ] GOOGLE_CLIENT_ID and SECRET saved to Vercel
- [ ] **Discord OAuth**
  - [ ] Production application created
  - [ ] Redirect URIs: `https://azerra.ai/api/auth/callback/discord`
  - [ ] DISCORD_CLIENT_ID and SECRET saved
- [ ] **GitHub OAuth**
  - [ ] Production OAuth app created
  - [ ] Callback URL: `https://azerra.ai/api/auth/callback/github`
  - [ ] GITHUB_CLIENT_ID and SECRET saved

#### Email (Postmark/SendGrid)
- [ ] Email service account created
- [ ] API key generated and saved to Vercel
- [ ] Sender email verified
- [ ] Domain verified (SPF, DKIM records)
- [ ] Email templates created:
  - [ ] Welcome/enrollment
  - [ ] Password reset
  - [ ] Payment confirmation
  - [ ] Refund confirmation
  - [ ] Certificate notification
  - [ ] Assignment graded
- [ ] Test email sent successfully

#### Analytics & Monitoring
- [ ] **Google Analytics 4**
  - [ ] GA4 property created
  - [ ] Measurement ID (G-...) saved
  - [ ] Data stream configured
  - [ ] Events tested
- [ ] **Sentry**
  - [ ] Organization and project created
  - [ ] DSN saved to Vercel
  - [ ] Source maps upload configured
  - [ ] Alert rules configured
  - [ ] On-call rotation set (if applicable)
- [ ] **OpenTelemetry** (optional)
  - [ ] OTLP endpoint configured
  - [ ] Traces visible in backend

### 3. Discord Bot Deployment

#### Discord Application Setup
- [ ] Production Discord bot created
- [ ] Bot token saved (MTxxxxxxx...)
- [ ] Bot invited to production server
- [ ] Permissions granted:
  - [ ] Manage Roles
  - [ ] Send Messages
  - [ ] Embed Links
  - [ ] Attach Files
  - [ ] Read Message History
- [ ] Guild ID saved
- [ ] Slash commands registered: `pnpm --filter discord-bot register`

#### Bot Hosting (Fly.io/Render)
- [ ] Container service created
- [ ] Docker image built and pushed
- [ ] Environment variables configured
- [ ] Health check endpoint verified: `/health`
- [ ] Heartbeat endpoint verified: `/heartbeat`
- [ ] Logs accessible
- [ ] Auto-restart enabled
- [ ] Resource limits set (512MB RAM minimum)

#### Discord Server Setup
- [ ] Production server created
- [ ] Roles created:
  - [ ] Student, Standard, Mastery, Mastermind
  - [ ] Mentor, Instructor, Admin, Moderator
  - [ ] Ambassador, Alumni, Council, Overseer
- [ ] Channels created:
  - [ ] #welcome
  - [ ] #announcements
  - [ ] #general
  - [ ] #support
  - [ ] #assignments
  - [ ] #resources
  - [ ] Admin channels (restricted)
- [ ] Permissions configured per role
- [ ] Welcome message configured
- [ ] Moderation rules set

### 4. Security Configuration

#### Environment Variables (Vercel)
- [ ] All secrets added to Vercel Environment Variables
- [ ] Production secrets separate from preview
- [ ] No secrets in code or git
- [ ] `.env.local` added to `.gitignore`

#### API Security
- [ ] Rate limiting tested
- [ ] CORS configured correctly
- [ ] CSP headers verified
- [ ] HTTPS enforced
- [ ] Webhook signatures verified

#### User Security
- [ ] 2FA enforced for all admins
- [ ] 2FA enforced for all mentors
- [ ] Password requirements: min 8 chars, complexity
- [ ] Session timeout: 7 days absolute
- [ ] Password reset flow tested
- [ ] Email verification required

### 5. Content & Data

#### No Fake Data Policy
- [ ] All demo/seed data removed from production
- [ ] Content importer tool ready
- [ ] First course content prepared
- [ ] All testimonials have consent + proof
- [ ] Revenue numbers accurate (not mocked)
- [ ] Demo mode disabled: `DEMO_MODE=false`

#### Initial Content
- [ ] At least Module 0-1 content ready
- [ ] Welcome video recorded
- [ ] First 5 lessons with transcripts
- [ ] Quizzes created and validated
- [ ] Assignments with rubrics ready
- [ ] Certificate template finalized

### 6. Testing & Validation

#### Pre-Production Testing
- [ ] All unit tests passing (≥80% coverage)
- [ ] All integration tests passing
- [ ] E2E golden path test passing
- [ ] Accessibility tests passing (0 violations)
- [ ] Load test passing (p95 < 300ms)
- [ ] Health check endpoints returning 200

#### Staging Environment
- [ ] Staging environment deployed
- [ ] Test purchase in Stripe test mode
- [ ] Test refund flow
- [ ] Test enrollment creation
- [ ] Test Discord role sync
- [ ] Test certificate generation
- [ ] Test affiliate commission
- [ ] Test email delivery
- [ ] Test 2FA setup
- [ ] Test admin actions

### 7. Operations & Support

#### Admin Setup
- [ ] At least 2 admin accounts created
- [ ] 2FA enabled for all admins
- [ ] Admin ops console access verified
- [ ] First cohort created
- [ ] Mentor accounts created
- [ ] Support email configured

#### Monitoring & Alerts
- [ ] Sentry alerts configured:
  - [ ] Error rate spike (>10 errors/min)
  - [ ] Webhook failure rate >5%
  - [ ] Discord bot offline
- [ ] Health check monitoring (UptimeRobot/Pingdom)
- [ ] Alert channels configured (Slack/email)
- [ ] On-call rotation documented

#### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Admin manual created
- [ ] Student onboarding guide ready
- [ ] FAQ updated
- [ ] Terms of Service final
- [ ] Privacy Policy final
- [ ] Refund Policy final

### 8. Legal & Compliance

#### Legal Pages
- [ ] Terms of Service reviewed by legal
- [ ] Privacy Policy compliant (GDPR, CCPA)
- [ ] Refund Policy clear (30-day guarantee)
- [ ] Cookie Policy published
- [ ] Accessibility Statement published

#### Data Protection
- [ ] GDPR compliance verified
- [ ] Cookie consent banner tested
- [ ] Data export functionality working
- [ ] Data deletion functionality working
- [ ] Privacy policy link in footer
- [ ] Contact email for privacy requests

#### Business
- [ ] Business entity registered
- [ ] Tax ID obtained (if required)
- [ ] Payment processor agreement signed
- [ ] Affiliate agreement template ready
- [ ] Refund process documented

---

## 🎯 LAUNCH DAY CHECKLIST

### T-24 Hours
- [ ] Final staging test of complete flow
- [ ] Database backup taken
- [ ] All team members briefed
- [ ] Support channels monitored
- [ ] Marketing emails queued

### T-4 Hours
- [ ] Switch Stripe to live mode
- [ ] Update STRIPE_SECRET_KEY in Vercel
- [ ] Update STRIPE_PUBLISHABLE_KEY in Vercel
- [ ] Re-verify webhook endpoint with live keys
- [ ] Test purchase with real card (refund immediately)

### T-1 Hour
- [ ] All systems status verified (green)
- [ ] Health endpoints returning 200
- [ ] Discord bot heartbeat active
- [ ] Sentry receiving telemetry
- [ ] Cache warmed (visit key pages)

### Launch (T=0)
- [ ] Flip to production (environment variable change if needed)
- [ ] Verify homepage loads
- [ ] Verify pricing page works
- [ ] Verify test purchase works
- [ ] Announce in Discord
- [ ] Send launch email (if list exists)
- [ ] Post on social media

### T+1 Hour
- [ ] Monitor error rates in Sentry
- [ ] Check health endpoints
- [ ] Verify payments processing
- [ ] Check Discord bot activity
- [ ] Review first purchases

### T+24 Hours
- [ ] Review all metrics
- [ ] Check for any errors
- [ ] Verify email delivery
- [ ] Check webhook success rate
- [ ] Review user feedback

---

## 🧪 ACCEPTANCE TESTS (Before Launch)

### Test 1: Live Purchase (Test Mode)
```bash
# Procedure:
1. Create new account: launch-test@example.com
2. Navigate to /pricing
3. Click "Get Started" on Standard plan
4. Complete Stripe Checkout (use test card: 4242 4242 4242 4242)
5. Verify redirect to /dashboard?success=true
6. Verify enrollment created in database
7. Verify Discord role assigned (if linked)
8. Verify welcome email sent

# Expected Results:
✓ Payment successful
✓ Enrollment status = active
✓ Dashboard shows "Standard Plan"
✓ Course modules unlocked (0-8)
✓ Discord role "Student" + "Standard" assigned
✓ Welcome email received
✓ Audit log entry created
```

**Confirmation Screenshot Required:** Dashboard showing successful enrollment

### Test 2: Refund Flow
```bash
# Procedure:
1. Log into Stripe Dashboard
2. Find the test payment
3. Issue full refund
4. Wait for webhook (should be instant)
5. Verify enrollment status changed to "cancelled"
6. Verify Discord roles removed
7. Verify refund email sent
8. Check affiliate commission (if applicable) reversed

# Expected Results:
✓ Refund processed
✓ Enrollment status = cancelled
✓ Access revoked
✓ Discord roles removed
✓ Refund email sent
✓ Commission clawed back (if applicable)
```

**Confirmation Screenshot Required:** Enrollment showing "cancelled" status

### Test 3: Affiliate Payout CSV
```bash
# Procedure:
1. Log into /admin/ops
2. Navigate to Affiliates section
3. Click "Generate Payout CSV"
4. Download CSV file
5. Verify format:
   - Affiliate ID
   - Name
   - Email
   - Total Commissions
   - Amount Owed
   - Stripe Connect ID (if connected)
6. Verify calculations match database

# Expected Results:
✓ CSV generated successfully
✓ All affiliates with pending commissions listed
✓ Commission amounts accurate
✓ Ready for processing
```

**Confirmation Required:** CSV file with correct data (paste sample rows)

### Test 4: End-to-End Golden Path
```bash
# Full user journey:
1. Sign up with email
2. Purchase Standard plan
3. Open Module 1, Lesson 1
4. Watch video
5. Take quiz and pass (≥70%)
6. Submit assignment
7. Mentor grades assignment (admin account)
8. Certificate issued
9. Verify Discord roles updated
10. Check KPIs in Ops Console updated

# Expected Results:
✓ Complete flow works end-to-end
✓ No errors in Sentry
✓ All audit logs created
✓ Performance within SLOs (p95 < 300ms)
```

**Confirmation Required:** Screenshot of certificate + Ops Console KPIs

---

## 📊 HEALTH CHECK VERIFICATION

### System Health
```bash
# Run these commands and paste results:

# 1. Readiness check
curl https://azerra.ai/api/health/readiness

# Expected:
{
  "status": "healthy",
  "timestamp": "2025-09-30T...",
  "checks": {
    "database": { "status": "pass", "responseTime": 15 },
    "redis": { "status": "pass", "responseTime": 5 },
    "stripe": { "status": "pass", "responseTime": 120 }
  }
}

# 2. Bot heartbeat
curl https://your-bot-url.fly.dev/heartbeat

# Expected:
{
  "status": "alive",
  "ping": 45,
  "uptime": 3600,
  "lastHeartbeat": "2025-09-30T...",
  "guilds": 1,
  "users": 150
}

# 3. Sentry test
curl https://azerra.ai/api/test/sentry

# Expected: Error logged in Sentry dashboard
```

### Performance Verification
```bash
# Run k6 load test
k6 run --env BASE_URL=https://azerra.ai infra/load/lesson-view.k6.js

# Expected output:
✓ http_req_duration{p(95)}<300ms
✓ http_req_failed{rate}<0.01
✓ lesson_load_time{p(95)}<300ms

# Paste actual results here:
```

---

## 🔐 SECURITY VERIFICATION

### Security Headers Check
```bash
# Test security headers
curl -I https://azerra.ai

# Expected headers:
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()...
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...'
```

### Admin 2FA Verification
- [ ] All admin accounts have 2FA enabled
- [ ] All mentor accounts have 2FA enabled
- [ ] Tested 2FA login flow
- [ ] Backup codes generated and stored securely

### Rate Limiting Check
```bash
# Test rate limiting (should block after 5 attempts)
for i in {1..10}; do
  curl -X POST https://azerra.ai/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Expected: 429 Too Many Requests after 5 attempts
```

---

## 💰 PAYMENT VERIFICATION TESTS

### Test Purchase (Stripe Test Mode)

**Important:** Keep test mode enabled until all verifications pass!

```bash
# Test Card: 4242 4242 4242 4242 (Visa)
# Exp: Any future date
# CVC: Any 3 digits
# ZIP: Any 5 digits

# Steps:
1. Visit https://azerra.ai/pricing
2. Sign in or create account
3. Click "Get Started" on Standard plan
4. Use test card details above
5. Complete checkout

# Verification checklist:
- [ ] Checkout redirects to success page
- [ ] Dashboard shows "Payment Successful" banner
- [ ] Enrollment record created (check DB or admin panel)
- [ ] User role updated to "student"
- [ ] Course modules unlocked (0-8 for Standard)
- [ ] Welcome email sent
- [ ] Discord role assigned (if linked)
- [ ] Audit log entry created
- [ ] KPI updated in Ops Console (+1 enrollment)
```

**📸 PASTE CONFIRMATION:**
```
Screenshot of:
1. Dashboard showing "Standard Plan - Active"
2. Admin ops console showing the new enrollment in KPIs
```

### Test Refund

```bash
# Steps:
1. Log into Stripe Dashboard
2. Find the test payment
3. Click "Refund" → Full refund
4. Confirm refund
5. Wait 5-10 seconds for webhook

# Verification checklist:
- [ ] Webhook received (check logs or webhook viewer)
- [ ] Enrollment status changed to "cancelled"
- [ ] Access revoked (dashboard shows "Enroll Now" again)
- [ ] Discord roles removed
- [ ] Refund email sent
- [ ] If affiliate commission exists, status = "cancelled"
- [ ] Audit log entry created
```

**📸 PASTE CONFIRMATION:**
```
Screenshot of:
1. Enrollment showing "Cancelled" status in admin panel
2. Webhook event log showing "charge.refunded" processed
```

### Test Affiliate Payout

```bash
# Prerequisites:
1. Create affiliate account: /api/affiliate/create
2. Get referral code
3. Make test purchase with referral code
4. Generate payout

# Steps:
1. Log into /admin/ops/affiliates
2. Verify commission created (10% of $497 = $49.70)
3. Click "Generate Payout CSV"
4. Download CSV
5. Open and verify

# Verification checklist:
- [ ] Commission calculated correctly ($49.70)
- [ ] Commission status = "pending" or "approved"
- [ ] CSV contains correct data
- [ ] Format: affiliate_id, email, amount, stripe_connect_id
- [ ] Ready for batch processing
```

**📋 PASTE CSV SAMPLE:**
```csv
affiliate_id,name,email,commission_amount,stripe_connect_id,status
aff_xxx,John Doe,affiliate@example.com,49.70,acct_xxx,pending
```

---

## 🎯 FINAL VERIFICATION

### Smoke Tests (Production)
- [ ] Homepage loads (https://azerra.ai)
- [ ] Pricing page works
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] OAuth providers work (Google, Discord, GitHub)
- [ ] Dashboard accessible
- [ ] Course catalog accessible
- [ ] Lesson viewer works
- [ ] Admin console accessible (with proper role)
- [ ] Ops console shows KPIs
- [ ] Discord bot responds to /help

### Performance Metrics
- [ ] Homepage LCP < 2.5s (PageSpeed Insights)
- [ ] Core Web Vitals passing
- [ ] p95 response time < 300ms (k6 test)
- [ ] No console errors on key pages

### Monitoring Verification
- [ ] Errors appear in Sentry (test with /api/test/sentry)
- [ ] Logs visible in Vercel logs
- [ ] Health checks returning 200
- [ ] Discord bot heartbeat visible in Ops Console
- [ ] OpenTelemetry traces visible (if configured)

---

## 🚨 ROLLBACK PLAN

If critical issues found after launch:

### Immediate Actions
1. **Revert deployment** in Vercel (previous deployment)
2. **Disable new signups** (environment variable)
3. **Post status update** in Discord #announcements
4. **Notify active users** via email

### Investigation
1. Check Sentry for errors
2. Review webhook logs
3. Check database for anomalies
4. Review health check status
5. Check Discord bot logs

### Recovery
1. Fix critical issue in development
2. Deploy to staging
3. Re-run all acceptance tests
4. Deploy to production
5. Verify fix
6. Post resolution update

---

## 📞 SUPPORT READINESS

### Team Preparation
- [ ] Support email monitored (support@azerra.ai)
- [ ] Discord #support channel monitored
- [ ] Response time SLA defined (< 24 hours)
- [ ] Escalation process documented
- [ ] Common issues FAQ created

### Launch Communication
- [ ] Launch announcement prepared
- [ ] Email to waitlist (if exists)
- [ ] Social media posts scheduled
- [ ] Discord announcement ready
- [ ] Blog post published

---

## ✅ SIGN-OFF

### Technical Lead
- [ ] All infrastructure provisioned
- [ ] All tests passing
- [ ] All integrations verified
- [ ] Monitoring operational

**Signature:** _________________ Date: _______

### Product Owner
- [ ] Content ready
- [ ] UX reviewed
- [ ] Copy finalized
- [ ] Launch plan approved

**Signature:** _________________ Date: _______

### Security Officer
- [ ] Security audit completed
- [ ] All vulnerabilities addressed
- [ ] 2FA enforced for admins
- [ ] Secrets management verified

**Signature:** _________________ Date: _______

---

## 🎉 POST-LAUNCH MONITORING

### First 24 Hours
- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor conversion rates
- [ ] Check email delivery rates
- [ ] Verify Discord activity
- [ ] Review customer feedback
- [ ] Track first purchases

### First Week
- [ ] Daily health check reviews
- [ ] Student feedback analysis
- [ ] Performance optimization based on real traffic
- [ ] Content adjustments based on user behavior
- [ ] Support ticket review

### First Month
- [ ] Monthly KPI review
- [ ] Feature usage analysis
- [ ] Cohort success metrics
- [ ] Revenue vs. forecast
- [ ] Churn analysis
- [ ] Plan for iterations

---

**Generated:** September 30, 2025  
**Platform:** Azerra AI School  
**Version:** 1.0.0  
**Status:** Ready for Production Launch 🚀



# Production Deployment & Stripe Migration Guide

## 🚀 Production Deployment Checklist

### Pre-Deployment Setup

#### 1. Environment Configuration
```bash
# Copy environment template
cp site/env.example site/.env.local

# Configure production environment variables
# See env.example for all required variables
```

#### 2. Database Setup
```bash
# Set up PostgreSQL database
# Option 1: Managed service (Recommended)
# - AWS RDS, Google Cloud SQL, or Supabase

# Option 2: Self-hosted
docker run --name azerra-postgres \
  -e POSTGRES_DB=azerra_ai \
  -e POSTGRES_USER=azerra \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:15

# Run migrations
cd site
npx prisma migrate deploy
npx prisma generate
```

#### 3. Redis Setup (for Discord bot queues)
```bash
# Option 1: Managed service (Recommended)
# - AWS ElastiCache, Redis Cloud, or Upstash

# Option 2: Self-hosted
docker run --name azerra-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### Deployment Steps

#### 1. Deploy Next.js Application (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd site
vercel --prod

# Configure environment variables in Vercel dashboard
# Add all variables from env.example
```

#### 2. Deploy Discord Bot
```bash
# Build Docker image
cd discord_bot
docker build -t azerra-discord-bot .

# Deploy to your preferred platform
# Option 1: Docker Compose
docker-compose up -d

# Option 2: Kubernetes
kubectl apply -f k8s/

# Option 3: Cloud Run (Google Cloud)
gcloud run deploy azerra-discord-bot \
  --image gcr.io/your-project/azerra-discord-bot \
  --platform managed \
  --region us-central1
```

#### 3. Configure Webhooks
```bash
# Set up webhook endpoints
# Site -> Discord Bot webhook URL
DISCORD_WEBHOOK_URL=https://your-bot-domain.com/webhooks/discord

# Discord Bot -> Site webhook URL  
SITE_WEBHOOK_URL=https://your-site-domain.com/api/webhooks/discord
```

## 💳 Stripe Migration: Test to Live

### Pre-Migration Checklist

#### 1. Stripe Account Setup
- [ ] Create Stripe account
- [ ] Complete business verification
- [ ] Set up Stripe Connect for affiliates
- [ ] Configure webhook endpoints
- [ ] Test all payment flows in test mode

#### 2. Legal & Compliance
- [ ] Terms of Service updated for live payments
- [ ] Privacy Policy includes payment processing
- [ ] Refund policy clearly defined
- [ ] Tax compliance (if applicable)
- [ ] PCI compliance verified

#### 3. Security Audit
- [ ] All secrets stored securely (not in code)
- [ ] HTTPS enforced everywhere
- [ ] Webhook signatures verified
- [ ] Rate limiting implemented
- [ ] Fraud detection enabled

### Migration Steps

#### 1. Update Environment Variables
```bash
# Replace test keys with live keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Update webhook endpoints to production URLs
STRIPE_WEBHOOK_URL=https://your-site-domain.com/api/stripe/webhook
```

#### 2. Configure Live Webhooks
```bash
# In Stripe Dashboard, add webhook endpoint:
# URL: https://your-site-domain.com/api/stripe/webhook
# Events to send:
# - checkout.session.completed
# - payment_intent.succeeded
# - payment_intent.payment_failed
# - customer.subscription.created
# - customer.subscription.updated
# - customer.subscription.deleted
# - invoice.payment_succeeded
# - invoice.payment_failed
```

#### 3. Test Live Payments
```bash
# Test with real payment methods (small amounts)
# Verify webhook processing
# Check database updates
# Confirm email notifications
```

#### 4. Go Live Checklist
- [ ] All test data removed from production
- [ ] Demo mode disabled
- [ ] Real testimonials only (with consent)
- [ ] Affiliate system configured
- [ ] Email notifications working
- [ ] Discord bot operational
- [ ] Analytics tracking active
- [ ] Backup systems in place

## 🔧 Operational Procedures

### Daily Operations

#### 1. Health Checks
```bash
# Check application health
curl https://your-site-domain.com/api/health

# Check Discord bot status
curl https://your-bot-domain.com/api/health

# Check database connectivity
npx prisma db pull
```

#### 2. Monitoring
- [ ] Application performance (Vercel Analytics)
- [ ] Database performance (query times)
- [ ] Payment processing (Stripe Dashboard)
- [ ] Discord bot activity
- [ ] Error rates and logs

#### 3. Backup Procedures
```bash
# Database backup (daily)
pg_dump azerra_ai > backup_$(date +%Y%m%d).sql

# File storage backup (if using local storage)
# Consider using cloud storage (AWS S3, Google Cloud Storage)
```

### Weekly Operations

#### 1. Security Review
- [ ] Review access logs
- [ ] Check for suspicious activity
- [ ] Update dependencies
- [ ] Rotate secrets (if needed)

#### 2. Performance Optimization
- [ ] Review slow queries
- [ ] Optimize database indexes
- [ ] Check CDN performance
- [ ] Review caching strategies

#### 3. Content Updates
- [ ] Review new testimonials
- [ ] Update course content
- [ ] Check affiliate payouts
- [ ] Review user feedback

### Monthly Operations

#### 1. Financial Reconciliation
```bash
# Generate monthly reports
# - Revenue reports
# - Affiliate payouts
# - Refund analysis
# - Tax reporting (if applicable)
```

#### 2. System Maintenance
- [ ] Update dependencies
- [ ] Security patches
- [ ] Performance optimization
- [ ] Capacity planning

#### 3. Business Review
- [ ] User growth metrics
- [ ] Revenue analysis
- [ ] Course completion rates
- [ ] Customer satisfaction

## 🚨 Incident Response

### Common Issues & Solutions

#### 1. Payment Processing Issues
```bash
# Check Stripe webhook logs
# Verify webhook signatures
# Check database for failed transactions
# Review error logs
```

#### 2. Discord Bot Issues
```bash
# Check bot logs
# Verify Discord API status
# Check Redis queue status
# Restart bot if needed
```

#### 3. Database Issues
```bash
# Check database connectivity
# Review slow queries
# Check disk space
# Verify backup integrity
```

### Emergency Procedures

#### 1. Site Down
1. Check Vercel status page
2. Review application logs
3. Check database connectivity
4. Restart services if needed
5. Notify users via Discord/email

#### 2. Payment Issues
1. Check Stripe status
2. Review webhook logs
3. Manually process if needed
4. Notify affected users
5. Update support team

#### 3. Security Incident
1. Isolate affected systems
2. Review access logs
3. Change compromised secrets
4. Notify users if needed
5. Document incident

## 📊 Monitoring & Analytics

### Key Metrics to Track

#### 1. Business Metrics
- Daily/Monthly Active Users
- Revenue (daily, weekly, monthly)
- Conversion rates
- Churn rate
- Customer Lifetime Value

#### 2. Technical Metrics
- Application uptime
- Response times
- Error rates
- Database performance
- Payment success rates

#### 3. User Engagement
- Course completion rates
- Time spent on platform
- Assignment submissions
- Community activity
- Support ticket volume

### Alerting Setup

#### 1. Critical Alerts
- Site down (>5 minutes)
- Payment processing failures
- Database connectivity issues
- High error rates

#### 2. Warning Alerts
- Slow response times
- High memory usage
- Queue backlogs
- Unusual traffic patterns

#### 3. Information Alerts
- Successful deployments
- Scheduled maintenance
- Performance improvements
- Feature releases

## 🔐 Security Best Practices

### 1. Secrets Management
```bash
# Use environment variables for all secrets
# Never commit secrets to code
# Rotate secrets regularly
# Use different secrets for test/prod
```

### 2. Access Control
```bash
# Implement role-based access control
# Use strong authentication
# Enable 2FA for admin accounts
# Regular access reviews
```

### 3. Data Protection
```bash
# Encrypt sensitive data at rest
# Use HTTPS everywhere
# Implement proper CORS
# Regular security audits
```

### 4. Compliance
```bash
# GDPR compliance for EU users
# COPPA compliance for minors
# Data retention policies
# User consent management
```

## 📞 Support & Maintenance

### 1. User Support
- Discord community support
- Email support system
- Knowledge base
- Video tutorials

### 2. Technical Support
- Monitoring dashboards
- Error tracking (Sentry)
- Performance monitoring
- Log aggregation

### 3. Maintenance Windows
- Schedule during low-traffic hours
- Notify users in advance
- Have rollback plan ready
- Test in staging first

---

## 🎯 Go-Live Checklist

### Final Pre-Launch
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Stripe live keys configured
- [ ] Webhooks tested and working
- [ ] Discord bot deployed and functional
- [ ] Email notifications working
- [ ] Analytics tracking active
- [ ] Security audit completed
- [ ] Legal documents updated
- [ ] Support processes in place
- [ ] Backup systems configured
- [ ] Monitoring alerts set up
- [ ] Team trained on operations
- [ ] Go-live plan documented

### Launch Day
- [ ] Final system checks
- [ ] Team on standby
- [ ] Monitoring dashboards active
- [ ] Support channels ready
- [ ] Launch announcement prepared
- [ ] Rollback plan ready

### Post-Launch (First 24 Hours)
- [ ] Monitor all systems
- [ ] Watch for errors
- [ ] Respond to user feedback
- [ ] Track key metrics
- [ ] Document any issues
- [ ] Celebrate success! 🎉

---

**Remember:** This is a comprehensive guide. Adapt it to your specific infrastructure and requirements. Always test thoroughly in staging before going live!



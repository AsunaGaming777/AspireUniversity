# 🚀 Deploy to Netlify

This guide will help you deploy your Next.js app to Netlify and connect your domain `aspireuniversity.net`.

## Step 1: Sign up for Netlify

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up with your GitHub account (recommended) or email
3. You'll get a free tier with:
   - 100GB bandwidth/month
   - Automatic SSL certificates
   - Custom domain support
   - Continuous deployment from GitHub

## Step 2: Connect Your GitHub Repository

1. In Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Choose **GitHub** and authorize Netlify
3. Select your repository: `AsunaGaming777/AspireUniversity`
4. Netlify will auto-detect the `netlify.toml` configuration

## Step 3: Configure Build Settings

Netlify should auto-detect from `netlify.toml`, but verify these settings:

- **Base directory:** `.` (root)
- **Build command:** `npm install -g pnpm@8.9.0 && pnpm install && pnpm --filter aspire-academy db:generate && pnpm --filter aspire-academy build`
- **Publish directory:** `apps/site/.next`
- **Node version:** `20`

## Step 4: Add Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

### Required:
```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_URL=https://aspireuniversity.net
NEXTAUTH_SECRET=your_32_character_secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional (but recommended):
```
REDIS_URL=your_redis_url
DISCORD_BOT_TOKEN=your_discord_bot_token
SENDGRID_API_KEY=your_sendgrid_key
```

**Important:** Set these for **Production** environment.

## Step 5: Connect Your Domain

1. In Netlify dashboard → **Domain settings**
2. Click **"Add custom domain"**
3. Enter: `aspireuniversity.net`
4. Netlify will show you DNS records to add:

### DNS Configuration

Add these records at your domain registrar (where you bought `aspireuniversity.net`):

**Option 1: CNAME (Recommended)**
- **Type:** CNAME
- **Name:** `@` (or root domain)
- **Value:** `your-site-name.netlify.app`
- **TTL:** 3600

**Option 2: A Record (If CNAME not supported)**
- **Type:** A
- **Name:** `@`
- **Value:** `75.2.60.5` (Netlify's IP - check their docs for current IPs)
- **TTL:** 3600

**For www subdomain:**
- **Type:** CNAME
- **Name:** `www`
- **Value:** `your-site-name.netlify.app`
- **TTL:** 3600

## Step 6: SSL Certificate

Netlify automatically provisions SSL certificates via Let's Encrypt. This happens automatically after DNS propagates (usually 5-60 minutes).

## Step 7: Deploy

1. Push your code to GitHub (if not already)
2. Netlify will automatically deploy on every push to `main` branch
3. Or manually trigger a deploy from the Netlify dashboard

## Step 8: Verify Deployment

1. Check build logs in Netlify dashboard
2. Visit `https://aspireuniversity.net` (after DNS propagates)
3. Test your app functionality

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all environment variables are set
- Verify `netlify.toml` configuration

### Domain Not Working
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check Netlify's domain status page

### Database Connection Issues
- Ensure `DATABASE_URL` is set correctly
- Check if your database allows connections from Netlify's IPs
- Verify Prisma migrations are run

## Alternative: Railway

If Netlify doesn't work, try **Railway**:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects Next.js
6. Add environment variables
7. Connect your domain in Railway's settings

Railway is great for monorepos and handles pnpm workspaces well.

## Need Help?

- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app
- Check build logs for specific errors


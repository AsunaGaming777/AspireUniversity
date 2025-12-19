# 🚀 Quick Netlify Setup Checklist

Since you're already uploading to Netlify, follow these steps:

## ✅ Step 1: Configure Build Settings (IMPORTANT!)

In Netlify Dashboard → **Site settings** → **Build & deploy** → **Build settings**:

### Critical: Disable Auto-Install
1. Scroll down to **"Dependency installation"** section
2. Set **"Install command"** to: `echo "Skipping auto-install, using pnpm in build script"`
3. OR better: Leave it empty/blank to skip auto npm install

### Build Configuration:
- **Base directory:** `.` (root of repo)
- **Build command:** `bash netlify-build.sh` (should auto-detect from `netlify.toml`)
- **Publish directory:** `apps/site/.next`
- **Node version:** `20`

**Why?** Netlify tries to auto-install with `npm`, but your project uses `pnpm` with `workspace:*` protocol which npm doesn't support. The build script handles pnpm installation.

## ✅ Step 2: Add Environment Variables

Go to **Site settings** → **Environment variables** → **Add variable**

### Required Variables (Production):

```
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_postgresql_direct_connection_string
NEXTAUTH_URL=https://aspireuniversity.net
NEXTAUTH_SECRET=your_32_character_secret_here
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional but Recommended:

```
REDIS_URL=your_redis_url
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_guild_id
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@aspireuniversity.net
```

**Important:** 
- Set scope to **Production** (or **All environments**)
- Click **Save** after adding each variable

## ✅ Step 3: Connect Your Domain

1. Go to **Domain settings** → **Add custom domain**
2. Enter: `aspireuniversity.net`
3. Netlify will show DNS configuration

### DNS Records to Add (at your domain registrar):

**For root domain:**
- **Type:** A
- **Name:** `@`
- **Value:** `75.2.60.5` (Netlify's IP - verify in Netlify dashboard)
- **TTL:** 3600

**OR use CNAME (if supported):**
- **Type:** CNAME  
- **Name:** `@`
- **Value:** `your-site-name.netlify.app`
- **TTL:** 3600

**For www subdomain:**
- **Type:** CNAME
- **Name:** `www`
- **Value:** `your-site-name.netlify.app`
- **TTL:** 3600

## ✅ Step 4: SSL Certificate

Netlify automatically provisions SSL certificates via Let's Encrypt. This happens automatically after DNS propagates (usually 5-60 minutes, can take up to 24 hours).

## ✅ Step 5: Trigger Deployment

1. If you just connected the repo, Netlify should auto-deploy
2. Or go to **Deploys** → **Trigger deploy** → **Deploy site**
3. Watch the build logs for any errors

## ✅ Step 6: Verify Build

Check the build logs for:
- ✅ Dependencies installed successfully
- ✅ Prisma generated (`db:generate`)
- ✅ Next.js build completed
- ✅ No errors

## 🔧 Troubleshooting

### ❌ Error: "Unsupported URL Type workspace:"
**This is the error you're seeing!** Netlify is trying to use `npm` instead of `pnpm`.

**Solution:**
1. Go to **Site settings** → **Build & deploy** → **Build settings**
2. Find **"Dependency installation"** or **"Install command"**
3. Set it to: `corepack enable && corepack prepare pnpm@8.9.0 --activate && pnpm install --frozen-lockfile`
4. OR clear/delete the install command field entirely (let the build script handle it)
5. Make sure **Build command** is set to: `bash netlify-build.sh`
6. Save and redeploy

### Build Fails with "Module not found"
- Ensure all dependencies are in `package.json`
- Check that `pnpm install` completes successfully

### Build Fails with Prisma Error
- Verify `DATABASE_URL` is set correctly
- Check that Prisma can connect to your database

### Domain Not Working
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct at your registrar
- Check Netlify's domain status page

### Environment Variables Not Working
- Ensure variables are set for **Production** environment
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

## 📝 Next Steps After Deployment

1. ✅ Test your site at `https://aspireuniversity.net`
2. ✅ Verify authentication works
3. ✅ Test Stripe payments (use test mode first)
4. ✅ Check API routes are working
5. ✅ Monitor build logs for any warnings

## 🆘 Need Help?

- Check Netlify build logs for specific errors
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://www.netlify.com/support/


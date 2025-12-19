# 🎯 Step-by-Step: Configure Netlify Build Settings

## Method 1: From Site Overview (Easiest)

1. **Go to your Netlify dashboard** (netlify.com)
2. **Click on your site** (cerulean-puffpuff-757d26)
3. You should see tabs at the top: **"Overview"**, **"Deploys"**, **"Pluginpiscos"**, etc.
4. Click **"Site configuration"** (gear icon) or **"Settings"** in the left sidebar
5. In the left menu, click **"Build & deploy"**
6. Scroll down to find **"Build settings"** section
7. Look for:
   - **"Build command"** field
   - **"Publish directory"** field
   - **"Base directory"** field

## Method 2: Direct URL

1. Go to: `https://app.netlify.com/sites/YOUR-SITE-NAME/settings/deploys`
   (Replace YOUR-SITE-NAME with your actual site name)
2. Scroll to **"Build settings"**

## Method 3: Alternative Navigation

1. Click on your site name
2. Look for a **"Configuration"** or **"⚙️ Settings"** button (usually top right or in sidebar)
3. Click **"Build & deploy"** or **"Deploy settings"**
4. Find the build configuration section

## What to Set:

### If you see separate fields:

**Build command:**
```
corepack enable && corepack prepare pnpm@8.9.0 --activate && pnpm install --frozen-lockfile && pnpm --filter aspire-academy db:generate && pnpm --filter aspire-academy build
```

**Publish directory:**
```
apps/site/.next
```

**Base directory:**
```
.
```

### If you only see "Build command" field:

Put everything in one command:
```
corepack enable && corepack prepare pnpm@8.9.0 --activate && pnpm install --frozen-lockfile && pnpm --filter aspire-academy db:generate && pnpm --filter aspire-academy build
```

## Still Can't Find It?

**Option A: Use netlify.toml (Already Done!)**
- The `netlify.toml` file I created should work
- But Netlify might still try npm install first
- Try deploying again - it might work now

**Option B: Contact Netlify Support**
- They can help you configure it
- Or check if there's a UI update

**Option C: Try Railway Instead**
- Railway.app handles pnpm workspaces better
- I can help you switch if you want

## Quick Test

After setting the build command:
1. Click **"Save"** or **"Update settings"**
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**
4. Watch the build logs

Let me know what you see in your Netlify dashboard and I'll guide you further!


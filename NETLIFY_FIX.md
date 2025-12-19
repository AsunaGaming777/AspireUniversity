# 🔧 CRITICAL: Fix Netlify Build Settings

Netlify is trying to use `npm` instead of `pnpm`. You **MUST** configure this in the Netlify dashboard.

## ⚠️ REQUIRED: Manual Configuration in Netlify Dashboard

1. Go to your Netlify site dashboard
2. Click **Site settings** → **Build & deploy** → **Build settings**
3. Scroll down to **"Dependency installation"** or find **"Install command"**
4. **Set the Install command to:**
   ```
   corepack enable && corepack prepare pnpm@8.9.0 --activate && pnpm install --frozen-lockfile
   ```
5. **Set the Build command to:**
   ```
   pnpm --filter aspire-academy db:generate && pnpm --filter aspire-academy build
   ```
6. **Verify:**
   - Base directory: `.` (root)
   - Publish directory: `apps/site/.next`
   - Node version: `20`
7. **SAVE** and trigger a new deploy

## ✅ What I Fixed in the Code

1. ✅ Removed duplicate exports in `test-auth/page.tsx`
2. ✅ Removed duplicate exports in `admin/ops/students/page.tsx`
3. ✅ Updated `netlify.toml` with proper pnpm commands
4. ✅ Created `.npmrc` to help with package management
5. ✅ Updated build script with better error handling

## 🚨 Why This Is Required

Netlify automatically detects `package.json` and tries to run `npm install` **BEFORE** your build command. This fails because:
- Your project uses `pnpm` with `workspace:*` protocol
- `npm` doesn't understand `workspace:*` protocol
- We need to tell Netlify to use `pnpm` instead

## 📝 Alternative: If Install Command Field Doesn't Exist

If you don't see an "Install command" field:

1. Go to **Build & deploy** → **Continuous Deployment**
2. Click **"Edit settings"**
3. Look for **"Build command"** and set it to:
   ```
   corepack enable && corepack prepare pnpm@8.9.0 --activate && pnpm install --frozen-lockfile && pnpm --filter aspire-academy db:generate && pnpm --filter aspire-academy build
   ```
4. This combines install + build in one command

## ✅ After Configuration

Once you've set this up:
1. Commit and push your changes (the fixed files)
2. Netlify will auto-deploy OR manually trigger a deploy
3. The build should now succeed! 🎉


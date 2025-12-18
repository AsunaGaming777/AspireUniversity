# Database Setup Guide

## Option 1: Neon (Recommended - Easiest)

1. Go to https://neon.tech and sign up for a free account
2. Click "Create Project"
3. Name it "aspire-academy" (or any name you prefer)
4. Copy the connection string (it will look like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)
5. Add it to your `.env` file (see below)

## Option 2: Supabase

1. Go to https://supabase.com and sign up for a free account
2. Click "New Project"
3. Fill in project details
4. Go to Settings > Database
5. Copy the connection string under "Connection string" > "URI"
6. Add it to your `.env` file

## Setting Up Your .env File

Create a `.env` file in `apps/site/` with:

```env
# Database (replace with your connection string from Neon or Supabase)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Other required vars (you can add these later)
NODE_ENV="development"
```

## After Setting Up Database

1. Run migrations:
   ```bash
   cd apps/site
   npx prisma migrate dev --name init
   ```

2. Seed the database:
   ```bash
   npm run db:seed
   ```

3. Restart your dev server

## Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32


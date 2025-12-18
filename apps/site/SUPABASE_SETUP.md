# Supabase Database Setup

## Get Your Database Connection String

1. Go to your Supabase project: https://supabase.com/dashboard/project/anbnlqvsendwnmwvdoqs
2. Click on **Settings** (gear icon in the left sidebar)
3. Click on **Database**
4. Scroll down to **Connection string** section
5. Select **URI** tab
6. Copy the connection string (it will look like: `postgresql://postgres.anbnlqvsendwnmwvdoqs:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`)

## Or Get the Password

If you need to reset/get the database password:
1. Go to Settings > Database
2. Look for "Database password" section
3. Click "Reset database password" if needed
4. Copy the password

## Update .env File

Once you have the connection string, update your `.env` file:

```env
DATABASE_URL="your-connection-string-here"
DIRECT_URL="your-connection-string-here"
```

Then run:
```bash
cd apps/site
npx prisma migrate dev --name init
npm run db:seed
```

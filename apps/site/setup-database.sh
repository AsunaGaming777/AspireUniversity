#!/bin/bash

echo "🚀 Aspire Academy Database Setup"
echo "================================"
echo ""
echo "This script will help you set up a free PostgreSQL database."
echo ""
echo "Please choose your database provider:"
echo "1) Neon (Recommended - Easiest setup)"
echo "2) Supabase"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "📝 Steps to set up Neon:"
    echo "1. Go to https://neon.tech"
    echo "2. Sign up for a free account"
    echo "3. Click 'Create Project'"
    echo "4. Name it 'aspire-academy'"
    echo "5. Copy the connection string"
    echo ""
    read -p "Paste your Neon connection string here: " neon_url
    
    if [ -z "$neon_url" ]; then
        echo "❌ No connection string provided. Exiting."
        exit 1
    fi
    
    # Update .env file
    if [ -f ".env" ]; then
        # Backup existing .env
        cp .env .env.backup
        echo "✅ Backed up existing .env to .env.backup"
    fi
    
    # Update DATABASE_URL and DIRECT_URL
    if grep -q "DATABASE_URL=" .env 2>/dev/null; then
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$neon_url\"|" .env
        sed -i '' "s|DIRECT_URL=.*|DIRECT_URL=\"$neon_url\"|" .env
    else
        echo "DATABASE_URL=\"$neon_url\"" >> .env
        echo "DIRECT_URL=\"$neon_url\"" >> .env
    fi
    
    echo "✅ Updated .env with Neon connection string"
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "📝 Steps to set up Supabase:"
    echo "1. Go to https://supabase.com"
    echo "2. Sign up for a free account"
    echo "3. Click 'New Project'"
    echo "4. Fill in project details"
    echo "5. Go to Settings > Database"
    echo "6. Copy the connection string under 'Connection string' > 'URI'"
    echo ""
    read -p "Paste your Supabase connection string here: " supabase_url
    
    if [ -z "$supabase_url" ]; then
        echo "❌ No connection string provided. Exiting."
        exit 1
    fi
    
    # Update .env file
    if [ -f ".env" ]; then
        cp .env .env.backup
        echo "✅ Backed up existing .env to .env.backup"
    fi
    
    # Update DATABASE_URL and DIRECT_URL
    if grep -q "DATABASE_URL=" .env 2>/dev/null; then
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$supabase_url\"|" .env
        sed -i '' "s|DIRECT_URL=.*|DIRECT_URL=\"$supabase_url\"|" .env
    else
        echo "DATABASE_URL=\"$supabase_url\"" >> .env
        echo "DIRECT_URL=\"$supabase_url\"" >> .env
    fi
    
    echo "✅ Updated .env with Supabase connection string"
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server"
echo "2. Try creating an account again"
echo ""


#!/bin/bash

echo "🔧 Updating Database Connection"
echo "================================"
echo ""
echo "Paste your Supabase PostgreSQL connection string below:"
echo "(It should start with postgresql://)"
echo ""
read -p "Connection string: " db_url

if [ -z "$db_url" ]; then
    echo "❌ No connection string provided. Exiting."
    exit 1
fi

# Update .env file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Backup
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backed up .env file"

# Update DATABASE_URL
if grep -q "^DATABASE_URL=" .env; then
    # Use a different sed command for macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|" .env
        sed -i '' "s|^DIRECT_URL=.*|DIRECT_URL=\"$db_url\"|" .env
    else
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|" .env
        sed -i "s|^DIRECT_URL=.*|DIRECT_URL=\"$db_url\"|" .env
    fi
else
    echo "DATABASE_URL=\"$db_url\"" >> .env
    echo "DIRECT_URL=\"$db_url\"" >> .env
fi

echo "✅ Updated DATABASE_URL and DIRECT_URL in .env"
echo ""
echo "Next steps:"
echo "1. Run: npx prisma migrate dev --name init"
echo "2. Run: npm run db:seed"
echo "3. Restart your dev server"
echo ""


#!/bin/bash
# Remove old DATABASE_URL and DIRECT_URL lines
grep -v "^DATABASE_URL=" .env | grep -v "^DIRECT_URL=" > .env.tmp
mv .env.tmp .env

# Add new connection strings with postgres username (not postgres.project)
cat >> .env << 'EOF'

# Supabase Database Connection
DATABASE_URL="postgresql://postgres:QYVL%26%23dFH_2%24t%24%40@db.anbnlqvsendwnmwvdoqs.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:QYVL%26%23dFH_2%24t%24%40@db.anbnlqvsendwnmwvdoqs.supabase.co:5432/postgres"
EOF
echo "✅ Updated connection strings with postgres username"

#!/bin/bash

# Auto-fix database connection script
# This script detects the working database port and updates .env files

echo "🔍 Detecting database connection..."

# Find .env files
ENV_FILE=""
if [ -f "apps/site/.env.local" ]; then
  ENV_FILE="apps/site/.env.local"
elif [ -f "apps/site/.env" ]; then
  ENV_FILE="apps/site/.env"
elif [ -f ".env.local" ]; then
  ENV_FILE=".env.local"
elif [ -f ".env" ]; then
  ENV_FILE=".env"
fi

if [ -z "$ENV_FILE" ]; then
  echo "❌ No .env file found"
  exit 1
fi

echo "📄 Found env file: $ENV_FILE"

# Extract current DATABASE_URL
CURRENT_URL=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$CURRENT_URL" ]; then
  echo "❌ DATABASE_URL not found in $ENV_FILE"
  exit 1
fi

echo "🔗 Current DATABASE_URL: ${CURRENT_URL:0:50}..."

# Extract host and try both ports
HOST=$(echo "$CURRENT_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
if [ -z "$HOST" ]; then
  HOST=$(echo "$CURRENT_URL" | sed -n 's/.*@\([^/]*\).*/\1/p')
fi

echo "🌐 Testing connection to $HOST..."

# Function to test port
test_port() {
  local port=$1
  timeout 3 bash -c "echo > /dev/tcp/$HOST/$port" 2>/dev/null
  return $?
}

# Test ports
PORT_6543_WORKS=false
PORT_5432_WORKS=false

if test_port 6543; then
  PORT_6543_WORKS=true
  echo "✅ Port 6543 (pooler) is accessible"
else
  echo "❌ Port 6543 (pooler) is not accessible"
fi

if test_port 5432; then
  PORT_5432_WORKS=true
  echo "✅ Port 5432 (direct) is accessible"
else
  echo "❌ Port 5432 (direct) is not accessible"
fi

# Determine which port to use
if [ "$PORT_6543_WORKS" = true ]; then
  USE_PORT=6543
  USE_TYPE="pooler"
elif [ "$PORT_5432_WORKS" = true ]; then
  USE_PORT=5432
  USE_TYPE="direct"
else
  echo "⚠️  Neither port is accessible. Network may be blocking connections."
  echo "💡 Try:"
  echo "   1. Check your network/firewall settings"
  echo "   2. Verify Supabase project is active"
  echo "   3. Check if VPN is required"
  exit 1
fi

echo ""
echo "🎯 Using port $USE_PORT ($USE_TYPE)"

# Update DATABASE_URL
NEW_URL=$(echo "$CURRENT_URL" | sed "s/:[0-9]*\//:$USE_PORT\//")
NEW_DIRECT_URL=$(echo "$CURRENT_URL" | sed "s/:[0-9]*\//:5432\//")

# Update .env file
if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
  sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"$NEW_URL\"|" "$ENV_FILE"
else
  echo "DATABASE_URL=\"$NEW_URL\"" >> "$ENV_FILE"
fi

if grep -q "^DIRECT_URL=" "$ENV_FILE"; then
  sed -i.bak "s|^DIRECT_URL=.*|DIRECT_URL=\"$NEW_DIRECT_URL\"|" "$ENV_FILE"
else
  echo "DIRECT_URL=\"$NEW_DIRECT_URL\"" >> "$ENV_FILE"
fi

echo "✅ Updated $ENV_FILE"
echo "📝 DATABASE_URL now uses port $USE_PORT"
echo "📝 DIRECT_URL set to port 5432"
echo ""
echo "🔄 Please restart your development server"


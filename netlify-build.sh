#!/bin/bash
set -e

echo "🚀 Starting Netlify build with pnpm..."

# Enable corepack and activate pnpm
echo "📦 Setting up pnpm..."
corepack enable
corepack prepare pnpm@8.9.0 --activate

# Verify pnpm is working
pnpm --version

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install --frozen-lockfile

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm --filter aspire-academy db:generate

# Build the application
echo "🏗️  Building application..."
pnpm --filter aspire-academy build

echo "✅ Build complete!"


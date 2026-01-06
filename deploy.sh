#!/bin/bash

# Deployment script for SecondLooks Backend

echo "🚀 Starting deployment..."

# Exit on error
set -e

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Build TypeScript
echo "🏗️  Building TypeScript..."
npm run build

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 reload ecosystem.config.js --env production

echo "✅ Deployment completed successfully!"

#!/bin/bash
set -euo pipefail

DATABASE_URL="${DATABASE_URL:-postgresql://retail:retail123@localhost:5432/retail_db}"

echo "🔄 Running migrations..."
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🌱 Running seed..."
DATABASE_URL="$DATABASE_URL" npx tsx prisma/seed.ts

echo "✅ Done!"

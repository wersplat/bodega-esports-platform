#!/bin/bash

# Check if frontend-related files are staged
CHANGED=$(git diff --cached --name-only | grep -E '^frontend/(pages|components|img|public|hooks|theme\.css|index\.css|supabaseClient\.js)|^vite\.config\.js$')

if [ -z "$CHANGED" ]; then
  echo "✅ No frontend-related changes staged — skipping build."
  exit 0
fi

echo "🧠 Frontend changes detected:"
echo "$CHANGED"

echo "▶️  Building frontend..."
cd frontend || { echo "❌ frontend folder not found"; exit 1; }

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install || { echo "❌ npm install failed"; exit 1; }
fi

# Run Vite build
npm run build || { echo "❌ vite build failed"; exit 1; }

# Confirm dist/index.html exists
if [ ! -f "dist/index.html" ]; then
  echo "❌ dist/index.html missing. Build likely failed."
  exit 1
fi

cd ..

echo "✅ Build complete. Staging frontend output and related files..."

# Always stage dist
git add frontend/dist

# Also stage modified frontend sources
git ls-files -mo --exclude-standard | grep -E 'frontend/pages/.*\.jsx|frontend/components/.*\.jsx|frontend/theme.css|frontend/index.css|frontend/img/|frontend/public/|frontend/supabaseClient.js|vite.config.js' | xargs git add 2>/dev/null

# Show status
echo "✔️ Git status:"
git status

# Suggested commit message
echo "💡 Suggested commit:"
echo "git commit -m 'Frontend rebuild: update components and dist'"

# Cloudways reminder
echo ""
echo "🚀 Cloudways deploy reminder:"
echo "After pushing to GitHub, pull changes from Git panel on Cloudways."

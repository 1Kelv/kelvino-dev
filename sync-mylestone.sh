#!/bin/bash
set -e

KELVINO_REPO="https://github.com/1Kelv/kelvino-dev.git"
KELVINO_BRANCH="claude/mylestone-standalone-repo-FyPFP"
FILES=(
  "src/lib/AuthContext.tsx"
  "src/lib/BabyContext.tsx"
  "src/pages/HomePage.tsx"
  "src/pages/ProfilePage.tsx"
  "src/types/index.ts"
)

echo "🔍 Finding mylestone repo..."
# Try common locations
for dir in ~/mylestone ~/Documents/mylestone ~/code/mylestone ~/projects/mylestone; do
  if [ -d "$dir/.git" ]; then
    MYLESTONE_DIR="$dir"
    break
  fi
done

if [ -z "$MYLESTONE_DIR" ]; then
  echo "❌ Could not find mylestone repo. Cloning it..."
  git clone https://github.com/1Kelv/mylestone.git ~/mylestone
  MYLESTONE_DIR=~/mylestone
fi

echo "📂 Using mylestone at: $MYLESTONE_DIR"
cd "$MYLESTONE_DIR"

git pull origin main 2>/dev/null || true

echo "📥 Fetching latest from kelvino-dev..."
git remote add kd "$KELVINO_REPO" 2>/dev/null || git remote set-url kd "$KELVINO_REPO"
git fetch kd "$KELVINO_BRANCH"

echo "📋 Applying updated files..."
for f in "${FILES[@]}"; do
  git checkout "kd/$KELVINO_BRANCH" -- "$f"
  echo "  ✓ $f"
done

echo "💾 Committing..."
git add "${FILES[@]}"
git commit -m "Sync: JWT auth fix, shared baby accounts, relationship field" || echo "Nothing to commit"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Done! Vercel will redeploy in ~30 seconds."

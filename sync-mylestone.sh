#!/bin/bash
set -e

KELVINO_REPO="https://github.com/1Kelv/kelvino-dev.git"
KELVINO_BRANCH="claude/mylestone-standalone-repo-FyPFP"

# All Mylestone app files (excludes portfolio components on main branch)
FILES=(
  # Root config
  "vite.config.ts"
  "vercel.json"
  "package.json"
  "package-lock.json"
  "index.html"

  # App entry
  "src/main.tsx"
  "src/App.tsx"
  "src/index.css"
  "src/sw.ts"

  # Types
  "src/types/index.ts"

  # Lib
  "src/lib/appwrite.ts"
  "src/lib/AuthContext.tsx"
  "src/lib/BabyContext.tsx"
  "src/lib/ThemeContext.tsx"
  "src/lib/db.ts"
  "src/lib/utils.ts"
  "src/lib/pushSubscription.ts"

  # Hooks
  "src/hooks/useAppointments.ts"
  "src/hooks/useBaby.ts"
  "src/hooks/useFeeds.ts"
  "src/hooks/useGrowth.ts"
  "src/hooks/useHospitalStays.ts"
  "src/hooks/useMedications.ts"
  "src/hooks/useMilestones.ts"
  "src/hooks/useNappies.ts"
  "src/hooks/useNotes.ts"
  "src/hooks/useNotificationReminders.ts"
  "src/hooks/useSleep.ts"
  "src/hooks/useSymptoms.ts"

  # Data
  "src/data/whoGrowthData.ts"
  "src/data/nameData.ts"

  # Pages
  "src/pages/AiPage.tsx"
  "src/pages/AppointmentsPage.tsx"
  "src/pages/FeedbackPage.tsx"
  "src/pages/FeedsPage.tsx"
  "src/pages/ForgotPasswordPage.tsx"
  "src/pages/GrowthPage.tsx"
  "src/pages/HomePage.tsx"
  "src/pages/HospitalPage.tsx"
  "src/pages/LandingPage.tsx"
  "src/pages/LoginPage.tsx"
  "src/pages/MedicationsPage.tsx"
  "src/pages/NappiesPage.tsx"
  "src/pages/NotesPage.tsx"
  "src/pages/OnboardingPage.tsx"
  "src/pages/ProfilePage.tsx"
  "src/pages/RegisterPage.tsx"
  "src/pages/ResetPasswordPage.tsx"
  "src/pages/SleepPage.tsx"
  "src/pages/SymptomsPage.tsx"
  "src/pages/TimelinePage.tsx"
  "src/pages/VerifyEmailPage.tsx"

  # Layout components
  "src/components/layout/AppShell.tsx"
  "src/components/layout/BottomNav.tsx"
  "src/components/layout/FAB.tsx"
  "src/components/layout/PageHeader.tsx"

  # UI components
  "src/components/ui/Badge.tsx"
  "src/components/ui/Button.tsx"
  "src/components/ui/DateNavigator.tsx"
  "src/components/ui/EmptyState.tsx"
  "src/components/ui/EntryDetailModal.tsx"
  "src/components/ui/Input.tsx"
  "src/components/ui/LogItem.tsx"
  "src/components/ui/MHeartIcon.tsx"
  "src/components/ui/MilestoneCelebration.tsx"
  "src/components/ui/Modal.tsx"
  "src/components/ui/NameMeaningCard.tsx"
  "src/components/ui/Select.tsx"
  "src/components/ui/StatCard.tsx"
  "src/components/ui/TrendInsightsCard.tsx"

  # Feature components
  "src/components/appointments/AppointmentForm.tsx"
  "src/components/appointments/AppointmentList.tsx"
  "src/components/auth/LoginForm.tsx"
  "src/components/auth/RegisterForm.tsx"
  "src/components/feedback/FeedbackForm.tsx"
  "src/components/feeds/FeedForm.tsx"
  "src/components/feeds/FeedList.tsx"
  "src/components/growth/GrowthChart.tsx"
  "src/components/growth/GrowthForm.tsx"
  "src/components/growth/GrowthList.tsx"
  "src/components/hospital/HospitalStayForm.tsx"
  "src/components/medications/MedicationForm.tsx"
  "src/components/medications/MedicationList.tsx"
  "src/components/nappies/NappyForm.tsx"
  "src/components/nappies/NappyList.tsx"
  "src/components/notes/NoteForm.tsx"
  "src/components/notes/NoteList.tsx"
  "src/components/notifications/NotificationSettings.tsx"
  "src/components/reports/BabyReport.tsx"
  "src/components/reports/ExportModal.tsx"
  "src/components/sleep/SleepForm.tsx"
  "src/components/sleep/SleepList.tsx"
  "src/components/symptoms/SymptomForm.tsx"
  "src/components/symptoms/SymptomList.tsx"
  "src/components/timeline/MilestoneForm.tsx"

  # API (Vercel serverless)
  "api/analyze.ts"
  "api/send-reminders.ts"
)

echo "🔍 Finding mylestone repo..."
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

echo "📥 Fetching latest from kelvino-dev ($KELVINO_BRANCH)..."
git remote add kd "$KELVINO_REPO" 2>/dev/null || git remote set-url kd "$KELVINO_REPO"
git fetch kd "$KELVINO_BRANCH"

echo "📋 Applying updated files..."
for f in "${FILES[@]}"; do
  # Create parent directory if needed
  mkdir -p "$(dirname "$f")"
  git checkout "kd/$KELVINO_BRANCH" -- "$f" 2>/dev/null && echo "  ✓ $f" || echo "  ⚠ skipped (not found): $f"
done

echo "💾 Committing..."
git add "${FILES[@]}" 2>/dev/null || true
git commit -m "Sync from kelvino-dev: $(date '+%Y-%m-%d %H:%M')" || echo "Nothing to commit"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Done! Vercel will redeploy in ~30 seconds."

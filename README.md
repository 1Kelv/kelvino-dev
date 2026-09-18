# Mylestone

*Every milestone, remembered.*

A production-ready Progressive Web App for tracking a baby's health and care — built specifically for parents of medically complex infants, including babies with Tetralogy of Fallot (ToF) and other congenital heart conditions. Alongside day-to-day logging, Mylestone includes **Mylo**, an AI health companion, and a dedicated **Hospital Mode** for admissions and surgery.

## Features

### Daily care tracking
- **8 tracking modules**: Feeds, Nappies, Medications, Growth, Symptoms, Sleep, Appointments, Notes
- **Multi-baby support**: every entry is tied to a `babyId` — add and switch between baby profiles, each with name, date of birth, gender, and diagnosis
- **ToF-specific symptom tracking**: skin colour, breathing, energy level, feeding, temperature, heart rate, and SpO2 — key clinical indicators for cardiac infants
- **Growth charts**: weight and length plotted over time using Recharts
- **Journey / Milestones**: a timeline of medical, emotional, developmental, and achievement milestones, each with its own emoji
- **Notes**: rich note-taking with markdown support (headings, bold, bullet lists) rendered properly in the note viewer

### Mylo — AI Health Companion
- Chat interface for parents to ask health questions, analyse photos (rashes, skin changes, etc.), and get plain-English summaries of medical documents (discharge letters, prescriptions, specialist reports)
- **Personalised**: every response is grounded in the selected baby's name, age, gender, and known diagnosis, plus the parent's name
- **Persistent chat history**: conversations are saved per baby and can be revisited, renamed by their first message, or deleted
- Supports image and PDF uploads (up to 5 files per message)
- Per-user daily message limit to keep API usage predictable
- Built on the Anthropic API (Claude)

### Hospital Mode
A dedicated space for admissions and surgery, separate from day-to-day tracking:
- **Phase Tracker**: pre-op → surgery → PICU → ward → home, with a visual stepper
- **Recovery Timeline**: day-by-day log of progress relative to the admission date
- **Care Team**: contacts (consultants, nurses, specialists) with tap-to-call phone links
- **Round Questions**: a running checklist of questions to ask on the next ward round
- Supports both current admissions and **upcoming/confirmed future admissions** (e.g. a scheduled surgery date), with distinct UI for each
- Discharge checklist and stay notes

### Parent Insights
A weekly, plain-language summary card on the home screen reflecting on the last 7 days — feeding consistency, hydration, medication adherence, and appointment attendance — designed to reassure, not just report numbers.

### Reports & sharing
- **PDF export**: generate a shareable report (7/30/90-day range) covering feeds, nappies, medications, symptoms, growth, sleep, and appointments — useful for consultant visits
- **Push notifications**: opt-in reminders (e.g. medication times) via the Web Push API

### Platform
- **Mobile-first PWA**: installable ("Add to Home Screen"), offline-capable, bottom sheet modals, FAB on every page, scrollable bottom navigation
- **Light/dark mode**
- **Secure auth**: powered by Appwrite Cloud — email/password authentication, email verification, password reset, per-user data isolation

## Tech Stack

| Area | Technology |
|------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| PWA | vite-plugin-pwa + Workbox |
| Backend | Appwrite Cloud |
| AI | Anthropic API (`@anthropic-ai/sdk`) |
| Charts | Recharts |
| PDF export | `@react-pdf/renderer` |
| Push notifications | `web-push` |
| Markdown rendering | `react-markdown` + `remark-gfm` |
| Routing | React Router v6 |
| Dates | date-fns |
| Icons | Lucide React |
| Fonts | Nunito + DM Sans |
| Hosting | Vercel |

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd mylestone
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

**Client-side (`VITE_` prefixed, safe to expose in the browser bundle):**

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_BABIES=babies
VITE_APPWRITE_COLLECTION_FEEDS=feeds
VITE_APPWRITE_COLLECTION_NAPPIES=nappies
VITE_APPWRITE_COLLECTION_MEDICATIONS=medications
VITE_APPWRITE_COLLECTION_GROWTH=growth
VITE_APPWRITE_COLLECTION_SYMPTOMS=symptoms
VITE_APPWRITE_COLLECTION_SLEEP=sleep
VITE_APPWRITE_COLLECTION_APPOINTMENTS=appointments
VITE_APPWRITE_COLLECTION_NOTES=notes
VITE_APPWRITE_COLLECTION_FEEDBACK=feedback
VITE_APPWRITE_COLLECTION_MILESTONES=milestones
VITE_APPWRITE_COLLECTION_HOSPITAL_STAYS=hospital_stays
VITE_APPWRITE_COLLECTION_PUSH_SUBSCRIPTIONS=push_subscriptions
VITE_APPWRITE_COLLECTION_AI_CHATS=ai_chats
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
```

**Server-side (Vercel serverless functions only — set these in the Vercel dashboard, never commit them):**

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
APPWRITE_API_KEY=your_appwrite_server_api_key
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_COLLECTION_AI_USAGE=ai_usage
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=admin@yourdomain.com
CRON_SECRET=a_random_secret_for_the_reminders_cron
```

### 3. Set up Appwrite

In your Appwrite Cloud project:

1. Create a **Database** and note its ID
2. Create the following **Collections** (with document-level security enabled):
   - `babies` — name, dateOfBirth, userId, gender, diagnosis, nhsNumber, shareCode, sharedWith
   - `feeds` — babyId, userId, datetime, amountMl, bottleAmountMl, type, feedBehaviour, durationMins, notes
   - `nappies` — babyId, userId, datetime, kind, notes
   - `medications` — babyId, userId, datetime, medicationName, dose, unit, route, administeredBy, notes, reminderTime
   - `growth` — babyId, userId, date, weightKg, weightLbs, lengthCm, headCircumferenceCm, notes
   - `symptoms` — babyId, userId, datetime, skinColour, energyLevel, breathing, feedingWell, temperatureC, heartRate, spO2, notes
   - `sleep` — babyId, userId, date, sleepStart, sleepEnd, durationMins, wakeCount, moodRating, notes
   - `appointments` — babyId, userId, datetime, hospitalName, department, consultantName, location, notes, status
   - `notes` — babyId, userId, title, body, category, date
   - `feedback` — userId, userEmail, category, subject, message
   - `milestones` — babyId, userId, datetime, title, description, category, emoji
   - `hospital_stays` — babyId, userId, admittedDate, dischargeDate, hospital, ward, reason, surgeryDate, surgeryName, notes, checklistJson, phase *(note: this collection is at Appwrite's free-tier 15-column limit — recovery timeline, care team, and round questions are packed into `checklistJson` as a combined JSON blob rather than separate columns)*
   - `push_subscriptions` — userId, babyId, endpoint, p256dh, auth
   - `ai_chats` — userId, babyId, title, messages (per-baby Mylo conversation history)
   - `ai_usage` — userId, date, count (server-side only, used to enforce the daily Mylo message limit)
3. Add your app's domain to **Platforms** in Appwrite console
4. Create a **server API key** (Settings → API Keys) with database read/write scope for the collections above — used by the serverless functions for Mylo's usage limiting and the reminders cron

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

1. Push to GitHub
2. Connect the repo to Vercel
3. Set environment variables in the Vercel dashboard — both the `VITE_` client vars and the server-only vars listed above
4. Deploy — Vercel handles SPA routing via `vercel.json`, serverless functions in `api/`, and a daily cron job (`api/send-reminders`) for push reminders

## Project Structure

```
api/
├── analyze.ts         # Mylo AI endpoint — Anthropic API + per-user rate limiting
└── send-reminders.ts  # Daily cron — medication push reminders via web-push

src/
├── components/
│   ├── auth/           # LoginForm, RegisterForm
│   ├── layout/          # AppShell, BottomNav, FAB, PageHeader
│   ├── ui/               # Button, Modal, Input, Select, Badge, StatCard, LogItem, EntryDetailModal, EmptyState, TrendInsightsCard...
│   ├── home/            # ParentInsightsCard
│   ├── hospital/        # PhaseTracker, CareTeamSection, RecoveryTimeline, RoundQuestions, HospitalStayForm
│   ├── timeline/         # MilestoneForm
│   ├── notifications/   # NotificationSettings
│   ├── reports/          # ExportModal, BabyReport (PDF)
│   ├── feeds/ nappies/ medications/ growth/ symptoms/ sleep/ appointments/ notes/  # per-module Form + List components
│   └── feedback/         # FeedbackForm
├── hooks/                # useFeeds, useNappies, useMedications, useGrowth, useSymptoms, useSleep,
│                          # useAppointments, useNotes, useMilestones, useHospitalStays, useBaby,
│                          # useNotificationReminders
├── lib/                  # appwrite.ts, db.ts, AuthContext.tsx, BabyContext.tsx, ThemeContext.tsx,
│                          # pushSubscription.ts, utils.ts
├── pages/                 # HomePage, FeedsPage, NappiesPage, MedicationsPage, GrowthPage, SymptomsPage,
│                           # SleepPage, AppointmentsPage, NotesPage, TimelinePage, HospitalPage, AiPage,
│                           # ProfilePage, FeedbackPage, LandingPage, LoginPage, RegisterPage,
│                           # ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage, OnboardingPage
└── types/                 # index.ts — all TypeScript interfaces
```

## Brand Colours

| Name | Hex |
|------|-----|
| Mint (primary) | `#4ECDC4` |
| Sky | `#45B7D1` |
| Light (bg) | `#E8F8F7` |
| Dark (hover) | `#2A9D8F` |

Headings use **Nunito**, body text uses **DM Sans**.

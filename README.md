# Mylestone

A production-ready Progressive Web App for tracking baby care — built specifically for parents of medically complex infants, including babies with Tetralogy of Fallot (ToF) and other congenital heart conditions.

## Features

- **8 tracking modules**: Feeds, Nappies, Medications, Growth, Symptoms, Sleep, Appointments, Notes
- **Multi-baby support**: Every entry tied to a `babyId` — add and switch between baby profiles
- **Mobile-first PWA**: Installable, offline-capable, bottom sheet modals, FAB on every page, horizontally scrollable bottom nav
- **ToF-specific**: Symptom tracking covers skin colour, breathing, energy level, and feeding — key clinical indicators for cardiac infants
- **Secure auth**: Powered by Appwrite Cloud — email/password authentication, per-user data isolation
- **Growth charts**: Weight and length plotted over time using Recharts
- **Appointment management**: Track hospital, department, and consultant name

## Tech Stack

| Area | Technology |
|------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 4 |
| Styling | Tailwind CSS v3 |
| PWA | vite-plugin-pwa + Workbox |
| Backend | Appwrite Cloud |
| Charts | Recharts |
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

Edit `.env.local` with your Appwrite Cloud credentials:

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
```

### 3. Set up Appwrite

In your Appwrite Cloud project:

1. Create a **Database** and note its ID
2. Create the following **Collections** (with document-level security enabled):
   - `babies` — name, dateOfBirth, userId, gender, diagnosis
   - `feeds` — babyId, userId, datetime, amountMl, type, durationMins, notes
   - `nappies` — babyId, userId, datetime, kind, notes
   - `medications` — babyId, userId, datetime, medicationName, dose, unit, route, administeredBy, notes
   - `growth` — babyId, userId, date, weightKg, weightLbs, lengthCm, headCircumferenceCm, notes
   - `symptoms` — babyId, userId, datetime, skinColour, energyLevel, breathing, feedingWell, temperatureC, notes
   - `sleep` — babyId, userId, date, sleepStart, sleepEnd, durationMins, wakeCount, moodRating, notes
   - `appointments` — babyId, userId, datetime, hospitalName, department, consultantName, notes
   - `notes` — babyId, userId, title, body, category, date
3. Add your app's domain to **Platforms** in Appwrite console

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
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard (same as `.env.local`)
4. Deploy — Vercel handles SPA routing via `vercel.json`

## Project Structure

```
src/
├── components/
│   ├── auth/          # LoginForm, RegisterForm
│   ├── layout/        # AppShell, BottomNav, FAB, PageHeader
│   ├── ui/            # Button, Modal, Input, Select, Badge, StatCard, LogItem, EmptyState
│   ├── feeds/         # FeedForm, FeedList
│   ├── nappies/       # NappyForm, NappyList
│   ├── medications/   # MedicationForm, MedicationList
│   ├── growth/        # GrowthForm, GrowthList, GrowthChart
│   ├── symptoms/      # SymptomForm, SymptomList
│   ├── sleep/         # SleepForm, SleepList
│   ├── appointments/  # AppointmentForm, AppointmentList
│   └── notes/         # NoteForm, NoteList
├── hooks/             # useFeeds, useNappies, useMedications, useGrowth, useSymptoms, useSleep, useAppointments, useNotes, useBaby
├── lib/               # appwrite.ts, db.ts, AuthContext.tsx, BabyContext.tsx, utils.ts
├── pages/             # HomePage, FeedsPage, NappiesPage, MedicationsPage, GrowthPage, SymptomsPage, SleepPage, AppointmentsPage, NotesPage, LoginPage, RegisterPage
└── types/             # index.ts — all TypeScript interfaces
```

## Brand Colours

| Name | Hex |
|------|-----|
| Mint (primary) | `#4ECDC4` |
| Sky | `#45B7D1` |
| Light (bg) | `#E8F8F7` |
| Dark (hover) | `#2A9D8F` |

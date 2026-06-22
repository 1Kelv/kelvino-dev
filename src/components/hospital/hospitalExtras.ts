// Shared types, constants, and helpers for hospital mode extras

export interface ChecklistItem {
  title: string;
  completed: boolean;
}

export interface TimelineEntry {
  id: string;
  date: string;
  text: string;
}

export interface CareTeamMember {
  id: string;
  role: string;
  name: string;
  phone?: string;
}

export interface RoundQuestion {
  id: string;
  text: string;
  asked: boolean;
}

export interface HospitalExtras {
  checklist: ChecklistItem[];
  timeline: TimelineEntry[];
  careTeam: CareTeamMember[];
  roundQuestions: RoundQuestion[];
}

export interface Phase {
  key: string;
  label: string;
  emoji: string;
  colour: string;
  bg: string;
  border: string;
  text: string;
  mutedBg: string;
  mutedText: string;
}

export const PHASES: Phase[] = [
  {
    key: 'pre-op',
    label: 'Pre-op',
    emoji: '🟠',
    colour: 'orange',
    bg: 'bg-orange-500',
    border: 'border-orange-400',
    text: 'text-orange-700 dark:text-orange-300',
    mutedBg: 'bg-orange-100 dark:bg-orange-900/30',
    mutedText: 'text-orange-500 dark:text-orange-400',
  },
  {
    key: 'surgery',
    label: 'Surgery Day',
    emoji: '🔴',
    colour: 'red',
    bg: 'bg-red-500',
    border: 'border-red-400',
    text: 'text-red-700 dark:text-red-300',
    mutedBg: 'bg-red-100 dark:bg-red-900/30',
    mutedText: 'text-red-500 dark:text-red-400',
  },
  {
    key: 'picu',
    label: 'PICU Recovery',
    emoji: '🟡',
    colour: 'yellow',
    bg: 'bg-yellow-500',
    border: 'border-yellow-400',
    text: 'text-yellow-700 dark:text-yellow-300',
    mutedBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    mutedText: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    key: 'ward',
    label: 'Ward Recovery',
    emoji: '🔵',
    colour: 'blue',
    bg: 'bg-blue-500',
    border: 'border-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
    mutedBg: 'bg-blue-100 dark:bg-blue-900/30',
    mutedText: 'text-blue-500 dark:text-blue-400',
  },
  {
    key: 'home',
    label: 'Home Recovery',
    emoji: '🟢',
    colour: 'green',
    bg: 'bg-green-500',
    border: 'border-green-400',
    text: 'text-green-700 dark:text-green-300',
    mutedBg: 'bg-green-100 dark:bg-green-900/30',
    mutedText: 'text-green-500 dark:text-green-400',
  },
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { title: 'Medication list confirmed', completed: false },
  { title: 'Feeding plan documented', completed: false },
  { title: 'Follow-up appointments booked', completed: false },
  { title: 'Discharge letter received', completed: false },
  { title: 'Community nurse referral made', completed: false },
  { title: 'Emergency contacts noted', completed: false },
];

export function parseExtras(json: string | undefined): HospitalExtras {
  if (!json) {
    return { checklist: DEFAULT_CHECKLIST, timeline: [], careTeam: [], roundQuestions: [] };
  }
  try {
    const parsed = JSON.parse(json);
    // Backward compat: old format was a flat array of checklist items
    if (Array.isArray(parsed)) {
      return {
        checklist: parsed as ChecklistItem[],
        timeline: [],
        careTeam: [],
        roundQuestions: [],
      };
    }
    return {
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : DEFAULT_CHECKLIST,
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
      careTeam: Array.isArray(parsed.careTeam) ? parsed.careTeam : [],
      roundQuestions: Array.isArray(parsed.roundQuestions) ? parsed.roundQuestions : [],
    };
  } catch {
    return { checklist: DEFAULT_CHECKLIST, timeline: [], careTeam: [], roundQuestions: [] };
  }
}

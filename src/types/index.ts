// I define all TypeScript types for the Mylestone app

export interface Baby {
  $id: string;
  name: string;
  dateOfBirth: string;
  userId: string;
  gender?: 'male' | 'female' | 'other' | null;
  diagnosis?: string | null;
  shareCode?: string | null;
  sharedWith?: string[];
}

export interface FeedEntry {
  $id: string;
  babyId: string;
  userId: string;
  datetime: string;
  amountMl: number;
  type: 'formula' | 'breast_milk' | 'mixed';
  durationMins?: number;
  notes?: string;
}

export interface NappyEntry {
  $id: string;
  babyId: string;
  userId: string;
  datetime: string;
  kind: 'wet' | 'dirty' | 'both' | 'dry';
  notes?: string;
}

export interface MedicationEntry {
  $id: string;
  babyId: string;
  userId: string;
  datetime: string;
  medicationName: string;
  dose: number;
  unit: string;
  route: 'oral' | 'IV' | 'topical' | 'inhaled' | 'other';
  administeredBy: string;
  notes?: string;
}

export interface GrowthEntry {
  $id: string;
  babyId: string;
  userId: string;
  date: string;
  weightKg: number;
  weightLbs: number;
  lengthCm?: number;
  headCircumferenceCm?: number;
  notes?: string;
}

export interface SymptomEntry {
  $id: string;
  babyId: string;
  userId: string;
  datetime: string;
  skinColour: 'normal' | 'pale' | 'blue' | 'yellow' | 'mottled';
  energyLevel: 'normal' | 'tired' | 'very_tired' | 'unusually_active';
  breathing: 'normal' | 'fast' | 'laboured' | 'noisy';
  feedingWell: boolean;
  temperatureC?: number;
  notes?: string;
}

export interface SleepEntry {
  $id: string;
  babyId: string;
  userId: string;
  date: string;
  sleepStart: string;
  sleepEnd: string;
  durationMins: number;
  wakeCount: number;
  moodRating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface AppointmentEntry {
  $id: string;
  babyId: string;
  userId: string;
  datetime: string;
  hospitalName: string;
  department: string;
  consultantName: string;
  notes?: string;
  status?: 'attended' | 'missed';
}

export interface NoteEntry {
  $id: string;
  babyId: string;
  userId: string;
  title: string;
  body: string;
  category: 'discharge' | 'consultant' | 'general' | 'medication';
  date: string;
}


export interface FeedbackEntry {
  $id: string;
  userId: string;
  userEmail: string;
  category: 'feature_request' | 'bug_report' | 'general';
  subject: string;
  message: string;
}

// I provide a typed database service layer wrapping Appwrite
import { databases, DB_ID, COLLECTIONS, ID, Query } from './appwrite';
import type {
  FeedEntry,
  NappyEntry,
  MedicationEntry,
  GrowthEntry,
  SymptomEntry,
  SleepEntry,
  AppointmentEntry,
  NoteEntry,
} from '../types';

// I cast Appwrite documents to typed interfaces
function cast<T>(doc: Record<string, unknown>): T {
  return doc as unknown as T;
}

// Feeds
export const feedsDb = {
  list: async (babyId: string): Promise<FeedEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.FEEDS, [
      Query.equal('babyId', babyId),
      Query.orderDesc('datetime'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<FeedEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<FeedEntry, '$id'>): Promise<FeedEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.FEEDS, ID.unique(), data);
    return cast<FeedEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.FEEDS, id);
  },
};

// Nappies
export const nappiesDb = {
  list: async (babyId: string): Promise<NappyEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.NAPPIES, [
      Query.equal('babyId', babyId),
      Query.orderDesc('datetime'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<NappyEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<NappyEntry, '$id'>): Promise<NappyEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.NAPPIES, ID.unique(), data);
    return cast<NappyEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.NAPPIES, id);
  },
};

// Medications
export const medicationsDb = {
  list: async (babyId: string): Promise<MedicationEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.MEDICATIONS, [
      Query.equal('babyId', babyId),
      Query.orderDesc('datetime'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<MedicationEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<MedicationEntry, '$id'>): Promise<MedicationEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.MEDICATIONS, ID.unique(), data);
    return cast<MedicationEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.MEDICATIONS, id);
  },
};

// Growth
export const growthDb = {
  list: async (babyId: string): Promise<GrowthEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.GROWTH, [
      Query.equal('babyId', babyId),
      Query.orderDesc('date'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<GrowthEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<GrowthEntry, '$id'>): Promise<GrowthEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.GROWTH, ID.unique(), data);
    return cast<GrowthEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.GROWTH, id);
  },
};

// Symptoms
export const symptomsDb = {
  list: async (babyId: string): Promise<SymptomEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.SYMPTOMS, [
      Query.equal('babyId', babyId),
      Query.orderDesc('datetime'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<SymptomEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<SymptomEntry, '$id'>): Promise<SymptomEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.SYMPTOMS, ID.unique(), data);
    return cast<SymptomEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.SYMPTOMS, id);
  },
};

// Sleep
export const sleepDb = {
  list: async (babyId: string): Promise<SleepEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.SLEEP, [
      Query.equal('babyId', babyId),
      Query.orderDesc('date'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<SleepEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<SleepEntry, '$id'>): Promise<SleepEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.SLEEP, ID.unique(), data);
    return cast<SleepEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.SLEEP, id);
  },
};

// Appointments
export const appointmentsDb = {
  list: async (babyId: string): Promise<AppointmentEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.APPOINTMENTS, [
      Query.equal('babyId', babyId),
      Query.orderDesc('datetime'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<AppointmentEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<AppointmentEntry, '$id'>): Promise<AppointmentEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.APPOINTMENTS, ID.unique(), data);
    return cast<AppointmentEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.APPOINTMENTS, id);
  },
};

// Notes
export const notesDb = {
  list: async (babyId: string): Promise<NoteEntry[]> => {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.NOTES, [
      Query.equal('babyId', babyId),
      Query.orderDesc('date'),
      Query.limit(200),
    ]);
    return res.documents.map((d) => cast<NoteEntry>(d as Record<string, unknown>));
  },
  create: async (data: Omit<NoteEntry, '$id'>): Promise<NoteEntry> => {
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.NOTES, ID.unique(), data);
    return cast<NoteEntry>(doc as Record<string, unknown>);
  },
  delete: async (id: string): Promise<void> => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.NOTES, id);
  },
};

import { Client, Account, Databases, ID, Query, Permission, Role } from 'appwrite';

// Use same-origin proxy in production so cookies are first-party (fixes Mac/Safari ITP).
// Falls back to env var or direct Appwrite URL for local dev.
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT
  || `${window.location.origin}/appwrite`;

export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query, Permission, Role };

export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const COLLECTIONS = {
  BABIES: import.meta.env.VITE_APPWRITE_COLLECTION_BABIES || 'babies',
  FEEDS: import.meta.env.VITE_APPWRITE_COLLECTION_FEEDS || 'feeds',
  NAPPIES: import.meta.env.VITE_APPWRITE_COLLECTION_NAPPIES || 'nappies',
  MEDICATIONS: import.meta.env.VITE_APPWRITE_COLLECTION_MEDICATIONS || 'medications',
  GROWTH: import.meta.env.VITE_APPWRITE_COLLECTION_GROWTH || 'growth',
  SYMPTOMS: import.meta.env.VITE_APPWRITE_COLLECTION_SYMPTOMS || 'symptoms',
  SLEEP: import.meta.env.VITE_APPWRITE_COLLECTION_SLEEP || 'sleep',
  APPOINTMENTS: import.meta.env.VITE_APPWRITE_COLLECTION_APPOINTMENTS || 'appointments',
  NOTES: import.meta.env.VITE_APPWRITE_COLLECTION_NOTES || 'notes',
  FEEDBACK: import.meta.env.VITE_APPWRITE_COLLECTION_FEEDBACK || 'feedback',
  MILESTONES: import.meta.env.VITE_APPWRITE_COLLECTION_MILESTONES || 'milestones',
  HOSPITAL_STAYS: import.meta.env.VITE_APPWRITE_COLLECTION_HOSPITAL_STAYS || 'hospital_stays',
  PUSH_SUBSCRIPTIONS: import.meta.env.VITE_APPWRITE_COLLECTION_PUSH_SUBSCRIPTIONS || 'push_subscriptions',
  AI_CHATS: import.meta.env.VITE_APPWRITE_COLLECTION_AI_CHATS || 'ai_chats',
};

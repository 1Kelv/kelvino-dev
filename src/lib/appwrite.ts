import { Client, Account, Databases, ID, Query, Permission, Role } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
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
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { databases, DB_ID, COLLECTIONS, ID, Query, Permission, Role } from './appwrite';
import { useAuth } from './AuthContext';
import { Baby } from '../types';

interface BabyContextType {
  babies: Baby[];
  selectedBaby: Baby | null;
  setSelectedBaby: (baby: Baby) => void;
  loading: boolean;
  addBaby: (data: Omit<Baby, '$id'>) => Promise<Baby>;
  updateBaby: (id: string, data: Partial<Omit<Baby, '$id'>>) => Promise<void>;
  removeBaby: (id: string) => Promise<void>;
  generateShareCode: (babyId: string) => Promise<Baby>;
  joinWithCode: (code: string) => Promise<Baby>;
  refresh: () => Promise<void>;
}

const BabyContext = createContext<BabyContextType | null>(null);

const SELECTED_BABY_KEY = 'mylestone_selected_baby_id';

function makeShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBabyState] = useState<Baby | null>(null);
  const [fetchingInProgress, setFetchingInProgress] = useState(false);
  const [lastFetchedUserId, setLastFetchedUserId] = useState<string | null>(null);

  // Derived: loading is true whenever a user is present but their babies haven't
  // been fetched yet. This is synchronously correct even between renders, preventing
  // a false "no babies" state from firing before the first fetch completes.
  const loading = !!user && (user.$id !== lastFetchedUserId || fetchingInProgress);

  const fetchBabies = async () => {
    if (!user) {
      setBabies([]);
      setSelectedBabyState(null);
      setLastFetchedUserId(null);
      return;
    }
    setFetchingInProgress(true);
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.BABIES, [
        Query.or([
          Query.equal('userId', user.$id),
          Query.contains('sharedWith', user.$id),
        ]),
      ]);
      const fetchedBabies = res.documents as unknown as Baby[];
      setBabies(fetchedBabies);

      const savedId = localStorage.getItem(SELECTED_BABY_KEY);
      const found = fetchedBabies.find((b) => b.$id === savedId);
      setSelectedBabyState(found || fetchedBabies[0] || null);
    } catch {
      setBabies([]);
    } finally {
      setLastFetchedUserId(user.$id);
      setFetchingInProgress(false);
    }
  };

  useEffect(() => {
    fetchBabies();
  }, [user]);

  const setSelectedBaby = (baby: Baby) => {
    setSelectedBabyState(baby);
    localStorage.setItem(SELECTED_BABY_KEY, baby.$id);
  };

  const addBaby = async (data: Omit<Baby, '$id'>): Promise<Baby> => {
    const perms = [
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ];
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.BABIES, ID.unique(), data, perms);
    const baby = doc as unknown as Baby;
    setBabies((prev) => [...prev, baby]);
    setSelectedBaby(baby);
    return baby;
  };

  const updateBaby = async (id: string, data: Partial<Omit<Baby, '$id'>>) => {
    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.BABIES, id, data);
    const updated = doc as unknown as Baby;
    setBabies((prev) => prev.map((b) => (b.$id === id ? updated : b)));
    if (selectedBaby?.$id === id) setSelectedBabyState(updated);
  };

  const removeBaby = async (id: string) => {
    await databases.deleteDocument(DB_ID, COLLECTIONS.BABIES, id);
    setBabies((prev) => {
      const filtered = prev.filter((b) => b.$id !== id);
      if (selectedBaby?.$id === id) {
        const next = filtered[0] || null;
        setSelectedBabyState(next);
        if (next) localStorage.setItem(SELECTED_BABY_KEY, next.$id);
        else localStorage.removeItem(SELECTED_BABY_KEY);
      }
      return filtered;
    });
  };

  const generateShareCode = async (babyId: string): Promise<Baby> => {
    const code = makeShareCode();
    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.BABIES, babyId, { shareCode: code });
    const updated = doc as unknown as Baby;
    setBabies((prev) => prev.map((b) => (b.$id === babyId ? updated : b)));
    if (selectedBaby?.$id === babyId) setSelectedBabyState(updated);
    return updated;
  };

  const joinWithCode = async (code: string): Promise<Baby> => {
    const trimmed = code.trim().toUpperCase();
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.BABIES, [
      Query.equal('shareCode', trimmed),
    ]);
    if (res.documents.length === 0) throw new Error('INVALID_CODE');
    const baby = res.documents[0] as unknown as Baby;
    if (baby.userId === user!.$id) throw new Error('OWN_BABY');
    if (baby.sharedWith?.includes(user!.$id)) throw new Error('ALREADY_JOINED');
    const updatedSharedWith = [...(baby.sharedWith || []), user!.$id];
    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.BABIES, baby.$id, {
      sharedWith: updatedSharedWith,
    });
    const updated = doc as unknown as Baby;
    setBabies((prev) => [...prev, updated]);
    setSelectedBaby(updated);
    return updated;
  };

  return (
    <BabyContext.Provider
      value={{ babies, selectedBaby, setSelectedBaby, loading, addBaby, updateBaby, removeBaby, generateShareCode, joinWithCode, refresh: fetchBabies }}
    >
      {children}
    </BabyContext.Provider>
  );
}

export function useBabyContext() {
  const ctx = useContext(BabyContext);
  if (!ctx) throw new Error('useBabyContext must be used within BabyProvider');
  return ctx;
}

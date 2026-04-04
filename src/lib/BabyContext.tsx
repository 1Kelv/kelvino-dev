// I manage the selected baby profile and fetch baby data from Appwrite
import React, { createContext, useContext, useEffect, useState } from 'react';
import { databases, DB_ID, COLLECTIONS, ID, Query } from './appwrite';
import { useAuth } from './AuthContext';
import { Baby } from '../types';

interface BabyContextType {
  babies: Baby[];
  selectedBaby: Baby | null;
  setSelectedBaby: (baby: Baby) => void;
  loading: boolean;
  addBaby: (data: Omit<Baby, '$id'>) => Promise<Baby>;
  refresh: () => Promise<void>;
}

const BabyContext = createContext<BabyContextType | null>(null);

const SELECTED_BABY_KEY = 'mylestone_selected_baby_id';

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBabyState] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBabies = async () => {
    if (!user) {
      setBabies([]);
      setSelectedBabyState(null);
      return;
    }
    setLoading(true);
    try {
      const res = await databases.listDocuments(DB_ID, COLLECTIONS.BABIES, [
        Query.equal('userId', user.$id),
      ]);
      const fetchedBabies = res.documents as unknown as Baby[];
      setBabies(fetchedBabies);

      // I restore the previously selected baby from localStorage
      const savedId = localStorage.getItem(SELECTED_BABY_KEY);
      const found = fetchedBabies.find((b) => b.$id === savedId);
      setSelectedBabyState(found || fetchedBabies[0] || null);
    } catch {
      setBabies([]);
    } finally {
      setLoading(false);
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
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.BABIES, ID.unique(), data);
    const baby = doc as unknown as Baby;
    setBabies((prev) => [...prev, baby]);
    setSelectedBaby(baby);
    return baby;
  };

  return (
    <BabyContext.Provider
      value={{ babies, selectedBaby, setSelectedBaby, loading, addBaby, refresh: fetchBabies }}
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

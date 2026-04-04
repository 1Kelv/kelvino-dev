// I fetch and manage medication entries for a given baby
import { useState, useEffect, useCallback } from 'react';
import { medicationsDb } from '../lib/db';
import { MedicationEntry } from '../types';

interface UseMedicationsReturn {
  entries: MedicationEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<MedicationEntry, '$id'>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMedications(babyId: string | undefined): UseMedicationsReturn {
  const [entries, setEntries] = useState<MedicationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await medicationsDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load medications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addEntry = async (data: Omit<MedicationEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    const optimistic: MedicationEntry = { ...data, $id: tempId };
    setEntries((prev) => [optimistic, ...prev]);
    try {
      const created = await medicationsDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save medication entry.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await medicationsDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete medication entry.');
    }
  };

  return { entries, loading, error, addEntry, removeEntry, refresh: fetch };
}

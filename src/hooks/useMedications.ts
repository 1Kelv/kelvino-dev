import { useState, useEffect, useCallback } from 'react';
import { medicationsDb } from '../lib/db';
import { MedicationEntry } from '../types';

interface UseMedicationsReturn {
  entries: MedicationEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<MedicationEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<MedicationEntry, '$id'>>) => Promise<void>;
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

  useEffect(() => { fetch(); }, [fetch]);

  const addEntry = async (data: Omit<MedicationEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setEntries((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await medicationsDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save medication entry.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<MedicationEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await medicationsDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update medication entry.');
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

  return { entries, loading, error, addEntry, updateEntry, removeEntry, refresh: fetch };
}

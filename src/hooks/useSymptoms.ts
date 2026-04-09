// I fetch and manage symptom entries for a given baby
import { useState, useEffect, useCallback } from 'react';
import { symptomsDb } from '../lib/db';
import { SymptomEntry } from '../types';

interface UseSymptomsReturn {
  entries: SymptomEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<SymptomEntry, '$id'>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSymptoms(babyId: string | undefined): UseSymptomsReturn {
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await symptomsDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load symptom entries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addEntry = async (data: Omit<SymptomEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    const optimistic: SymptomEntry = { ...data, $id: tempId };
    setEntries((prev) => [optimistic, ...prev]);
    try {
      const created = await symptomsDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save symptom entry.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await symptomsDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete symptom entry.');
    }
  };

  return { entries, loading, error, addEntry, removeEntry, refresh: fetch };
}

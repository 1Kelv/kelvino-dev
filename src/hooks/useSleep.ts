import { useState, useEffect, useCallback } from 'react';
import { sleepDb } from '../lib/db';
import { SleepEntry } from '../types';

interface UseSleepReturn {
  entries: SleepEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<SleepEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<SleepEntry, '$id'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSleep(babyId: string | undefined): UseSleepReturn {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sleepDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load sleep entries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addEntry = async (data: Omit<SleepEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setEntries((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await sleepDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save sleep entry.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<SleepEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await sleepDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update sleep entry.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await sleepDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete sleep entry.');
    }
  };

  return { entries, loading, error, addEntry, updateEntry, removeEntry, refresh: fetch };
}

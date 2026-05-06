import { useState, useEffect, useCallback } from 'react';
import { growthDb } from '../lib/db';
import { GrowthEntry } from '../types';

interface UseGrowthReturn {
  entries: GrowthEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<GrowthEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<GrowthEntry, '$id'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useGrowth(babyId: string | undefined): UseGrowthReturn {
  const [entries, setEntries] = useState<GrowthEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await growthDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load growth entries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addEntry = async (data: Omit<GrowthEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setEntries((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await growthDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save growth entry.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<GrowthEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await growthDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update growth entry.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await growthDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete growth entry.');
    }
  };

  return { entries, loading, error, addEntry, updateEntry, removeEntry, refresh: fetch };
}

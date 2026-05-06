import { useState, useEffect, useCallback } from 'react';
import { nappiesDb } from '../lib/db';
import { NappyEntry } from '../types';

interface UseNappiesReturn {
  entries: NappyEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<NappyEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<NappyEntry, '$id'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNappies(babyId: string | undefined): UseNappiesReturn {
  const [entries, setEntries] = useState<NappyEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await nappiesDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load nappy entries. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addEntry = async (data: Omit<NappyEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setEntries((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await nappiesDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save nappy entry.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<NappyEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await nappiesDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update nappy entry.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await nappiesDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete nappy entry.');
    }
  };

  return { entries, loading, error, addEntry, updateEntry, removeEntry, refresh: fetch };
}

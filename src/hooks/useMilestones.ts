import { useState, useEffect, useCallback } from 'react';
import { milestonesDb } from '../lib/db';
import { MilestoneEntry } from '../types';

interface UseMilestonesReturn {
  entries: MilestoneEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<MilestoneEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<MilestoneEntry, '$id'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMilestones(babyId: string | undefined): UseMilestonesReturn {
  const [entries, setEntries] = useState<MilestoneEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await milestonesDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load milestones. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addEntry = async (data: Omit<MilestoneEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setEntries((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await milestonesDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save milestone.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<MilestoneEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await milestonesDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update milestone.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await milestonesDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete milestone.');
    }
  };

  return { entries, loading, error, addEntry, updateEntry, removeEntry, refresh: fetch };
}

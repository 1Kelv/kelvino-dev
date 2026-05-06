import { useState, useEffect, useCallback } from 'react';
import { feedsDb } from '../lib/db';
import { FeedEntry } from '../types';
import { isToday } from '../lib/utils';

interface WeeklyFeedStats {
  avgMlPerDay: number;
  avgFeedsPerDay: number;
}

interface UseFeedsReturn {
  entries: FeedEntry[];
  loading: boolean;
  error: string | null;
  stats: WeeklyFeedStats;
  addEntry: (data: Omit<FeedEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<FeedEntry, '$id'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFeeds(babyId: string | undefined): UseFeedsReturn {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await feedsDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load feeds. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addEntry = async (data: Omit<FeedEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setEntries((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await feedsDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save feed entry.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<FeedEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await feedsDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update feed entry.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await feedsDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete feed entry.');
    }
  };

  const stats: WeeklyFeedStats = (() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recent = entries.filter((e) => new Date(e.datetime) >= sevenDaysAgo);
    if (recent.length === 0) return { avgMlPerDay: 0, avgFeedsPerDay: 0 };
    const totalMl = recent.reduce((sum, e) => sum + e.amountMl, 0);
    return {
      avgMlPerDay: Math.round(totalMl / 7),
      avgFeedsPerDay: Math.round((recent.length / 7) * 10) / 10,
    };
  })();

  return { entries, loading, error, stats, addEntry, updateEntry, removeEntry, refresh: fetch };
}

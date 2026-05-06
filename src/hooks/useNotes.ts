import { useState, useEffect, useCallback } from 'react';
import { notesDb } from '../lib/db';
import { NoteEntry } from '../types';

interface UseNotesReturn {
  entries: NoteEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<NoteEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<NoteEntry, '$id'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotes(babyId: string | undefined): UseNotesReturn {
  const [entries, setEntries] = useState<NoteEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await notesDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addEntry = async (data: Omit<NoteEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setEntries((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await notesDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save note.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<NoteEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await notesDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update note.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await notesDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete note.');
    }
  };

  return { entries, loading, error, addEntry, updateEntry, removeEntry, refresh: fetch };
}

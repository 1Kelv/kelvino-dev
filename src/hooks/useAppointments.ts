// I fetch and manage appointment entries for a given baby
import { useState, useEffect, useCallback } from 'react';
import { appointmentsDb } from '../lib/db';
import { AppointmentEntry } from '../types';

interface UseAppointmentsReturn {
  entries: AppointmentEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (data: Omit<AppointmentEntry, '$id'>) => Promise<void>;
  updateEntry: (id: string, data: Partial<Omit<AppointmentEntry, '$id'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAppointments(babyId: string | undefined): UseAppointmentsReturn {
  const [entries, setEntries] = useState<AppointmentEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentsDb.list(babyId);
      setEntries(data);
    } catch {
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addEntry = async (data: Omit<AppointmentEntry, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    const optimistic: AppointmentEntry = { ...data, $id: tempId };
    setEntries((prev) => [optimistic, ...prev]);
    try {
      const created = await appointmentsDb.create(data);
      setEntries((prev) => prev.map((e) => (e.$id === tempId ? created : e)));
    } catch {
      setEntries((prev) => prev.filter((e) => e.$id !== tempId));
      throw new Error('Failed to save appointment.');
    }
  };

  const updateEntry = async (id: string, data: Partial<Omit<AppointmentEntry, '$id'>>) => {
    setEntries((prev) => prev.map((e) => (e.$id === id ? { ...e, ...data } : e)));
    try {
      const updated = await appointmentsDb.update(id, data);
      setEntries((prev) => prev.map((e) => (e.$id === id ? updated : e)));
    } catch {
      await fetch();
      throw new Error('Failed to update appointment.');
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.$id !== id));
    try {
      await appointmentsDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete appointment.');
    }
  };

  return { entries, loading, error, addEntry, updateEntry, removeEntry, refresh: fetch };
}

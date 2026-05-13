import { useState, useEffect, useCallback } from 'react';
import { hospitalStaysDb } from '../lib/db';
import { HospitalStay } from '../types';

interface UseHospitalStaysReturn {
  stays: HospitalStay[];
  activeStay: HospitalStay | null;
  loading: boolean;
  error: string | null;
  addStay: (data: Omit<HospitalStay, '$id'>) => Promise<void>;
  updateStay: (id: string, data: Partial<Omit<HospitalStay, '$id'>>) => Promise<void>;
  removeStay: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useHospitalStays(babyId: string | undefined): UseHospitalStaysReturn {
  const [stays, setStays] = useState<HospitalStay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!babyId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await hospitalStaysDb.list(babyId);
      setStays(data);
    } catch {
      setError('Failed to load hospital stays.');
    } finally {
      setLoading(false);
    }
  }, [babyId]);

  useEffect(() => { fetch(); }, [fetch]);

  const activeStay = stays.find((s) => !s.dischargedDate) ?? null;

  const addStay = async (data: Omit<HospitalStay, '$id'>) => {
    const tempId = `temp_${Date.now()}`;
    setStays((prev) => [{ ...data, $id: tempId }, ...prev]);
    try {
      const created = await hospitalStaysDb.create(data);
      setStays((prev) => prev.map((s) => (s.$id === tempId ? created : s)));
    } catch {
      setStays((prev) => prev.filter((s) => s.$id !== tempId));
      throw new Error('Failed to save hospital stay.');
    }
  };

  const updateStay = async (id: string, data: Partial<Omit<HospitalStay, '$id'>>) => {
    setStays((prev) => prev.map((s) => (s.$id === id ? { ...s, ...data } : s)));
    try {
      const updated = await hospitalStaysDb.update(id, data);
      setStays((prev) => prev.map((s) => (s.$id === id ? updated : s)));
    } catch {
      await fetch();
      throw new Error('Failed to update hospital stay.');
    }
  };

  const removeStay = async (id: string) => {
    setStays((prev) => prev.filter((s) => s.$id !== id));
    try {
      await hospitalStaysDb.delete(id);
    } catch {
      await fetch();
      throw new Error('Failed to delete hospital stay.');
    }
  };

  return { stays, activeStay, loading, error, addStay, updateStay, removeStay, refresh: fetch };
}

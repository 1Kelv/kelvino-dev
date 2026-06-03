import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GrowthEntry } from '../../types';
import { localDateNow, kgToLbs, lbsToKg } from '../../lib/utils';

interface GrowthFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<GrowthEntry, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<GrowthEntry, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: GrowthEntry;
}

export function GrowthForm({ babyId, userId, onSubmit, onUpdate, onClose, initialValues }: GrowthFormProps) {
  const isEdit = !!initialValues;
  const [date, setDate] = useState(initialValues?.date ?? localDateNow());
  const [useKg, setUseKg] = useState(true);
  const [weight, setWeight] = useState(initialValues ? String(initialValues.weightKg) : '');
  const [lengthCm, setLengthCm] = useState(initialValues?.lengthCm ? String(initialValues.lengthCm) : '');
  const [headCm, setHeadCm] = useState(initialValues?.headCircumferenceCm ? String(initialValues.headCircumferenceCm) : '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) { setError('Please enter a date.'); return; }
    if (!weight && !lengthCm) { setError('Please enter at least a weight or height.'); return; }
    const weightNum = weight ? parseFloat(weight) : 0;
    if (weight && (isNaN(weightNum) || weightNum <= 0)) { setError('Please enter a valid weight.'); return; }
    const weightKg = weight ? (useKg ? weightNum : lbsToKg(weightNum)) : 0;
    const weightLbs = weight ? (useKg ? kgToLbs(weightNum) : weightNum) : 0;
    setLoading(true);
    setError(null);
    try {
      const lengthVal = lengthCm ? parseFloat(lengthCm) : undefined;
      const headVal = headCm ? parseFloat(headCm) : undefined;
      const notesVal = notes || undefined;
      if (isEdit && onUpdate) {
        // null explicitly clears optional fields in Appwrite updates
        await onUpdate({ babyId, userId, date, weightKg, weightLbs, lengthCm: lengthVal ?? null, headCircumferenceCm: headVal ?? null, notes: notesVal ?? null } as any);
      } else {
        // undefined omits the field entirely on create (Appwrite default)
        await onSubmit({ babyId, userId, date, weightKg, weightLbs, lengthCm: lengthVal, headCircumferenceCm: headVal, notes: notesVal });
      }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} growth entry. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight <span className="font-normal text-gray-400">(optional)</span></label>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button type="button" onClick={() => setUseKg(true)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors min-h-[32px] ${useKg ? 'bg-white dark:bg-gray-600 text-brand-mint shadow-sm' : 'text-gray-500'}`}>
              kg
            </button>
            <button type="button" onClick={() => setUseKg(false)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors min-h-[32px] ${!useKg ? 'bg-white dark:bg-gray-600 text-brand-mint shadow-sm' : 'text-gray-500'}`}>
              lbs
            </button>
          </div>
        </div>
        <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
          placeholder={useKg ? 'e.g. 3.5' : 'e.g. 7.7'} min="0" step="0.01"
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 min-h-[44px]" />
      </div>
      <Input label="Length / Height (cm)" type="number" value={lengthCm} onChange={(e) => setLengthCm(e.target.value)} placeholder="e.g. 50" min="0" step="0.1" />
      <Input label="Head circumference (cm, optional)" type="number" value={headCm} onChange={(e) => setHeadCm(e.target.value)} placeholder="e.g. 34" min="0" step="0.1" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any observations..." rows={3}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none" />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Update Measurement' : 'Save Measurement'}</Button>
      </div>
    </form>
  );
}

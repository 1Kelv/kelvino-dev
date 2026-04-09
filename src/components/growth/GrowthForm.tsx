// I render the form for logging a growth measurement
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { GrowthEntry } from '../../types';
import { localDateNow, kgToLbs, lbsToKg } from '../../lib/utils';

interface GrowthFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<GrowthEntry, '$id'>) => Promise<void>;
  onClose: () => void;
}

export function GrowthForm({ babyId, userId, onSubmit, onClose }: GrowthFormProps) {
  const [date, setDate] = useState(localDateNow());
  const [useKg, setUseKg] = useState(true);
  const [weight, setWeight] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [headCm, setHeadCm] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !weight) {
      setError('Please enter the date and weight.');
      return;
    }
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight.');
      return;
    }
    const weightKg = useKg ? weightNum : lbsToKg(weightNum);
    const weightLbs = useKg ? kgToLbs(weightNum) : weightNum;

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        babyId,
        userId,
        date,
        weightKg,
        weightLbs,
        lengthCm: lengthCm ? parseFloat(lengthCm) : undefined,
        headCircumferenceCm: headCm ? parseFloat(headCm) : undefined,
        notes: notes || undefined,
      });
      onClose();
    } catch {
      setError('Failed to save growth entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Weight</label>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setUseKg(true)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors min-h-[32px] ${useKg ? 'bg-white text-brand-mint shadow-sm' : 'text-gray-500'}`}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => setUseKg(false)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors min-h-[32px] ${!useKg ? 'bg-white text-brand-mint shadow-sm' : 'text-gray-500'}`}
            >
              lbs
            </button>
          </div>
        </div>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={useKg ? 'e.g. 3.5' : 'e.g. 7.7'}
          min="0"
          step="0.01"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 min-h-[44px]"
        />
      </div>
      <Input
        label="Length / Height (cm, optional)"
        type="number"
        value={lengthCm}
        onChange={(e) => setLengthCm(e.target.value)}
        placeholder="e.g. 50"
        min="0"
        step="0.1"
      />
      <Input
        label="Head circumference (cm, optional)"
        type="number"
        value={headCm}
        onChange={(e) => setHeadCm(e.target.value)}
        placeholder="e.g. 34"
        min="0"
        step="0.1"
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any observations..."
          rows={3}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Save Measurement
        </Button>
      </div>
    </form>
  );
}

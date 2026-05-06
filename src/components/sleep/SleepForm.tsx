import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { SleepEntry } from '../../types';
import { localDateNow, toLocalDateTimeInput } from '../../lib/utils';

interface SleepFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<SleepEntry, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<SleepEntry, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: SleepEntry;
}

export function SleepForm({ babyId, userId, onSubmit, onUpdate, onClose, initialValues }: SleepFormProps) {
  const isEdit = !!initialValues;
  const [date, setDate] = useState(initialValues?.date ?? localDateNow());
  const [sleepStart, setSleepStart] = useState(
    initialValues ? toLocalDateTimeInput(initialValues.sleepStart).slice(11, 16) : '20:00'
  );
  const [sleepEnd, setSleepEnd] = useState(
    initialValues ? toLocalDateTimeInput(initialValues.sleepEnd).slice(11, 16) : '06:00'
  );
  const [wakeCount, setWakeCount] = useState(initialValues ? String(initialValues.wakeCount) : '0');
  const [moodRating, setMoodRating] = useState<SleepEntry['moodRating']>(initialValues?.moodRating ?? 3);
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const durationMins = (() => {
    if (!sleepStart || !sleepEnd) return 0;
    const [sh, sm] = sleepStart.split(':').map(Number);
    const [eh, em] = sleepEnd.split(':').map(Number);
    let startMins = sh * 60 + sm;
    let endMins = eh * 60 + em;
    if (endMins <= startMins) endMins += 24 * 60;
    return endMins - startMins;
  })();

  const durationDisplay = durationMins > 0
    ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
    : '—';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !sleepStart || !sleepEnd) { setError('Please fill in all required fields.'); return; }
    if (durationMins <= 0) { setError('Sleep end must be after sleep start.'); return; }
    setLoading(true);
    setError(null);
    try {
      const startIso = new Date(`${date}T${sleepStart}`).toISOString();
      const endDate = sleepEnd <= sleepStart
        ? new Date(new Date(`${date}T${sleepEnd}`).getTime() + 24 * 60 * 60 * 1000).toISOString()
        : new Date(`${date}T${sleepEnd}`).toISOString();
      const data = { babyId, userId, date, sleepStart: startIso, sleepEnd: endDate, durationMins, wakeCount: parseInt(wakeCount) || 0, moodRating, notes: notes || undefined };
      if (isEdit && onUpdate) { await onUpdate(data); } else { await onSubmit(data); }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} sleep entry. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <div className="flex gap-3">
        <div className="flex-1">
          <Input label="Sleep start" type="time" value={sleepStart} onChange={(e) => setSleepStart(e.target.value)} required />
        </div>
        <div className="flex-1">
          <Input label="Sleep end" type="time" value={sleepEnd} onChange={(e) => setSleepEnd(e.target.value)} required />
        </div>
      </div>
      {durationMins > 0 && (
        <div className="bg-brand-light rounded-xl px-4 py-3 text-center">
          <p className="text-sm font-semibold text-brand-dark">Duration: {durationDisplay}</p>
        </div>
      )}
      <Input label="Wake count" type="number" value={wakeCount} onChange={(e) => setWakeCount(e.target.value)} placeholder="0" min="0" step="1" />
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mood rating</label>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as SleepEntry['moodRating'][]).map((rating) => (
            <button key={rating} type="button" onClick={() => setMoodRating(rating)}
              className={`flex-1 text-2xl py-2 rounded-xl border-2 transition-all ${moodRating === rating ? 'border-brand-mint bg-brand-light scale-110' : 'border-gray-200 hover:border-brand-mint'}`}>
              {['😴', '😕', '😐', '🙂', '😊'][rating - 1]}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center">
          {['Poor sleep', 'Below average', 'Average', 'Good', 'Great sleep'][moodRating - 1]}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any observations..." rows={3}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none" />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Update Sleep' : 'Save Sleep'}</Button>
      </div>
    </form>
  );
}

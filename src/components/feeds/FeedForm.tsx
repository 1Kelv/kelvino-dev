// I render the form for logging a new feed entry
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { FeedEntry } from '../../types';
import { localDateTimeNow } from '../../lib/utils';

interface FeedFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<FeedEntry, '$id'>) => Promise<void>;
  onClose: () => void;
}

export function FeedForm({ babyId, userId, onSubmit, onClose }: FeedFormProps) {
  const [datetime, setDatetime] = useState(localDateTimeNow());
  const [amountMl, setAmountMl] = useState('');
  const [type, setType] = useState<FeedEntry['type']>('formula');
  const [durationMins, setDurationMins] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBreastMilk = type === 'breast_milk';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datetime) {
      setError('Please fill in the date/time.');
      return;
    }
    if (!isBreastMilk && !amountMl) {
      setError('Please fill in the amount.');
      return;
    }
    const amount = amountMl ? parseFloat(amountMl) : 0;
    if (!isBreastMilk && (isNaN(amount) || amount <= 0)) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        babyId,
        userId,
        datetime: new Date(datetime).toISOString(),
        amountMl: amount,
        type,
        durationMins: durationMins ? parseInt(durationMins) : undefined,
        notes: notes || undefined,
      });
      onClose();
    } catch {
      setError('Failed to save feed entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Date & Time"
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        required
      />
      <Select
        label="Feed type"
        value={type}
        onChange={(e) => { setType(e.target.value as FeedEntry['type']); setAmountMl(''); }}
        options={[
          { value: 'formula', label: 'Formula' },
          { value: 'breast_milk', label: 'Breast Milk' },
          { value: 'mixed', label: 'Mixed' },
        ]}
      />
      <Input
        label={isBreastMilk ? 'Amount (ml, optional)' : 'Amount (ml)'}
        type="number"
        value={amountMl}
        onChange={(e) => setAmountMl(e.target.value)}
        placeholder={isBreastMilk ? 'Leave blank if not measured' : 'e.g. 90'}
        min="0"
        step="1"
        required={!isBreastMilk}
      />
      <Input
        label="Duration (mins, optional)"
        type="number"
        value={durationMins}
        onChange={(e) => setDurationMins(e.target.value)}
        placeholder="e.g. 20"
        min="0"
        step="1"
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
          Save Feed
        </Button>
      </div>
    </form>
  );
}

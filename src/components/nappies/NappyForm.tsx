// I render the form for logging a new nappy entry
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { NappyEntry } from '../../types';
import { localDateTimeNow } from '../../lib/utils';

interface NappyFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<NappyEntry, '$id'>) => Promise<void>;
  onClose: () => void;
}

export function NappyForm({ babyId, userId, onSubmit, onClose }: NappyFormProps) {
  const [datetime, setDatetime] = useState(localDateTimeNow());
  const [kind, setKind] = useState<NappyEntry['kind']>('wet');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        babyId,
        userId,
        datetime: new Date(datetime).toISOString(),
        kind,
        notes: notes || undefined,
      });
      onClose();
    } catch {
      setError('Failed to save nappy entry. Please try again.');
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
        label="Nappy type"
        value={kind}
        onChange={(e) => setKind(e.target.value as NappyEntry['kind'])}
        options={[
          { value: 'wet', label: 'Wet' },
          { value: 'dirty', label: 'Dirty' },
          { value: 'both', label: 'Wet & Dirty' },
          { value: 'dry', label: 'Dry' },
        ]}
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
          Save Nappy
        </Button>
      </div>
    </form>
  );
}

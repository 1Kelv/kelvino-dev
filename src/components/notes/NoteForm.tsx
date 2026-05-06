import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { NoteEntry } from '../../types';
import { localDateNow } from '../../lib/utils';

interface NoteFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<NoteEntry, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<NoteEntry, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: NoteEntry;
}

export function NoteForm({ babyId, userId, onSubmit, onUpdate, onClose, initialValues }: NoteFormProps) {
  const isEdit = !!initialValues;
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [body, setBody] = useState(initialValues?.body ?? '');
  const [category, setCategory] = useState<NoteEntry['category']>(initialValues?.category ?? 'general');
  const [date, setDate] = useState(initialValues?.date ?? localDateNow());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) { setError('Please enter a title and note content.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = { babyId, userId, title, body, category, date };
      if (isEdit && onUpdate) { await onUpdate(data); } else { await onSubmit(data); }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} note. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as NoteEntry['category'])}
        options={[
          { value: 'general', label: 'General' },
          { value: 'consultant', label: 'Consultant notes' },
          { value: 'discharge', label: 'Discharge summary' },
          { value: 'medication', label: 'Medication notes' },
        ]} />
      <Input label="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Post-op discharge notes" required />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your note here..." rows={6} required
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none" />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Update Note' : 'Save Note'}</Button>
      </div>
    </form>
  );
}

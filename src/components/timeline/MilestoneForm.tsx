import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { MilestoneEntry } from '../../types';
import { localDateTimeNow, toLocalDateTimeInput } from '../../lib/utils';

const CATEGORY_EMOJIS: Record<MilestoneEntry['category'], string> = {
  medical: '🏥',
  emotional: '💛',
  developmental: '🌱',
  achievement: '🏆',
};

const DEFAULT_EMOJIS: Record<MilestoneEntry['category'], string[]> = {
  medical: ['🏥', '💉', '🩺', '💊', '❤️‍🩹', '🫀'],
  emotional: ['💛', '😊', '🥰', '😂', '😴', '🤗'],
  developmental: ['🌱', '👋', '🧠', '🦶', '🤲', '🗣️'],
  achievement: ['🏆', '⭐', '🎉', '🎊', '🥇', '✨'],
};

interface MilestoneFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<MilestoneEntry, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<MilestoneEntry, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: MilestoneEntry;
}

export function MilestoneForm({ babyId, userId, onSubmit, onUpdate, onClose, initialValues }: MilestoneFormProps) {
  const isEdit = !!initialValues;
  const [datetime, setDatetime] = useState(initialValues ? toLocalDateTimeInput(initialValues.datetime) : localDateTimeNow());
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [category, setCategory] = useState<MilestoneEntry['category']>(initialValues?.category ?? 'developmental');
  const [emoji, setEmoji] = useState(initialValues?.emoji ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = {
        babyId, userId,
        datetime: new Date(datetime).toISOString(),
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        emoji: emoji || CATEGORY_EMOJIS[category],
      };
      if (isEdit && onUpdate) { await onUpdate(data); } else { await onSubmit(data); }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} milestone. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const emojiOptions = DEFAULT_EMOJIS[category];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Date & Time" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
      <Select
        label="Category"
        value={category}
        onChange={(e) => { setCategory(e.target.value as MilestoneEntry['category']); setEmoji(''); }}
        options={[
          { value: 'developmental', label: '🌱 Developmental' },
          { value: 'achievement', label: '🏆 Achievement' },
          { value: 'emotional', label: '💛 Emotional' },
          { value: 'medical', label: '🏥 Medical' },
        ]}
      />
      <Input
        label="Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={
          category === 'developmental' ? 'e.g. First smile' :
          category === 'achievement' ? 'e.g. First bottle feed' :
          category === 'emotional' ? 'e.g. Recognises Dad\'s voice' :
          'e.g. Cardiology discharge'
        }
        required
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pick an emoji</label>
        <div className="flex gap-2 flex-wrap">
          {emojiOptions.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-colors ${
                emoji === e ? 'border-brand-mint bg-brand-light' : 'border-gray-200 dark:border-gray-600 hover:border-brand-mint'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more detail about this milestone…"
          rows={3}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Update Milestone' : 'Save Milestone'}</Button>
      </div>
    </form>
  );
}

// I render the list of sleep entries
import React from 'react';
import { SleepEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDate, formatDuration } from '../../lib/utils';

interface SleepListProps {
  entries: SleepEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: SleepEntry) => void;
  onAdd?: () => void;
}

const moodEmoji = (rating: SleepEntry['moodRating']) =>
  ['😴', '😕', '😐', '🙂', '😊'][rating - 1];

const moodColour = (rating: SleepEntry['moodRating']) => {
  if (rating >= 4) return 'green' as const;
  if (rating === 3) return 'gray' as const;
  return 'orange' as const;
};

export function SleepList({ entries, onDelete, onEdit, onAdd }: SleepListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="🌙"
        heading="No sleep sessions logged yet"
        subtext="Tap the + button to log a sleep session."
        ctaLabel={onAdd ? 'Log sleep' : undefined}
        onCta={onAdd}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <LogItem
          key={entry.$id}
          timestamp={formatDate(entry.date)}
          title={`${formatDuration(entry.durationMins)} ${moodEmoji(entry.moodRating)}`}
          subtitle={`Woke ${entry.wakeCount} time${entry.wakeCount !== 1 ? 's' : ''}${entry.notes ? ` · ${entry.notes}` : ''}`}
          badge={<Badge colour={moodColour(entry.moodRating)}>{moodEmoji(entry.moodRating)} Mood {entry.moodRating}/5</Badge>}
          onDelete={() => onDelete(entry.$id)}
          onEdit={onEdit ? () => onEdit(entry) : undefined}
        />
      ))}
    </div>
  );
}

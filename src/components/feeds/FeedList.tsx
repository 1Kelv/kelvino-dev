// I render the list of feed entries
import React from 'react';
import { FeedEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime, formatDuration } from '../../lib/utils';

interface FeedListProps {
  entries: FeedEntry[];
  onDelete: (id: string) => Promise<void>;
  onAdd?: () => void;
}

const typeBadgeColour = (type: FeedEntry['type']) => {
  if (type === 'formula') return 'sky' as const;
  if (type === 'breast_milk') return 'purple' as const;
  return 'mint' as const;
};

const typeLabel = (type: FeedEntry['type']) => {
  if (type === 'formula') return 'Formula';
  if (type === 'breast_milk') return 'Breast Milk';
  return 'Mixed';
};

export function FeedList({ entries, onDelete, onAdd }: FeedListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="🍼"
        heading="No feeds logged yet"
        subtext="Tap the + button to log your baby's first feed."
        ctaLabel={onAdd ? 'Log a feed' : undefined}
        onCta={onAdd}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <LogItem
          key={entry.$id}
          timestamp={formatDateTime(entry.datetime)}
          title={entry.amountMl > 0 ? `${entry.amountMl} ml` : 'Not measured'}
          subtitle={
            entry.durationMins
              ? `Duration: ${formatDuration(entry.durationMins)}${entry.notes ? ` · ${entry.notes}` : ''}`
              : entry.notes || undefined
          }
          badge={
            <Badge colour={typeBadgeColour(entry.type)}>{typeLabel(entry.type)}</Badge>
          }
          onDelete={() => onDelete(entry.$id)}
        />
      ))}
    </div>
  );
}

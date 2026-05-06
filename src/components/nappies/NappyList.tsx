// I render the list of nappy entries
import React from 'react';
import { NappyEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime } from '../../lib/utils';

interface NappyListProps {
  entries: NappyEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: NappyEntry) => void;
  onAdd?: () => void;
}

const kindConfig = (kind: NappyEntry['kind']) => {
  switch (kind) {
    case 'wet': return { label: 'Wet', colour: 'sky' as const, emoji: '💧' };
    case 'dirty': return { label: 'Dirty', colour: 'orange' as const, emoji: '💩' };
    case 'both': return { label: 'Wet & Dirty', colour: 'purple' as const, emoji: '💧💩' };
    case 'dry': return { label: 'Dry', colour: 'gray' as const, emoji: '⬜' };
  }
};

export function NappyList({ entries, onDelete, onEdit, onAdd }: NappyListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="👶"
        heading="No nappies logged yet"
        subtext="Tap the + button to log a nappy change."
        ctaLabel={onAdd ? 'Log a nappy' : undefined}
        onCta={onAdd}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const config = kindConfig(entry.kind);
        return (
          <LogItem
            key={entry.$id}
            timestamp={formatDateTime(entry.datetime)}
            title={`${config.emoji} ${config.label}`}
            subtitle={entry.notes || undefined}
            badge={<Badge colour={config.colour}>{config.label}</Badge>}
            onDelete={() => onDelete(entry.$id)}
            onEdit={onEdit ? () => onEdit(entry) : undefined}
          />
        );
      })}
    </div>
  );
}

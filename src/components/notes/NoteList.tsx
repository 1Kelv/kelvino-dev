// I render the list of notes
import React from 'react';
import { NoteEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../lib/utils';

interface NoteListProps {
  entries: NoteEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: NoteEntry) => void;
  onAdd?: () => void;
}

const categoryConfig = (cat: NoteEntry['category']) => {
  switch (cat) {
    case 'discharge': return { label: 'Discharge', colour: 'orange' as const };
    case 'consultant': return { label: 'Consultant', colour: 'sky' as const };
    case 'medication': return { label: 'Medication', colour: 'purple' as const };
    default: return { label: 'General', colour: 'gray' as const };
  }
};

export function NoteList({ entries, onDelete, onEdit, onAdd }: NoteListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="📝"
        heading="No notes yet"
        subtext="Tap the + button to add your first note."
        ctaLabel={onAdd ? 'Add a note' : undefined}
        onCta={onAdd}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const cat = categoryConfig(entry.category);
        return (
          <LogItem
            key={entry.$id}
            timestamp={formatDate(entry.date)}
            title={entry.title}
            subtitle={entry.body.length > 100 ? entry.body.slice(0, 100) + '…' : entry.body}
            badge={<Badge colour={cat.colour}>{cat.label}</Badge>}
            onDelete={() => onDelete(entry.$id)}
            onEdit={onEdit ? () => onEdit(entry) : undefined}
          />
        );
      })}
    </div>
  );
}

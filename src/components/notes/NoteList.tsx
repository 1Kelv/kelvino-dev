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
  onView?: (entry: NoteEntry) => void;
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

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^[\*\-]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
}

export function NoteList({ entries, onDelete, onEdit, onView, onAdd }: NoteListProps) {
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
            subtitle={(() => { const clean = stripMarkdown(entry.body); return clean.length > 100 ? clean.slice(0, 100) + '…' : clean; })()}
            badge={<Badge colour={cat.colour}>{cat.label}</Badge>}
            onDelete={() => onDelete(entry.$id)}
            onEdit={onEdit ? () => onEdit(entry) : undefined}
            onClick={onView ? () => onView(entry) : undefined}
          />
        );
      })}
    </div>
  );
}

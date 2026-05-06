// I render the list of medication entries
import React from 'react';
import { MedicationEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime } from '../../lib/utils';

interface MedicationListProps {
  entries: MedicationEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: MedicationEntry) => void;
  onAdd?: () => void;
}

const routeColour = (route: MedicationEntry['route']) => {
  switch (route) {
    case 'oral': return 'mint' as const;
    case 'IV': return 'red' as const;
    case 'topical': return 'sky' as const;
    case 'inhaled': return 'purple' as const;
    default: return 'gray' as const;
  }
};

export function MedicationList({ entries, onDelete, onEdit, onAdd }: MedicationListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="💊"
        heading="No medications logged yet"
        subtext="Tap the + button to log a medication dose."
        ctaLabel={onAdd ? 'Log a medication' : undefined}
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
          title={`${entry.medicationName} — ${entry.dose} ${entry.unit}`}
          subtitle={`${entry.route.toUpperCase()} · by ${entry.administeredBy}${entry.notes ? ` · ${entry.notes}` : ''}`}
          badge={<Badge colour={routeColour(entry.route)}>{entry.route}</Badge>}
          onDelete={() => onDelete(entry.$id)}
          onEdit={onEdit ? () => onEdit(entry) : undefined}
        />
      ))}
    </div>
  );
}

// I render the list of growth entries
import React from 'react';
import { GrowthEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../lib/utils';

interface GrowthListProps {
  entries: GrowthEntry[];
  useKg: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: GrowthEntry) => void;
  onAdd?: () => void;
}

export function GrowthList({ entries, useKg, onDelete, onEdit, onAdd }: GrowthListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="📏"
        heading="No growth data yet"
        subtext="Tap the + button to record your baby's first measurement."
        ctaLabel={onAdd ? 'Add measurement' : undefined}
        onCta={onAdd}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const weight = useKg
          ? `${entry.weightKg.toFixed(2)} kg`
          : `${entry.weightLbs.toFixed(2)} lbs`;
        const details = [
          entry.lengthCm ? `Length: ${entry.lengthCm} cm` : null,
          entry.headCircumferenceCm ? `Head: ${entry.headCircumferenceCm} cm` : null,
          entry.notes || null,
        ]
          .filter(Boolean)
          .join(' · ');

        return (
          <LogItem
            key={entry.$id}
            timestamp={formatDate(entry.date)}
            title={weight}
            subtitle={details || undefined}
            onDelete={() => onDelete(entry.$id)}
            onEdit={onEdit ? () => onEdit(entry) : undefined}
          />
        );
      })}
    </div>
  );
}

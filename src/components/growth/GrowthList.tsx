// I render the list of growth entries
import React from 'react';
import { GrowthEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { EmptyState } from '../ui/EmptyState';
import { formatDate, getAuthorLabel } from '../../lib/utils';
import { useAuth } from '../../lib/AuthContext';

interface GrowthListProps {
  entries: GrowthEntry[];
  useKg: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: GrowthEntry) => void;
  onView?: (entry: GrowthEntry) => void;
  onAdd?: () => void;
}

export function GrowthList({ entries, useKg, onDelete, onEdit, onView, onAdd }: GrowthListProps) {
  const { user } = useAuth();
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
        const hasWeight = entry.weightKg > 0;
        const weightLabel = hasWeight
          ? (useKg ? `${entry.weightKg.toFixed(2)} kg` : `${entry.weightLbs.toFixed(2)} lbs`)
          : null;
        const title = weightLabel ?? (entry.lengthCm ? `${entry.lengthCm} cm` : '—');
        const detailParts = [
          // Only show length in subtitle if weight is the title (avoid repeating it)
          hasWeight && entry.lengthCm ? `Length: ${entry.lengthCm} cm` : null,
          entry.headCircumferenceCm ? `Head: ${entry.headCircumferenceCm} cm` : null,
          entry.notes || null,
        ];
        const details = detailParts.filter(Boolean).join(' · ');

        return (
          <LogItem
            key={entry.$id}
            timestamp={formatDate(entry.date)}
            title={title}
            subtitle={details || undefined}
            addedBy={getAuthorLabel(entry.userId, user)}
            onDelete={() => onDelete(entry.$id)}
            onEdit={onEdit ? () => onEdit(entry) : undefined}
            onClick={onView ? () => onView(entry) : undefined}
          />
        );
      })}
    </div>
  );
}

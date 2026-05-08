// I render the list of symptom observations
import React from 'react';
import { SymptomEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime } from '../../lib/utils';

interface SymptomListProps {
  entries: SymptomEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: SymptomEntry) => void;
  onAdd?: () => void;
}

const skinColourBadge = (c: SymptomEntry['skinColour']) => {
  switch (c) {
    case 'normal': return { colour: 'green' as const, label: 'Normal skin' };
    case 'pale': return { colour: 'gray' as const, label: 'Pale' };
    case 'blue': return { colour: 'sky' as const, label: 'Blue / Cyanotic' };
    case 'yellow': return { colour: 'yellow' as const, label: 'Yellow' };
    case 'mottled': return { colour: 'orange' as const, label: 'Mottled' };
  }
};

export function SymptomList({ entries, onDelete, onEdit, onAdd }: SymptomListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="🫀"
        heading="No symptom observations yet"
        subtext="Tap the + button to log an observation."
        ctaLabel={onAdd ? 'Log an observation' : undefined}
        onCta={onAdd}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const skinBadge = skinColourBadge(entry.skinColour);
        const details = [
          `Energy: ${entry.energyLevel.replace('_', ' ')}`,
          `Breathing: ${entry.breathing}`,
          entry.feedingWell ? 'Feeding well' : 'Not feeding well',
          entry.temperatureC ? `Temp: ${entry.temperatureC}°C` : null,
          entry.notes || null,
        ]
          .filter(Boolean)
          .join(' · ');

        return (
          <LogItem
            key={entry.$id}
            timestamp={formatDateTime(entry.datetime)}
            title={skinBadge.label}
            subtitle={details}
            badge={<Badge colour={skinBadge.colour}>{skinBadge.label}</Badge>}
            onDelete={() => onDelete(entry.$id)}
            onEdit={onEdit ? () => onEdit(entry) : undefined}
            onClick={onEdit ? () => onEdit(entry) : undefined}
          />
        );
      })}
    </div>
  );
}

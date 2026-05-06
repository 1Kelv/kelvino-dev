// I render the list of appointments split into upcoming and past
import React from 'react';
import { AppointmentEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime } from '../../lib/utils';

interface AppointmentListProps {
  entries: AppointmentEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: AppointmentEntry) => void;
  onAdd?: () => void;
}

export function AppointmentList({ entries, onDelete, onEdit, onAdd }: AppointmentListProps) {
  const now = new Date();
  const upcoming = entries
    .filter((e) => new Date(e.datetime) >= now)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const past = entries
    .filter((e) => new Date(e.datetime) < now)
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

  if (entries.length === 0) {
    return (
      <EmptyState
        emoji="📅"
        heading="No appointments logged yet"
        subtext="Tap the + button to add an upcoming appointment."
        ctaLabel={onAdd ? 'Add appointment' : undefined}
        onCta={onAdd}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Upcoming ({upcoming.length})
          </h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((entry) => (
              <LogItem
                key={entry.$id}
                timestamp={formatDateTime(entry.datetime)}
                title={`${entry.hospitalName} — ${entry.department}`}
                subtitle={`Dr. ${entry.consultantName}${entry.notes ? ` · ${entry.notes}` : ''}`}
                badge={<Badge colour="mint">Upcoming</Badge>}
                onDelete={() => onDelete(entry.$id)}
                onEdit={onEdit ? () => onEdit(entry) : undefined}
                className="border-brand-mint/30 bg-brand-light/50"
              />
            ))}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Past ({past.length})
          </h2>
          <div className="flex flex-col gap-3">
            {past.map((entry) => (
              <LogItem
                key={entry.$id}
                timestamp={formatDateTime(entry.datetime)}
                title={`${entry.hospitalName} — ${entry.department}`}
                subtitle={`Dr. ${entry.consultantName}${entry.notes ? ` · ${entry.notes}` : ''}`}
                badge={<Badge colour="gray">Past</Badge>}
                onDelete={() => onDelete(entry.$id)}
                onEdit={onEdit ? () => onEdit(entry) : undefined}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

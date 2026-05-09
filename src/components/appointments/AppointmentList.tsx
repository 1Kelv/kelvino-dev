import React, { useState } from 'react';
import { AppointmentEntry } from '../../types';
import { LogItem } from '../ui/LogItem';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { formatDateTime, appointmentCountdown } from '../../lib/utils';

interface AppointmentListProps {
  entries: AppointmentEntry[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (entry: AppointmentEntry) => void;
  onView?: (entry: AppointmentEntry) => void;
  onStatusChange: (id: string, status: 'attended' | 'missed') => Promise<void>;
  onAdd?: () => void;
}

function StatusPrompt({ entry, onStatusChange }: { entry: AppointmentEntry; onStatusChange: (id: string, status: 'attended' | 'missed') => Promise<void> }) {
  const [saving, setSaving] = useState(false);

  const handle = async (status: 'attended' | 'missed') => {
    setSaving(true);
    try { await onStatusChange(entry.$id, status); } finally { setSaving(false); }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mr-1">Did you attend?</p>
      <button
        onClick={() => handle('attended')}
        disabled={saving}
        className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
      >
        Yes
      </button>
      <button
        onClick={() => handle('missed')}
        disabled={saving}
        className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
      >
        No
      </button>
    </div>
  );
}

function statusBadge(status: AppointmentEntry['status']) {
  if (status === 'attended') return <Badge colour="green">Attended</Badge>;
  if (status === 'missed') return <Badge colour="orange">Missed</Badge>;
  return null;
}

export function AppointmentList({ entries, onDelete, onEdit, onView, onStatusChange, onAdd }: AppointmentListProps) {
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
            {upcoming.map((entry) => {
              const countdown = appointmentCountdown(entry.datetime);
              const isToday = countdown === 'Today';
              return (
                <LogItem
                  key={entry.$id}
                  timestamp={formatDateTime(entry.datetime)}
                  title={`${entry.hospitalName} — ${entry.department}`}
                  subtitle={`Dr. ${entry.consultantName}${entry.notes ? ` · ${entry.notes}` : ''}`}
                  badge={
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge colour={isToday ? 'orange' : 'mint'}>{countdown}</Badge>
                    </div>
                  }
                  onDelete={() => onDelete(entry.$id)}
                  onEdit={onEdit ? () => onEdit(entry) : undefined}
                  onClick={onView ? () => onView(entry) : undefined}
                  className="border-brand-mint/30 bg-brand-light/50"
                />
              );
            })}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Past ({past.length})
          </h2>
          <div className="flex flex-col gap-3">
            {past.map((entry) => {
              const countdown = appointmentCountdown(entry.datetime);
              return (
                <div key={entry.$id}>
                  <LogItem
                    timestamp={formatDateTime(entry.datetime)}
                    title={`${entry.hospitalName} — ${entry.department}`}
                    subtitle={`Dr. ${entry.consultantName}${entry.notes ? ` · ${entry.notes}` : ''}`}
                    badge={
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {entry.status ? statusBadge(entry.status) : <Badge colour="gray">Past</Badge>}
                        <span className="text-xs text-gray-400">{countdown}</span>
                      </div>
                    }
                    onDelete={() => onDelete(entry.$id)}
                    onEdit={onEdit ? () => onEdit(entry) : undefined}
                    onClick={onView ? () => onView(entry) : undefined}
                    className={
                      entry.status === 'attended'
                        ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                        : entry.status === 'missed'
                        ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                        : ''
                    }
                    extra={
                      !entry.status
                        ? <StatusPrompt entry={entry} onStatusChange={onStatusChange} />
                        : undefined
                    }
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

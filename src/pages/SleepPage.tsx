import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { DateNavigator } from '../components/ui/DateNavigator';
import { SleepForm } from '../components/sleep/SleepForm';
import { SleepList } from '../components/sleep/SleepList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useSleep } from '../hooks/useSleep';
import { babyAge, isOnDate, formatDuration, formatDate } from '../lib/utils';
import { SleepEntry } from '../types';
import { EntryDetailModal } from '../components/ui/EntryDetailModal';

export function SleepPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, updateEntry, removeEntry } = useSleep(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SleepEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<SleepEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sleep uses `date` (YYYY-MM-DD) and `sleepStart` (datetime); filter on sleepStart for accuracy
  const dayEntries = entries.filter((e) => isOnDate(e.sleepStart, selectedDate));
  const dayDuration = dayEntries.reduce((sum, e) => sum + e.durationMins, 0);
  const dayWakes = dayEntries.reduce((sum, e) => sum + e.wakeCount, 0);
  const lastSleep = entries[0];

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Sleep" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Sleep" babyName={selectedBaby.name} babyAge={babyAge(selectedBaby.dateOfBirth)} />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Moon size={18} />} label="Total sleep" value={dayDuration > 0 ? formatDuration(dayDuration) : '—'} colour="mint" />
          <StatCard icon={<Moon size={18} />} label="Wake-ups" value={dayEntries.length > 0 ? dayWakes : '—'} colour="purple" />
          <StatCard icon={<Moon size={18} />} label="Last session" value={lastSleep ? formatDuration(lastSleep.durationMins) : '—'} colour="sky" />
        </div>

        <DateNavigator date={selectedDate} onChange={setSelectedDate} />

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <SleepList entries={dayEntries} onDelete={removeEntry} onEdit={(entry) => setEditingEntry(entry)} onView={(entry) => setViewingEntry(entry)} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a sleep session" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Sleep Session">
        <SleepForm babyId={selectedBaby.$id} userId={user?.$id || ''} onSubmit={addEntry} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="Edit Sleep Session">
        {editingEntry && (
          <SleepForm
            babyId={selectedBaby.$id}
            userId={user?.$id || ''}
            onSubmit={addEntry}
            onUpdate={(data) => updateEntry(editingEntry.$id, data)}
            onClose={() => setEditingEntry(null)}
            initialValues={editingEntry}
          />
        )}
      </Modal>

      {viewingEntry && (
        <EntryDetailModal
          open={!!viewingEntry}
          onClose={() => setViewingEntry(null)}
          onEdit={() => { setViewingEntry(null); setEditingEntry(viewingEntry); }}
          title={formatDuration(viewingEntry.durationMins)}
          timestamp={formatDate(viewingEntry.date)}
          fields={[
            { label: 'Duration', value: formatDuration(viewingEntry.durationMins) },
            { label: 'Wake-ups', value: String(viewingEntry.wakeCount) },
            { label: 'Mood', value: `${viewingEntry.moodRating}/5` },
            { label: 'Notes', value: viewingEntry.notes || undefined },
            { label: 'Date', value: formatDate(viewingEntry.date) },
          ]}
        />
      )}
    </AppShell>
  );
}

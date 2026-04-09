// I render the sleep tracking page
import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { SleepForm } from '../components/sleep/SleepForm';
import { SleepList } from '../components/sleep/SleepList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useSleep } from '../hooks/useSleep';
import { babyAge, formatDuration } from '../lib/utils';

export function SleepPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, removeEntry } = useSleep(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);

  // I compute the last 7-day average sleep duration
  const recentEntries = entries.slice(0, 7);
  const avgDuration =
    recentEntries.length > 0
      ? Math.round(recentEntries.reduce((sum, e) => sum + e.durationMins, 0) / recentEntries.length)
      : 0;

  const lastSleep = entries[0];
  const avgWakes =
    recentEntries.length > 0
      ? Math.round(recentEntries.reduce((sum, e) => sum + e.wakeCount, 0) / recentEntries.length)
      : 0;

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
      <PageHeader
        title="Sleep"
        babyName={selectedBaby.name}
        babyAge={babyAge(selectedBaby.dateOfBirth)}
      />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Moon size={18} />}
            label="Avg duration"
            value={avgDuration > 0 ? formatDuration(avgDuration) : '—'}
            colour="mint"
          />
          <StatCard
            icon={<Moon size={18} />}
            label="Avg wakes"
            value={recentEntries.length > 0 ? avgWakes : '—'}
            colour="purple"
          />
          <StatCard
            icon={<Moon size={18} />}
            label="Last session"
            value={lastSleep ? formatDuration(lastSleep.durationMins) : '—'}
            colour="sky"
          />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <SleepList entries={entries} onDelete={removeEntry} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a sleep session" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Sleep Session">
        <SleepForm
          babyId={selectedBaby.$id}
          userId={user?.$id || ''}
          onSubmit={addEntry}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </AppShell>
  );
}

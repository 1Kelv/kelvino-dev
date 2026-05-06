import React, { useState } from 'react';
import { Baby } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { NappyForm } from '../components/nappies/NappyForm';
import { NappyList } from '../components/nappies/NappyList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useNappies } from '../hooks/useNappies';
import { babyAge, isToday, formatTime } from '../lib/utils';
import { NappyEntry } from '../types';

export function NappiesPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, updateEntry, removeEntry } = useNappies(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<NappyEntry | null>(null);

  const todayEntries = entries.filter((e) => isToday(e.datetime));
  const lastNappy = entries[0];
  const wetToday = todayEntries.filter((e) => e.kind === 'wet' || e.kind === 'both').length;
  const dirtyToday = todayEntries.filter((e) => e.kind === 'dirty' || e.kind === 'both').length;

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Nappies" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Nappies" babyName={selectedBaby.name} babyAge={babyAge(selectedBaby.dateOfBirth)} />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Baby size={18} />} label="Today" value={todayEntries.length} colour="mint" />
          <StatCard icon={<Baby size={18} />} label="Wet today" value={wetToday} colour="sky" />
          <StatCard icon={<Baby size={18} />} label="Dirty today" value={dirtyToday} colour="orange" />
        </div>

        {lastNappy && (
          <div className="bg-brand-light rounded-2xl px-4 py-3">
            <p className="text-sm text-brand-dark font-medium">
              Last nappy change: <strong>{formatTime(lastNappy.datetime)}</strong> — {lastNappy.kind}
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <NappyList entries={entries} onDelete={removeEntry} onEdit={(entry) => setEditingEntry(entry)} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a nappy change" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log a Nappy Change">
        <NappyForm babyId={selectedBaby.$id} userId={user?.$id || ''} onSubmit={addEntry} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="Edit Nappy Entry">
        {editingEntry && (
          <NappyForm
            babyId={selectedBaby.$id}
            userId={user?.$id || ''}
            onSubmit={addEntry}
            onUpdate={(data) => updateEntry(editingEntry.$id, data)}
            onClose={() => setEditingEntry(null)}
            initialValues={editingEntry}
          />
        )}
      </Modal>
    </AppShell>
  );
}

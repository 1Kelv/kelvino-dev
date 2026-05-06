import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { NoteForm } from '../components/notes/NoteForm';
import { NoteList } from '../components/notes/NoteList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { babyAge } from '../lib/utils';
import { NoteEntry } from '../types';

export function NotesPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, updateEntry, removeEntry } = useNotes(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<NoteEntry | null>(null);

  const dischargeNotes = entries.filter((e) => e.category === 'discharge').length;
  const consultantNotes = entries.filter((e) => e.category === 'consultant').length;

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Notes" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Notes" babyName={selectedBaby.name} babyAge={babyAge(selectedBaby.dateOfBirth)} />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<FileText size={18} />} label="Total notes" value={entries.length} colour="mint" />
          <StatCard icon={<FileText size={18} />} label="Discharge" value={dischargeNotes} colour="orange" />
          <StatCard icon={<FileText size={18} />} label="Consultant" value={consultantNotes} colour="sky" />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <NoteList entries={entries} onDelete={removeEntry} onEdit={(entry) => setEditingEntry(entry)} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Add a note" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Note">
        <NoteForm babyId={selectedBaby.$id} userId={user?.$id || ''} onSubmit={addEntry} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="Edit Note">
        {editingEntry && (
          <NoteForm
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

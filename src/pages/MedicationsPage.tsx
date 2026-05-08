import React, { useState } from 'react';
import { Pill } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { DateNavigator } from '../components/ui/DateNavigator';
import { MedicationForm } from '../components/medications/MedicationForm';
import { MedicationList } from '../components/medications/MedicationList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useMedications } from '../hooks/useMedications';
import { babyAge, isOnDate, formatTime, formatDateTime } from '../lib/utils';
import { MedicationEntry } from '../types';
import { EntryDetailModal } from '../components/ui/EntryDetailModal';

export function MedicationsPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, updateEntry, removeEntry } = useMedications(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MedicationEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<MedicationEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dayEntries = entries.filter((e) => isOnDate(e.datetime, selectedDate));
  const lastMed = entries[0];
  const uniqueMeds = new Set(dayEntries.map((e) => e.medicationName)).size;

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Medications" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Medications" babyName={selectedBaby.name} babyAge={babyAge(selectedBaby.dateOfBirth)} />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Pill size={18} />} label="Doses" value={dayEntries.length} colour="mint" />
          <StatCard icon={<Pill size={18} />} label="Medications" value={uniqueMeds} colour="purple" />
          <StatCard icon={<Pill size={18} />} label="Last dose" value={lastMed ? formatTime(lastMed.datetime) : '—'} colour="sky" />
        </div>

        <DateNavigator date={selectedDate} onChange={setSelectedDate} />

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <MedicationList entries={dayEntries} onDelete={removeEntry} onEdit={(entry) => setEditingEntry(entry)} onView={(entry) => setViewingEntry(entry)} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a medication" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log a Medication">
        <MedicationForm babyId={selectedBaby.$id} userId={user?.$id || ''} onSubmit={addEntry} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="Edit Medication">
        {editingEntry && (
          <MedicationForm
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
          title={`${viewingEntry.medicationName} — ${viewingEntry.dose} ${viewingEntry.unit}`}
          timestamp={formatDateTime(viewingEntry.datetime)}
          fields={[
            { label: 'Medication', value: viewingEntry.medicationName },
            { label: 'Dose', value: `${viewingEntry.dose} ${viewingEntry.unit}` },
            { label: 'Route', value: viewingEntry.route },
            { label: 'Given by', value: viewingEntry.administeredBy },
            { label: 'Notes', value: viewingEntry.notes || undefined },
            { label: 'Time', value: formatDateTime(viewingEntry.datetime) },
          ]}
        />
      )}
    </AppShell>
  );
}

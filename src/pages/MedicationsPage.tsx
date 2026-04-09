// I render the medications tracking page
import React, { useState } from 'react';
import { Pill } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { MedicationForm } from '../components/medications/MedicationForm';
import { MedicationList } from '../components/medications/MedicationList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useMedications } from '../hooks/useMedications';
import { babyAge, isToday, formatTime } from '../lib/utils';

export function MedicationsPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, removeEntry } = useMedications(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);

  const todayEntries = entries.filter((e) => isToday(e.datetime));
  const lastMed = entries[0];

  // I count unique medications given today
  const uniqueMedsToday = new Set(todayEntries.map((e) => e.medicationName)).size;

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
      <PageHeader
        title="Medications"
        babyName={selectedBaby.name}
        babyAge={babyAge(selectedBaby.dateOfBirth)}
      />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Pill size={18} />} label="Doses today" value={todayEntries.length} colour="mint" />
          <StatCard icon={<Pill size={18} />} label="Medications" value={uniqueMedsToday} colour="purple" />
          <StatCard
            icon={<Pill size={18} />}
            label="Last dose"
            value={lastMed ? formatTime(lastMed.datetime) : '—'}
            colour="sky"
          />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <MedicationList entries={entries} onDelete={removeEntry} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a medication" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log a Medication">
        <MedicationForm
          babyId={selectedBaby.$id}
          userId={user?.$id || ''}
          userName={user?.name || ''}
          onSubmit={addEntry}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </AppShell>
  );
}

// I render the symptoms tracking page
import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { SymptomForm } from '../components/symptoms/SymptomForm';
import { SymptomList } from '../components/symptoms/SymptomList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useSymptoms } from '../hooks/useSymptoms';
import { babyAge, isToday } from '../lib/utils';

export function SymptomsPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, removeEntry } = useSymptoms(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);

  const todayEntries = entries.filter((e) => isToday(e.datetime));

  // I count cyanotic (blue) episodes today for safety awareness
  const cyanoticToday = todayEntries.filter((e) => e.skinColour === 'blue').length;
  const normalToday = todayEntries.filter((e) => e.skinColour === 'normal').length;

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Symptoms" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Symptoms"
        subtitle="Track skin colour, energy, and breathing"
        babyName={selectedBaby.name}
        babyAge={babyAge(selectedBaby.dateOfBirth)}
      />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Activity size={18} />} label="Logged today" value={todayEntries.length} colour="mint" />
          <StatCard icon={<Activity size={18} />} label="Normal today" value={normalToday} colour="green" />
          <StatCard
            icon={<Activity size={18} />}
            label="Cyanotic today"
            value={cyanoticToday}
            colour={cyanoticToday > 0 ? 'orange' : 'mint'}
          />
        </div>

        {cyanoticToday > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <p className="text-sm text-red-700 font-semibold">
              ⚠️ {cyanoticToday} cyanotic episode{cyanoticToday > 1 ? 's' : ''} noted today. Please contact your care team if concerned.
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <SymptomList entries={entries} onDelete={removeEntry} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a symptom observation" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Symptom Observation">
        <SymptomForm
          babyId={selectedBaby.$id}
          userId={user?.$id || ''}
          onSubmit={addEntry}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </AppShell>
  );
}

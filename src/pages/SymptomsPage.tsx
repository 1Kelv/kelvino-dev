import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { DateNavigator } from '../components/ui/DateNavigator';
import { SymptomForm } from '../components/symptoms/SymptomForm';
import { SymptomList } from '../components/symptoms/SymptomList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useSymptoms } from '../hooks/useSymptoms';
import { babyAge, isOnDate, formatDateTime } from '../lib/utils';
import { SymptomEntry } from '../types';
import { EntryDetailModal } from '../components/ui/EntryDetailModal';

export function SymptomsPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, updateEntry, removeEntry } = useSymptoms(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SymptomEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<SymptomEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dayEntries = entries.filter((e) => isOnDate(e.datetime, selectedDate));
  const cyanoticCount = dayEntries.filter((e) => e.skinColour === 'blue').length;
  const normalCount = dayEntries.filter((e) => e.skinColour === 'normal').length;

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
      <PageHeader title="Symptoms" subtitle="Track skin colour, energy, and breathing" babyName={selectedBaby.name} babyAge={babyAge(selectedBaby.dateOfBirth)} />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Activity size={18} />} label="Logged" value={dayEntries.length} colour="mint" />
          <StatCard icon={<Activity size={18} />} label="Normal" value={normalCount} colour="green" />
          <StatCard icon={<Activity size={18} />} label="Cyanotic" value={cyanoticCount} colour={cyanoticCount > 0 ? 'orange' : 'mint'} />
        </div>

        {cyanoticCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <p className="text-sm text-red-700 font-semibold">
              ⚠️ {cyanoticCount} cyanotic episode{cyanoticCount > 1 ? 's' : ''} noted. Please contact your care team if concerned.
            </p>
          </div>
        )}

        <DateNavigator date={selectedDate} onChange={setSelectedDate} />

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <SymptomList entries={dayEntries} onDelete={removeEntry} onEdit={(entry) => setEditingEntry(entry)} onView={(entry) => setViewingEntry(entry)} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a symptom observation" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log Symptom Observation">
        <SymptomForm babyId={selectedBaby.$id} userId={user?.$id || ''} onSubmit={addEntry} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="Edit Symptom Observation">
        {editingEntry && (
          <SymptomForm
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
          title={viewingEntry.skinColour.charAt(0).toUpperCase() + viewingEntry.skinColour.slice(1) + ' skin'}
          timestamp={formatDateTime(viewingEntry.datetime)}
          fields={[
            { label: 'Skin colour', value: viewingEntry.skinColour },
            { label: 'Energy', value: viewingEntry.energyLevel },
            { label: 'Breathing', value: viewingEntry.breathing },
            { label: 'Feeding', value: viewingEntry.feedingWell ? 'Feeding well' : 'Not feeding well' },
            { label: 'Temperature', value: viewingEntry.temperatureC ? `${viewingEntry.temperatureC}°C` : undefined },
            { label: 'Heart rate', value: viewingEntry.heartRate ? `${viewingEntry.heartRate} bpm` : undefined },
            { label: 'SpO2', value: viewingEntry.spO2 ? `${viewingEntry.spO2}%` : undefined },
            { label: 'Notes', value: viewingEntry.notes || undefined },
            { label: 'Time', value: formatDateTime(viewingEntry.datetime) },
          ]}
        />
      )}
    </AppShell>
  );
}

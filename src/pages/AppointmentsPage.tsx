import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import { AppointmentList } from '../components/appointments/AppointmentList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { babyAge, formatDate } from '../lib/utils';
import { AppointmentEntry } from '../types';

export function AppointmentsPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, updateEntry, removeEntry } = useAppointments(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AppointmentEntry | null>(null);

  const now = new Date();
  const upcoming = entries.filter((e) => new Date(e.datetime) >= now);
  const nextAppt = upcoming.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0];

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Appointments" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="Appointments" babyName={selectedBaby.name} babyAge={babyAge(selectedBaby.dateOfBirth)} />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Calendar size={18} />} label="Upcoming" value={upcoming.length} colour="mint" />
          <StatCard icon={<Calendar size={18} />} label="Total" value={entries.length} colour="sky" />
          <StatCard icon={<Calendar size={18} />} label="Next appt" value={nextAppt ? formatDate(nextAppt.datetime) : '—'} colour="purple" />
        </div>

        {nextAppt && (
          <div className="bg-brand-light rounded-2xl px-4 py-3">
            <p className="text-xs font-medium text-brand-dark uppercase tracking-wide mb-1">Next appointment</p>
            <p className="font-semibold text-gray-900">{nextAppt.hospitalName}</p>
            <p className="text-sm text-gray-600">{nextAppt.department} · Dr. {nextAppt.consultantName}</p>
          </div>
        )}

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <AppointmentList
            entries={entries}
            onDelete={removeEntry}
            onEdit={(entry) => setEditingEntry(entry)}
            onStatusChange={(id, status) => updateEntry(id, { status })}
            onAdd={() => setModalOpen(true)}
          />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Add appointment" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Appointment">
        <AppointmentForm babyId={selectedBaby.$id} userId={user?.$id || ''} onSubmit={addEntry} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="Edit Appointment">
        {editingEntry && (
          <AppointmentForm
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

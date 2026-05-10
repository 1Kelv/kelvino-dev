import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AppointmentEntry } from '../../types';
import { localDateTimeNow, toLocalDateTimeInput } from '../../lib/utils';

interface AppointmentFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<AppointmentEntry, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<AppointmentEntry, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: AppointmentEntry;
}

export function AppointmentForm({ babyId, userId, onSubmit, onUpdate, onClose, initialValues }: AppointmentFormProps) {
  const isEdit = !!initialValues;
  const [datetime, setDatetime] = useState(initialValues ? toLocalDateTimeInput(initialValues.datetime) : localDateTimeNow());
  const [hospitalName, setHospitalName] = useState(initialValues?.hospitalName ?? '');
  const [department, setDepartment] = useState(initialValues?.department ?? '');
  const [consultantName, setConsultantName] = useState(initialValues?.consultantName ?? '');
  const [location, setLocation] = useState(initialValues?.location ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName || !department || !consultantName) {
      setError('Please fill in hospital, department, and consultant name.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = { babyId, userId, datetime: new Date(datetime).toISOString(), hospitalName, department, consultantName, location: location.trim() || undefined, notes: notes || undefined };
      if (isEdit && onUpdate) { await onUpdate(data); } else { await onSubmit(data); }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} appointment. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Date & Time" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
      <Input label="Hospital / Clinic name" type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g. Great Ormond Street Hospital" required />
      <Input label="Department" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Paediatric Cardiology" required />
      <Input label="Consultant name" type="text" value={consultantName} onChange={(e) => setConsultantName(e.target.value)} placeholder="e.g. Dr. Smith" required />
      <Input label="Address / Location (optional)" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Great Ormond St, London WC1N 3JH" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any questions to ask, prep notes..." rows={4}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none" />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Update Appointment' : 'Save Appointment'}</Button>
      </div>
    </form>
  );
}

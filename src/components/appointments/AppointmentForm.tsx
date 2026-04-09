// I render the form for logging an appointment
import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AppointmentEntry } from '../../types';
import { localDateTimeNow } from '../../lib/utils';

interface AppointmentFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<AppointmentEntry, '$id'>) => Promise<void>;
  onClose: () => void;
}

export function AppointmentForm({ babyId, userId, onSubmit, onClose }: AppointmentFormProps) {
  const [datetime, setDatetime] = useState(localDateTimeNow());
  const [hospitalName, setHospitalName] = useState('');
  const [department, setDepartment] = useState('');
  const [consultantName, setConsultantName] = useState('');
  const [notes, setNotes] = useState('');
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
      await onSubmit({
        babyId,
        userId,
        datetime: new Date(datetime).toISOString(),
        hospitalName,
        department,
        consultantName,
        notes: notes || undefined,
      });
      onClose();
    } catch {
      setError('Failed to save appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Date & Time"
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        required
      />
      <Input
        label="Hospital / Clinic name"
        type="text"
        value={hospitalName}
        onChange={(e) => setHospitalName(e.target.value)}
        placeholder="e.g. Great Ormond Street Hospital"
        required
      />
      <Input
        label="Department"
        type="text"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        placeholder="e.g. Paediatric Cardiology"
        required
      />
      <Input
        label="Consultant name"
        type="text"
        value={consultantName}
        onChange={(e) => setConsultantName(e.target.value)}
        placeholder="e.g. Dr. Smith"
        required
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any questions to ask, prep notes..."
          rows={4}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Save Appointment
        </Button>
      </div>
    </form>
  );
}

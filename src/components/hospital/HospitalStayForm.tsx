import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { HospitalStay } from '../../types';
import { localDateTimeNow, toLocalDateTimeInput } from '../../lib/utils';

interface HospitalStayFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<HospitalStay, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<HospitalStay, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: HospitalStay;
}

export function HospitalStayForm({ babyId, userId, onSubmit, onUpdate, onClose, initialValues }: HospitalStayFormProps) {
  const isEdit = !!initialValues;

  const toDatetimeLocal = (iso: string | undefined) =>
    iso ? toLocalDateTimeInput(iso) : localDateTimeNow();

  const [admittedDate, setAdmittedDate] = useState(toDatetimeLocal(initialValues?.admittedDate));
  const [hospital, setHospital] = useState(initialValues?.hospital ?? '');
  const [ward, setWard] = useState(initialValues?.ward ?? '');
  const [reason, setReason] = useState(initialValues?.reason ?? '');
  const [surgeryDate, setSurgeryDate] = useState(initialValues?.surgeryDate ? toLocalDateTimeInput(initialValues.surgeryDate) : '');
  const [surgeryName, setSurgeryName] = useState(initialValues?.surgeryName ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital.trim() || !reason.trim()) { setError('Hospital name and reason are required.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data: Omit<HospitalStay, '$id'> = {
        babyId,
        userId,
        admittedDate: new Date(admittedDate).toISOString(),
        hospital: hospital.trim(),
        ward: ward.trim() || undefined,
        reason: reason.trim(),
        surgeryDate: surgeryDate ? new Date(surgeryDate).toISOString() : undefined,
        surgeryName: surgeryName.trim() || undefined,
        notes: notes.trim() || undefined,
        checklistJson: initialValues?.checklistJson,
      };
      if (isEdit && onUpdate) { await onUpdate(data); } else { await onSubmit(data); }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} hospital stay.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Admitted date & time" type="datetime-local" value={admittedDate} onChange={(e) => setAdmittedDate(e.target.value)} required />
      <Input label="Hospital name" type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} placeholder="e.g. Great Ormond Street Hospital" required />
      <Input label="Ward (optional)" type="text" value={ward} onChange={(e) => setWard(e.target.value)} placeholder="e.g. Cardiac ward" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason for admission</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Post-surgical monitoring, respiratory observation..."
          rows={2}
          required
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none"
        />
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Surgery (optional)</p>
        <div className="flex flex-col gap-3">
          <Input label="Surgery date & time" type="datetime-local" value={surgeryDate} onChange={(e) => setSurgeryDate(e.target.value)} />
          <Input label="Surgery name / procedure" type="text" value={surgeryName} onChange={(e) => setSurgeryName(e.target.value)} placeholder="e.g. Total correction of Tetralogy of Fallot" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Consultant info, key observations, family notes…"
          rows={3}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none"
        />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Save Changes' : 'Admit to Hospital'}</Button>
      </div>
    </form>
  );
}

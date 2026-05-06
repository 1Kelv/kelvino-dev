import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { MedicationEntry } from '../../types';
import { localDateTimeNow, toLocalDateTimeInput } from '../../lib/utils';

interface MedicationFormProps {
  babyId: string;
  userId: string;
  userName: string;
  onSubmit: (data: Omit<MedicationEntry, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<MedicationEntry, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: MedicationEntry;
}

export function MedicationForm({ babyId, userId, userName, onSubmit, onUpdate, onClose, initialValues }: MedicationFormProps) {
  const isEdit = !!initialValues;
  const [datetime, setDatetime] = useState(initialValues ? toLocalDateTimeInput(initialValues.datetime) : localDateTimeNow());
  const [medicationName, setMedicationName] = useState(initialValues?.medicationName ?? '');
  const [dose, setDose] = useState(initialValues?.dose ? String(initialValues.dose) : '');
  const [unit, setUnit] = useState(initialValues?.unit ?? 'mg');
  const [route, setRoute] = useState<MedicationEntry['route']>(initialValues?.route ?? 'oral');
  const [administeredBy, setAdministeredBy] = useState(initialValues?.administeredBy ?? userName);
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName || !dose) { setError('Please enter medication name and dose.'); return; }
    const doseNum = parseFloat(dose);
    if (isNaN(doseNum) || doseNum <= 0) { setError('Please enter a valid dose.'); return; }
    setLoading(true);
    setError(null);
    try {
      const data = { babyId, userId, datetime: new Date(datetime).toISOString(), medicationName, dose: doseNum, unit, route, administeredBy, notes: notes || undefined };
      if (isEdit && onUpdate) { await onUpdate(data); } else { await onSubmit(data); }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} medication. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Date & Time" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
      <Input label="Medication name" type="text" value={medicationName} onChange={(e) => setMedicationName(e.target.value)} placeholder="e.g. Propranolol" required />
      <div className="flex gap-3">
        <div className="flex-1">
          <Input label="Dose" type="number" value={dose} onChange={(e) => setDose(e.target.value)} placeholder="0" min="0" step="0.01" required />
        </div>
        <div className="w-24">
          <Select label="Unit" value={unit} onChange={(e) => setUnit(e.target.value)}
            options={[{ value: 'mg', label: 'mg' }, { value: 'ml', label: 'ml' }, { value: 'mcg', label: 'mcg' }, { value: 'units', label: 'units' }]} />
        </div>
      </div>
      <Select label="Route" value={route} onChange={(e) => setRoute(e.target.value as MedicationEntry['route'])}
        options={[{ value: 'oral', label: 'Oral' }, { value: 'IV', label: 'IV' }, { value: 'topical', label: 'Topical' }, { value: 'inhaled', label: 'Inhaled' }, { value: 'other', label: 'Other' }]} />
      <Input label="Administered by" type="text" value={administeredBy} onChange={(e) => setAdministeredBy(e.target.value)} placeholder="Your name" required />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any observations..." rows={3}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none" />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Update Medication' : 'Save Medication'}</Button>
      </div>
    </form>
  );
}

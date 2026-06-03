import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { SymptomEntry } from '../../types';
import { localDateTimeNow, toLocalDateTimeInput } from '../../lib/utils';

interface SymptomFormProps {
  babyId: string;
  userId: string;
  onSubmit: (data: Omit<SymptomEntry, '$id'>) => Promise<void>;
  onUpdate?: (data: Partial<Omit<SymptomEntry, '$id'>>) => Promise<void>;
  onClose: () => void;
  initialValues?: SymptomEntry;
}

export function SymptomForm({ babyId, userId, onSubmit, onUpdate, onClose, initialValues }: SymptomFormProps) {
  const isEdit = !!initialValues;
  const [datetime, setDatetime] = useState(initialValues ? toLocalDateTimeInput(initialValues.datetime) : localDateTimeNow());
  const [skinColour, setSkinColour] = useState<SymptomEntry['skinColour']>(initialValues?.skinColour ?? 'normal');
  const [energyLevel, setEnergyLevel] = useState<SymptomEntry['energyLevel']>(initialValues?.energyLevel ?? 'normal');
  const [breathing, setBreathing] = useState<SymptomEntry['breathing']>(initialValues?.breathing ?? 'normal');
  const [feedingWell, setFeedingWell] = useState(initialValues?.feedingWell ?? true);
  const [temperatureC, setTemperatureC] = useState(initialValues?.temperatureC ? String(initialValues.temperatureC) : '');
  const [heartRate, setHeartRate] = useState(initialValues?.heartRate ? String(initialValues.heartRate) : '');
  const [spO2, setSpO2] = useState(initialValues?.spO2 ? String(initialValues.spO2) : '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCyanotic = skinColour === 'blue';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = { babyId, userId, datetime: new Date(datetime).toISOString(), skinColour, energyLevel, breathing, feedingWell, temperatureC: temperatureC ? parseFloat(temperatureC) : undefined, heartRate: heartRate ? parseInt(heartRate) : undefined, spO2: spO2 ? parseFloat(spO2) : undefined, notes: notes || undefined };
      if (isEdit && onUpdate) { await onUpdate(data); } else { await onSubmit(data); }
      onClose();
    } catch {
      setError(`Failed to ${isEdit ? 'update' : 'save'} symptom entry. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Date & Time" type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
      <Select label="Skin colour" value={skinColour} onChange={(e) => setSkinColour(e.target.value as SymptomEntry['skinColour'])}
        options={[{ value: 'normal', label: 'Normal (pink)' }, { value: 'pale', label: 'Pale' }, { value: 'blue', label: 'Blue / Cyanotic' }, { value: 'yellow', label: 'Yellow (jaundice)' }, { value: 'mottled', label: 'Mottled' }]} />
      {isCyanotic && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700 font-semibold">⚠️ Cyanotic episode noted — if prolonged or severe, contact emergency services immediately.</p>
        </div>
      )}
      <Select label="Energy level" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value as SymptomEntry['energyLevel'])}
        options={[{ value: 'normal', label: 'Normal' }, { value: 'tired', label: 'More tired than usual' }, { value: 'very_tired', label: 'Very tired / lethargic' }, { value: 'unusually_active', label: 'Unusually active' }]} />
      <Select label="Breathing" value={breathing} onChange={(e) => setBreathing(e.target.value as SymptomEntry['breathing'])}
        options={[{ value: 'normal', label: 'Normal' }, { value: 'fast', label: 'Fast' }, { value: 'laboured', label: 'Laboured / working hard' }, { value: 'noisy', label: 'Noisy' }]} />
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Feeding well?</p>
          <p className="text-xs text-gray-500">Poor feeding can indicate discomfort or illness</p>
        </div>
        <button type="button" onClick={() => setFeedingWell(!feedingWell)}
          className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${feedingWell ? 'bg-brand-mint' : 'bg-gray-300'}`}>
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${feedingWell ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>
      <Input label="Temperature °C (optional)" type="number" value={temperatureC} onChange={(e) => setTemperatureC(e.target.value)} placeholder="e.g. 37.2" min="30" max="45" step="0.1" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Heart rate bpm (optional)" type="number" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="e.g. 140" min="0" max="300" step="1" />
        <Input label="SpO2 % (optional)" type="number" value={spO2} onChange={(e) => setSpO2(e.target.value)} placeholder="e.g. 98" min="0" max="100" step="1" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional observations..." rows={3}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none" />
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
        <Button type="submit" loading={loading} className="flex-1">{isEdit ? 'Update Observation' : 'Save Observation'}</Button>
      </div>
    </form>
  );
}

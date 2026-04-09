// I render the growth tracking page with chart and measurement list
import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { GrowthForm } from '../components/growth/GrowthForm';
import { GrowthList } from '../components/growth/GrowthList';
import { GrowthChart } from '../components/growth/GrowthChart';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useGrowth } from '../hooks/useGrowth';
import { babyAge, formatDate } from '../lib/utils';

const UNIT_KEY = 'mylestone_growth_unit';

export function GrowthPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, addEntry, removeEntry } = useGrowth(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [useKg, setUseKg] = useState(() => localStorage.getItem(UNIT_KEY) !== 'lbs');

  const toggleUnit = () => {
    const next = !useKg;
    setUseKg(next);
    localStorage.setItem(UNIT_KEY, next ? 'kg' : 'lbs');
  };

  const latest = entries[0];
  const oldest = entries[entries.length - 1];

  const totalGain = latest && oldest && oldest.$id !== latest.$id
    ? useKg
      ? `+${(latest.weightKg - oldest.weightKg).toFixed(2)} kg`
      : `+${(latest.weightLbs - oldest.weightLbs).toFixed(2)} lbs`
    : null;

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Growth" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Growth"
        babyName={selectedBaby.name}
        babyAge={babyAge(selectedBaby.dateOfBirth)}
        action={
          <button
            onClick={toggleUnit}
            className="text-sm font-semibold text-brand-mint bg-brand-light px-3 py-2 rounded-xl min-h-[44px]"
          >
            {useKg ? 'kg' : 'lbs'}
          </button>
        }
      />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<TrendingUp size={18} />}
            label="Current weight"
            value={latest ? (useKg ? `${latest.weightKg.toFixed(2)} kg` : `${latest.weightLbs.toFixed(2)} lbs`) : '—'}
            colour="mint"
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            label="Last measured"
            value={latest ? formatDate(latest.date) : '—'}
            colour="sky"
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            label="Total gain"
            value={totalGain || '—'}
            colour="green"
            trendUp={true}
          />
        </div>

        {entries.length > 1 && <GrowthChart entries={entries} useKg={useKg} />}

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        ) : (
          <GrowthList entries={entries} useKg={useKg} onDelete={removeEntry} onAdd={() => setModalOpen(true)} />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Add growth measurement" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Growth Measurement">
        <GrowthForm
          babyId={selectedBaby.$id}
          userId={user?.$id || ''}
          onSubmit={addEntry}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </AppShell>
  );
}

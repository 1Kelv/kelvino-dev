import React, { useState } from 'react';
import { Droplets } from 'lucide-react';
import { format, subDays } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FAB } from '../components/layout/FAB';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { DateNavigator } from '../components/ui/DateNavigator';
import { FeedForm } from '../components/feeds/FeedForm';
import { FeedList } from '../components/feeds/FeedList';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useFeeds } from '../hooks/useFeeds';
import { babyAge, isOnDate, formatTime } from '../lib/utils';
import { FeedEntry } from '../types';

export function FeedsPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, error, stats, addEntry, updateEntry, removeEntry } = useFeeds(selectedBaby?.$id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FeedEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dayEntries = entries.filter((e) => isOnDate(e.datetime, selectedDate));
  const dayMl = dayEntries.reduce((sum, e) => sum + e.amountMl, 0);
  const lastFeed = entries[0];

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayTotal = entries.filter((e) => e.datetime.startsWith(dayStr)).reduce((sum, e) => sum + e.amountMl, 0);
    return { day: format(day, 'EEE'), ml: dayTotal };
  });

  if (!selectedBaby) {
    return (
      <AppShell>
        <PageHeader title="Feeds" />
        <div className="p-5 text-center text-gray-500">No baby profile selected.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Feeds"
        babyName={selectedBaby.name}
        babyAge={babyAge(selectedBaby.dateOfBirth)}
      />
      <div className="p-5 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Droplets size={18} />}
            label="Total ml"
            value={dayMl > 0 ? `${dayMl} ml` : '—'}
            colour="mint"
          />
          <StatCard
            icon={<Droplets size={18} />}
            label="Feeds"
            value={dayEntries.length}
            colour="sky"
          />
          <StatCard
            icon={<Droplets size={18} />}
            label="Last feed"
            value={lastFeed ? formatTime(lastFeed.datetime) : '—'}
            colour="purple"
          />
        </div>

        {stats.avgFeedsPerDay > 0 && (
          <div className="bg-brand-light rounded-2xl px-4 py-3 flex justify-between">
            <div className="text-center">
              <p className="text-xs text-brand-dark font-medium">Avg ml/day (7d)</p>
              <p className="text-lg font-bold text-brand-dark">{stats.avgMlPerDay} ml</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-brand-dark font-medium">Avg feeds/day (7d)</p>
              <p className="text-lg font-bold text-brand-dark">{stats.avgFeedsPerDay}</p>
            </div>
          </div>
        )}

        {entries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">ml per day (last 7 days)</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                  formatter={(val: number) => [`${val} ml`, 'Total']}
                />
                <Bar dataKey="ml" fill="#4ECDC4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <DateNavigator date={selectedDate} onChange={setSelectedDate} />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && (
          <FeedList
            entries={dayEntries}
            onDelete={removeEntry}
            onEdit={(entry) => setEditingEntry(entry)}
            onAdd={() => setModalOpen(true)}
          />
        )}
      </div>

      <FAB onClick={() => setModalOpen(true)} label="Log a feed" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log a Feed">
        <FeedForm
          babyId={selectedBaby.$id}
          userId={user?.$id || ''}
          onSubmit={addEntry}
          onClose={() => setModalOpen(false)}
        />
      </Modal>

      <Modal open={!!editingEntry} onClose={() => setEditingEntry(null)} title="Edit Feed">
        {editingEntry && (
          <FeedForm
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

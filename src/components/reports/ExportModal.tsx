import React, { useState } from 'react';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileDown, Loader } from 'lucide-react';
import { BabyReport } from './BabyReport';
import { useBabyContext } from '../../lib/BabyContext';
import { useFeeds } from '../../hooks/useFeeds';
import { useNappies } from '../../hooks/useNappies';
import { useMedications } from '../../hooks/useMedications';
import { useSymptoms } from '../../hooks/useSymptoms';
import { useGrowth } from '../../hooks/useGrowth';
import { useSleep } from '../../hooks/useSleep';
import { useAppointments } from '../../hooks/useAppointments';

type Period = '7d' | '30d' | '90d';

const PERIODS: { value: Period; label: string; days: number }[] = [
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '90d', label: 'Last 3 months', days: 90 },
];

function inRange(dt: string, from: Date, to: Date) {
  const d = new Date(dt);
  return d >= from && d <= to;
}

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const { selectedBaby } = useBabyContext();
  const [period, setPeriod] = useState<Period>('7d');

  const { entries: feeds } = useFeeds(selectedBaby?.$id);
  const { entries: nappies } = useNappies(selectedBaby?.$id);
  const { entries: medications } = useMedications(selectedBaby?.$id);
  const { entries: symptoms } = useSymptoms(selectedBaby?.$id);
  const { entries: growth } = useGrowth(selectedBaby?.$id);
  const { entries: sleep } = useSleep(selectedBaby?.$id);
  const { entries: appointments } = useAppointments(selectedBaby?.$id);

  if (!open || !selectedBaby) return null;

  const days = PERIODS.find(p => p.value === period)!.days;
  const to = endOfDay(new Date());
  const from = startOfDay(subDays(new Date(), days - 1));

  const filteredFeeds = feeds.filter(e => inRange(e.datetime, from, to));
  const filteredNappies = nappies.filter(e => inRange(e.datetime, from, to));
  const filteredMeds = medications.filter(e => inRange(e.datetime, from, to));
  const filteredSymptoms = symptoms.filter(e => inRange(e.datetime, from, to));
  const filteredGrowth = growth.filter(e => inRange(e.date, from, to));
  const filteredSleep = sleep.filter(e => inRange(e.date, from, to));
  const filteredAppts = appointments.filter(e => inRange(e.datetime, from, to));

  const periodLabel = `${format(from, 'd MMM yyyy')} – ${format(to, 'd MMM yyyy')}`;
  const generatedOn = format(new Date(), 'd MMM yyyy');
  const fileName = `Mylestone_${selectedBaby.name.replace(/\s+/g, '_')}_${format(from, 'ddMMMyyyy')}-${format(to, 'ddMMMyyyy')}.pdf`;

  const doc = (
    <BabyReport
      baby={selectedBaby}
      period={periodLabel}
      generatedOn={generatedOn}
      feeds={filteredFeeds}
      nappies={filteredNappies}
      medications={filteredMeds}
      symptoms={filteredSymptoms}
      growth={filteredGrowth}
      sleep={filteredSleep}
      appointments={filteredAppts}
    />
  );

  const counts = [
    { label: 'Feeds', count: filteredFeeds.length },
    { label: 'Nappies', count: filteredNappies.length },
    { label: 'Medications', count: filteredMeds.length },
    { label: 'Symptoms', count: filteredSymptoms.length },
    { label: 'Growth', count: filteredGrowth.length },
    { label: 'Sleep', count: filteredSleep.length },
    { label: 'Appointments', count: filteredAppts.length },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="px-5 pt-3 pb-6 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export Health Report</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">PDF ready to share with your care team</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500">
                  <X size={18} />
                </button>
              </div>

              {/* Period selector */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Report period</p>
                <div className="flex gap-2">
                  {PERIODS.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setPeriod(p.value)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        period === p.value
                          ? 'bg-brand-mint text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center">{periodLabel}</p>
              </div>

              {/* What's included */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">What's included</p>
                <div className="grid grid-cols-4 gap-2">
                  {counts.map(({ label, count }) => (
                    <div key={label} className="text-center">
                      <p className={`text-lg font-extrabold ${count > 0 ? 'text-brand-mint' : 'text-gray-300 dark:text-gray-600'}`}>{count}</p>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download button */}
              <PDFDownloadLink document={doc} fileName={fileName}>
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-mint to-brand-dark text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <><Loader size={18} className="animate-spin" /> Preparing PDF…</> : <><FileDown size={18} /> Download PDF Report</>}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

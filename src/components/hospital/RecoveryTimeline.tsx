import React, { useState } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineEntry } from './hospitalExtras';
import { Button } from '../ui/Button';

interface RecoveryTimelineProps {
  entries: TimelineEntry[];
  admittedDate: string;
  onChange: (entries: TimelineEntry[]) => void;
}

function dayNumber(admittedDate: string, entryDate: string): number {
  const start = new Date(admittedDate);
  start.setHours(0, 0, 0, 0);
  const entry = new Date(entryDate);
  entry.setHours(0, 0, 0, 0);
  const diff = entry.getTime() - start.getTime();
  return Math.floor(diff / 86400000) + 1;
}

function formatEntryDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function RecoveryTimeline({ entries, admittedDate, onChange }: RecoveryTimelineProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [text, setText] = useState('');

  const inputClass =
    'text-sm rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30';

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const handleAdd = () => {
    if (!date || !text.trim()) return;
    const newEntry: TimelineEntry = {
      id: `tl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      date,
      text: text.trim(),
    };
    onChange([...entries, newEntry]);
    setText('');
    setDate(new Date().toISOString().slice(0, 10));
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    onChange(entries.filter((e) => e.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recovery Timeline</p>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-mint hover:text-brand-dark transition-colors"
        >
          <PlusCircle size={13} />
          Add entry
        </button>
      </div>

      <div className="flex flex-col gap-0">
        <AnimatePresence initial={false}>
          {sorted.map((entry, idx) => {
            const dayNum = dayNumber(admittedDate, entry.date);
            const dayLabel = dayNum >= 1 ? `Day ${dayNum}` : `Day ${dayNum}`;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ type: 'spring', stiffness: 360, damping: 26, delay: idx * 0.03 }}
                className="flex gap-3 group"
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-mint flex-shrink-0 mt-1.5 ring-2 ring-brand-mint/30" />
                  {idx < sorted.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-600 my-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-brand-mint uppercase tracking-wide">{dayLabel}</span>
                        <span className="text-[11px] text-gray-400">{formatEntryDate(entry.date)}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 leading-snug">{entry.text}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 mt-0.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {entries.length === 0 && !showAdd && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic py-1">
            No timeline entries yet. Tap Add entry to log daily progress.
          </p>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 flex flex-col gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass + ' w-full'}
              />
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                placeholder="What happened today? (e.g. Moved to ward)"
                className={inputClass + ' w-full'}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => { setShowAdd(false); setText(''); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAdd}
                  disabled={!date || !text.trim()}
                  className="flex-1"
                >
                  Add Entry
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { MilestoneForm } from '../components/timeline/MilestoneForm';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useMilestones } from '../hooks/useMilestones';
import { MilestoneEntry } from '../types';
import { formatDateTime } from '../lib/utils';

const CATEGORY_COLOURS: Record<MilestoneEntry['category'], { dot: string; bg: string; text: string; label: string }> = {
  developmental: { dot: 'bg-brand-mint', bg: 'bg-brand-light dark:bg-brand-mint/10', text: 'text-brand-dark dark:text-brand-mint', label: 'Developmental' },
  achievement:   { dot: 'bg-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', label: 'Achievement' },
  emotional:     { dot: 'bg-pink-400',   bg: 'bg-pink-50 dark:bg-pink-900/20',     text: 'text-pink-700 dark:text-pink-400',   label: 'Emotional' },
  medical:       { dot: 'bg-blue-400',   bg: 'bg-blue-50 dark:bg-blue-900/20',     text: 'text-blue-700 dark:text-blue-400',   label: 'Medical' },
};

function groupByMonthYear(entries: MilestoneEntry[]): { label: string; items: MilestoneEntry[] }[] {
  const map = new Map<string, MilestoneEntry[]>();
  for (const e of entries) {
    const key = new Date(e.datetime).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
}

export function TimelinePage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { entries, loading, addEntry, updateEntry, removeEntry } = useMilestones(selectedBaby?.$id);

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MilestoneEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MilestoneEntry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openEdit = (entry: MilestoneEntry) => setEditTarget(entry);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try { await removeEntry(deleteTarget.$id); setDeleteTarget(null); }
    catch { /* ignore */ }
    finally { setDeleteLoading(false); }
  };

  const groups = groupByMonthYear(entries);

  return (
    <AppShell>
      <div className="bg-gradient-to-br from-yellow-400 to-brand-mint px-5 pt-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-extrabold font-heading">
              {selectedBaby ? `${selectedBaby.name}'s Journey` : 'Journey'}
            </h1>
            <p className="text-white/80 text-xs">{entries.length} milestone{entries.length !== 1 ? 's' : ''} captured</p>
          </div>
        </div>
      </div>

      <div className="p-5 -mt-4 flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && entries.length === 0 && (
          <EmptyState
            emoji="🌱"
            heading="No milestones yet"
            subtext={`Start capturing ${selectedBaby?.name ?? 'baby'}'s special moments — first smiles, medical wins, and everything in between.`}
            ctaLabel="Add first milestone"
            onCta={() => setAddOpen(true)}
          />
        )}

        {!loading && groups.length > 0 && (
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex flex-col gap-0">
              {groups.map(({ label, items }) => (
                <div key={label}>
                  <div className="relative flex items-center gap-3 mb-3 mt-2 first:mt-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center z-10 flex-shrink-0 border-2 border-white dark:border-gray-900">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-none text-center px-1">
                        {label.split(' ')[0].slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</p>
                  </div>

                  {items.map((entry, i) => {
                    const colours = CATEGORY_COLOURS[entry.category];
                    return (
                      <motion.div
                        key={entry.$id}
                        className="relative flex gap-3 pb-4"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <div className={`w-10 h-10 rounded-full ${colours.dot} flex items-center justify-center z-10 flex-shrink-0 text-lg border-2 border-white dark:border-gray-900`}>
                          {entry.emoji ?? '📍'}
                        </div>
                        <div className={`flex-1 rounded-2xl px-4 py-3 ${colours.bg} border border-transparent`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{entry.title}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDateTime(entry.datetime)}</p>
                              {entry.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{entry.description}</p>
                              )}
                              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-2 ${colours.bg} ${colours.text} border border-current/20`}>
                                {colours.label}
                              </span>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={() => openEdit(entry)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-brand-mint hover:bg-white/60 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(entry)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedBaby && (
        <motion.button
          onClick={() => setAddOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="fixed z-40 w-14 h-14 rounded-full bg-brand-mint text-white shadow-lg hover:bg-brand-dark flex items-center justify-center"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)', right: '20px' }}
          aria-label="Add milestone"
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Milestone">
        {selectedBaby && user && (
          <MilestoneForm
            babyId={selectedBaby.$id}
            userId={user.$id}
            onSubmit={addEntry}
            onClose={() => setAddOpen(false)}
          />
        )}
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Milestone">
        {editTarget && selectedBaby && user && (
          <MilestoneForm
            babyId={selectedBaby.$id}
            userId={user.$id}
            onSubmit={addEntry}
            onUpdate={(data) => updateEntry(editTarget.$id, data)}
            onClose={() => setEditTarget(null)}
            initialValues={editTarget}
          />
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Milestone">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Delete <span className="font-semibold text-gray-900 dark:text-white">"{deleteTarget?.title}"</span>? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} className="flex-1">Cancel</Button>
            <Button loading={deleteLoading} onClick={handleDelete} className="flex-1 !bg-red-500 hover:!bg-red-600">Delete</Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

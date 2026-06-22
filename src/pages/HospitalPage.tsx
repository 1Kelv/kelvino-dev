import React, { useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, CheckSquare, Square, LogOut, Stethoscope, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { HospitalStayForm } from '../components/hospital/HospitalStayForm';
import { PhaseTracker } from '../components/hospital/PhaseTracker';
import { CareTeamSection } from '../components/hospital/CareTeamSection';
import { RecoveryTimeline } from '../components/hospital/RecoveryTimeline';
import { RoundQuestions } from '../components/hospital/RoundQuestions';
import { parseExtras, HospitalExtras, CareTeamMember, TimelineEntry, RoundQuestion, ChecklistItem } from '../components/hospital/hospitalExtras';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useHospitalStays } from '../hooks/useHospitalStays';
import { HospitalStay } from '../types';
import { formatDateTime, formatDate } from '../lib/utils';

function surgeryCountdown(surgeryDate: string): string {
  const diff = new Date(surgeryDate).getTime() - Date.now();
  if (diff <= 0) return 'Completed';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

function stayDuration(admittedDate: string, dischargeDate?: string): string {
  const start = new Date(admittedDate);
  const end = dischargeDate ? new Date(dischargeDate) : new Date();
  if (start > end) return 'Upcoming';
  const diff = end.getTime() - start.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Less than a day';
  return `${days} day${days !== 1 ? 's' : ''}`;
}

function admissionCountdown(admittedDate: string): string {
  const diff = new Date(admittedDate).getTime() - Date.now();
  if (diff <= 0) return '';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `in ${days}d ${hours}h`;
  return `in ${hours}h`;
}

export function HospitalPage() {
  const { selectedBaby } = useBabyContext();
  const { user } = useAuth();
  const { stays, activeStay, loading, addStay, updateStay, removeStay } = useHospitalStays(selectedBaby?.$id);

  const [admitOpen, setAdmitOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HospitalStay | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HospitalStay | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dischargeOpen, setDischargeOpen] = useState(false);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeLoading, setDischargeLoading] = useState(false);
  const [newCheckItem, setNewCheckItem] = useState('');

  const isUpcoming = activeStay ? new Date(activeStay.admittedDate) > new Date() : false;
  const extras: HospitalExtras = activeStay ? parseExtras(activeStay.checklistJson) : { checklist: [], timeline: [], careTeam: [], roundQuestions: [] };
  const checklist = extras.checklist;

  const saveExtras = useCallback(async (newExtras: HospitalExtras) => {
    if (!activeStay) return;
    await updateStay(activeStay.$id, { checklistJson: JSON.stringify(newExtras) });
  }, [activeStay, updateStay]);

  const setPhase = useCallback(async (phase: string) => {
    if (!activeStay) return;
    await updateStay(activeStay.$id, { phase });
  }, [activeStay, updateStay]);

  const toggleCheckItem = async (idx: number) => {
    const updated = checklist.map((item: ChecklistItem, i: number) => i === idx ? { ...item, completed: !item.completed } : item);
    await saveExtras({ ...extras, checklist: updated });
  };

  const addCheckItem = async () => {
    if (!newCheckItem.trim()) return;
    await saveExtras({ ...extras, checklist: [...checklist, { title: newCheckItem.trim(), completed: false }] });
    setNewCheckItem('');
  };

  const removeCheckItem = async (idx: number) => {
    await saveExtras({ ...extras, checklist: checklist.filter((_: ChecklistItem, i: number) => i !== idx) });
  };

  const handleCareTeamChange = async (members: CareTeamMember[]) => {
    await saveExtras({ ...extras, careTeam: members });
  };

  const handleTimelineChange = async (entries: TimelineEntry[]) => {
    await saveExtras({ ...extras, timeline: entries });
  };

  const handleRoundQuestionsChange = async (questions: RoundQuestion[]) => {
    await saveExtras({ ...extras, roundQuestions: questions });
  };

  const handleDischarge = async () => {
    if (!activeStay || !dischargeDate) return;
    setDischargeLoading(true);
    try {
      await updateStay(activeStay.$id, { dischargeDate: new Date(dischargeDate).toISOString() });
      setDischargeOpen(false);
    } catch { /* ignore */ }
    finally { setDischargeLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try { await removeStay(deleteTarget.$id); setDeleteTarget(null); }
    catch { /* ignore */ }
    finally { setDeleteLoading(false); }
  };

  const pastStays = stays.filter((s) => !!s.dischargeDate);
  const surgeryPending = activeStay?.surgeryDate && new Date(activeStay.surgeryDate) > new Date();
  const surgeryPast = activeStay?.surgeryDate && new Date(activeStay.surgeryDate) <= new Date();
  const completedChecklist = checklist.filter((i: ChecklistItem) => i.completed).length;

  return (
    <AppShell>
      <div className={`px-5 pt-6 pb-8 ${activeStay ? (isUpcoming ? 'bg-gradient-to-br from-orange-500 to-amber-400' : 'bg-gradient-to-br from-blue-600 to-blue-400') : 'bg-gradient-to-br from-brand-dark to-brand-mint'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <Stethoscope size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-extrabold font-heading">Hospital Mode</h1>
            {activeStay ? (
              isUpcoming
                ? <p className="text-white/80 text-xs">Upcoming · {activeStay.hospital}</p>
                : <p className="text-white/80 text-xs">Currently admitted · {activeStay.hospital}</p>
            ) : (
              <p className="text-white/80 text-xs">No active hospital stay</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 -mt-4 flex flex-col gap-4">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && !activeStay && stays.length === 0 && (
          <EmptyState
            emoji="🏥"
            heading="No hospital stays logged"
            subtext={`Log a hospital admission for ${selectedBaby?.name ?? 'baby'} to track surgery countdowns, discharge checklists, and stay history.`}
            ctaLabel="Log hospital admission"
            onCta={() => setAdmitOpen(true)}
          />
        )}

        {/* Phase Tracker — shown whenever there is an active stay */}
        {activeStay && (
          <PhaseTracker
            currentPhase={activeStay.phase}
            onSelect={setPhase}
          />
        )}

        {/* Active stay */}
        {activeStay && (
          <motion.div
            className={`bg-white dark:bg-gray-800 rounded-3xl shadow-sm border-2 overflow-hidden ${isUpcoming ? 'border-orange-200 dark:border-orange-800' : 'border-blue-200 dark:border-blue-800'}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`px-4 py-3 flex items-center justify-between ${isUpcoming ? 'bg-orange-50 dark:bg-orange-900/30' : 'bg-blue-50 dark:bg-blue-900/30'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isUpcoming ? 'bg-orange-500' : 'bg-blue-500 animate-pulse'}`} />
                  <p className={`text-sm font-bold ${isUpcoming ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'}`}>
                    {isUpcoming ? 'Upcoming Admission' : 'Currently Admitted'}
                  </p>
                </div>
                <p className={`text-xs mt-0.5 ${isUpcoming ? 'text-orange-500 dark:text-orange-400' : 'text-blue-500 dark:text-blue-400'}`}>
                  {isUpcoming
                    ? `Admitted ${admissionCountdown(activeStay.admittedDate)} · ${formatDateTime(activeStay.admittedDate)}`
                    : `${stayDuration(activeStay.admittedDate)} · since ${formatDateTime(activeStay.admittedDate)}`}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditTarget(activeStay)}
                  className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800/40"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(activeStay)}
                  className="p-1.5 rounded-lg text-blue-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="px-4 py-4 flex flex-col gap-4">
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">{activeStay.hospital}</p>
                {activeStay.ward && <p className="text-xs text-gray-500">{activeStay.ward}</p>}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activeStay.reason}</p>
              </div>

              {/* Surgery countdown */}
              {activeStay.surgeryDate && (
                <div className={`rounded-2xl px-4 py-3 ${surgeryPending ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={surgeryPending ? 'text-orange-500' : 'text-green-500'} />
                    <p className={`text-sm font-semibold ${surgeryPending ? 'text-orange-700 dark:text-orange-300' : 'text-green-700 dark:text-green-300'}`}>
                      {activeStay.surgeryName || 'Surgery'}
                    </p>
                    {surgeryPending && (
                      <Badge colour="orange">{surgeryCountdown(activeStay.surgeryDate)}</Badge>
                    )}
                    {surgeryPast && (
                      <Badge colour="green">Completed</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDateTime(activeStay.surgeryDate)}</p>
                </div>
              )}

              {/* Notes */}
              {activeStay.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 italic">
                  {activeStay.notes}
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-gray-700" />

              {/* Care Team */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl px-3 py-3">
                <CareTeamSection
                  members={extras.careTeam}
                  onChange={handleCareTeamChange}
                />
              </div>

              {/* Recovery Timeline */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl px-3 py-3">
                <RecoveryTimeline
                  entries={extras.timeline}
                  admittedDate={activeStay.admittedDate}
                  onChange={handleTimelineChange}
                />
              </div>

              {/* Round Questions */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl px-3 py-3">
                <RoundQuestions
                  questions={extras.roundQuestions}
                  onChange={handleRoundQuestionsChange}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-gray-700" />

              {/* Discharge checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Discharge checklist</p>
                  <span className="text-xs text-gray-400">{completedChecklist}/{checklist.length}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {checklist.map((item: ChecklistItem, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <button
                        onClick={() => toggleCheckItem(idx)}
                        className={`flex-shrink-0 transition-colors ${item.completed ? 'text-brand-mint' : 'text-gray-300 dark:text-gray-600'}`}
                      >
                        {item.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                      <p className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {item.title}
                      </p>
                      <button
                        onClick={() => removeCheckItem(idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <input
                    value={newCheckItem}
                    onChange={(e) => setNewCheckItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCheckItem())}
                    placeholder="Add checklist item…"
                    className="flex-1 text-sm rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-mint focus:outline-none"
                  />
                  <Button type="button" onClick={addCheckItem} size="sm">Add</Button>
                </div>
              </div>

              {/* Discharge button */}
              <button
                onClick={() => { setDischargeDate(''); setDischargeOpen(true); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border-2 border-dashed border-green-300 dark:border-green-700 text-sm font-semibold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors mt-1"
              >
                <LogOut size={16} />
                Mark as discharged
              </button>
            </div>
          </motion.div>
        )}

        {/* No active stay — log new */}
        {!loading && !activeStay && stays.length > 0 && (
          <Button onClick={() => setAdmitOpen(true)} className="w-full">
            Log new hospital admission
          </Button>
        )}

        {/* Past stays */}
        {pastStays.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
              Past stays ({pastStays.length})
            </h2>
            <div className="flex flex-col gap-3">
              {pastStays.map((stay) => (
                <div key={stay.$id} className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{stay.hospital}</p>
                      {stay.ward && <p className="text-xs text-gray-400">{stay.ward}</p>}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stay.reason}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge colour="gray">{stayDuration(stay.admittedDate, stay.dischargeDate ?? undefined)}</Badge>
                        {stay.surgeryName && <Badge colour="mint">{stay.surgeryName}</Badge>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(stay.admittedDate)} – {stay.dischargeDate ? formatDate(stay.dischargeDate) : 'ongoing'}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(stay)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAB — only show if no active stay */}
      {selectedBaby && !activeStay && (
        <motion.button
          onClick={() => setAdmitOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="fixed z-40 w-14 h-14 rounded-full bg-brand-mint text-white shadow-lg hover:bg-brand-dark flex items-center justify-center"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)', right: '20px' }}
          aria-label="Log hospital admission"
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      )}

      <Modal open={admitOpen} onClose={() => setAdmitOpen(false)} title="Log Hospital Admission">
        {selectedBaby && user && (
          <HospitalStayForm
            babyId={selectedBaby.$id}
            userId={user.$id}
            onSubmit={addStay}
            onClose={() => setAdmitOpen(false)}
          />
        )}
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Hospital Stay">
        {editTarget && selectedBaby && user && (
          <HospitalStayForm
            babyId={selectedBaby.$id}
            userId={user.$id}
            onSubmit={addStay}
            onUpdate={(data) => updateStay(editTarget.$id, data)}
            onClose={() => setEditTarget(null)}
            initialValues={editTarget}
          />
        )}
      </Modal>

      <Modal open={dischargeOpen} onClose={() => setDischargeOpen(false)} title="Mark as Discharged">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            When was {selectedBaby?.name} discharged from {activeStay?.hospital}?
          </p>
          <Input
            label="Discharge date & time"
            type="datetime-local"
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
            required
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDischargeOpen(false)} className="flex-1">Cancel</Button>
            <Button loading={dischargeLoading} onClick={handleDischarge} disabled={!dischargeDate} className="flex-1 !bg-green-500 hover:!bg-green-600">Discharge</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Stay">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Delete the stay at <span className="font-semibold text-gray-900 dark:text-white">{deleteTarget?.hospital}</span>? This cannot be undone.
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

import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Heart, Droplets, Baby, Pill, Calendar, Plus, LogOut, ChevronRight, ChevronDown, Activity, Sun, Moon, MessageSquarePlus, Pencil, UserCircle, Share2, Copy, Check, FileDown, Trash2, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { useFeeds } from '../hooks/useFeeds';
import { useNappies } from '../hooks/useNappies';
import { useAppointments } from '../hooks/useAppointments';
import { useSymptoms } from '../hooks/useSymptoms';
import { useMedications } from '../hooks/useMedications';
import { useSleep } from '../hooks/useSleep';
import { useHospitalStays } from '../hooks/useHospitalStays';
import { babyAge, isToday, formatDateTime, formatTime, isMonthBirthday } from '../lib/utils';
import { localDateNow } from '../lib/utils';
import { MilestoneCelebration } from '../components/ui/MilestoneCelebration';
import { ExportModal } from '../components/reports/ExportModal';
import { NameMeaningCard } from '../components/ui/NameMeaningCard';
import { TrendInsightsCard } from '../components/ui/TrendInsightsCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function HomePage() {
  const { selectedBaby, babies, addBaby, updateBaby, removeBaby, generateShareCode, joinWithCode, setSelectedBaby, loading: babyContextLoading } = useBabyContext();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { entries: feeds } = useFeeds(selectedBaby?.$id);
  const { entries: nappies } = useNappies(selectedBaby?.$id);
  const { entries: appointments } = useAppointments(selectedBaby?.$id);
  const { entries: symptoms } = useSymptoms(selectedBaby?.$id);
  const { entries: medications } = useMedications(selectedBaby?.$id);
  const { entries: sleep } = useSleep(selectedBaby?.$id);
  const { activeStay } = useHospitalStays(selectedBaby?.$id);

  // Add baby modal
  const [addBabyOpen, setAddBabyOpen] = useState(false);
  const [addBabyTab, setAddBabyTab] = useState<'new' | 'join'>('new');
  const [babyName, setBabyName] = useState('');
  const [babyDob, setBabyDob] = useState(localDateNow());
  const [babyGender, setBabyGender] = useState('');
  const [babyDiagnosis, setBabyDiagnosis] = useState('');
  const [babyNhsNumber, setBabyNhsNumber] = useState('');
  const [babyLoading, setBabyLoading] = useState(false);
  const [babyError, setBabyError] = useState<string | null>(null);

  // Join with code
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Edit baby modal
  const [editBabyOpen, setEditBabyOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editDiagnosis, setEditDiagnosis] = useState('');
  const [editNhsNumber, setEditNhsNumber] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Share modal
  const [shareBabyOpen, setShareBabyOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Export modal
  const [exportOpen, setExportOpen] = useState(false);

  // NHS copy
  const [nhsCopied, setNhsCopied] = useState(false);
  const handleCopyNhs = async () => {
    if (!selectedBaby?.nhsNumber) return;
    try {
      await navigator.clipboard.writeText(selectedBaby.nhsNumber);
      setNhsCopied(true);
      setTimeout(() => setNhsCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  // Baby switcher
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Delete baby
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openAddBaby = (tab: 'new' | 'join' = 'new') => {
    setAddBabyTab(tab);
    setBabyError(null);
    setJoinError(null);
    setJoinCode('');
    setAddBabyOpen(true);
  };

  const openEditBaby = () => {
    if (!selectedBaby) return;
    setEditName(selectedBaby.name);
    setEditDob(selectedBaby.dateOfBirth);
    setEditGender(selectedBaby.gender || '');
    setEditDiagnosis(selectedBaby.diagnosis || '');
    setEditNhsNumber(selectedBaby.nhsNumber || '');
    setEditError(null);
    setEditBabyOpen(true);
  };

  const handleEditBaby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editDob) { setEditError('Name and date of birth are required.'); return; }
    if (!selectedBaby) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await updateBaby(selectedBaby.$id, {
        name: editName.trim(),
        dateOfBirth: editDob,
        gender: (editGender as 'male' | 'female' | 'other') || null,
        diagnosis: editDiagnosis.trim() || null,
        nhsNumber: editNhsNumber.replace(/\s/g, '').slice(0, 10) || null,
      });
      setEditBabyOpen(false);
    } catch {
      setEditError('Failed to update baby profile. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddBaby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName || !babyDob) { setBabyError('Please enter baby name and date of birth.'); return; }
    setBabyLoading(true);
    setBabyError(null);
    try {
      await addBaby({
        name: babyName,
        dateOfBirth: babyDob,
        userId: user?.$id || '',
        gender: (babyGender as 'male' | 'female' | 'other') || undefined,
        diagnosis: babyDiagnosis || undefined,
        nhsNumber: babyNhsNumber.replace(/\s/g, '').slice(0, 10) || undefined,
      });
      setAddBabyOpen(false);
      setBabyName('');
    } catch {
      setBabyError('Failed to save baby profile. Please try again.');
    } finally {
      setBabyLoading(false);
    }
  };

  const handleJoinWithCode = async () => {
    if (joinCode.trim().length < 6) { setJoinError('Please enter the full 6-character code.'); return; }
    setJoinLoading(true);
    setJoinError(null);
    try {
      await joinWithCode(joinCode);
      setAddBabyOpen(false);
      setJoinCode('');
    } catch (err: any) {
      if (err.message === 'INVALID_CODE') setJoinError("Code not found. Double-check and try again.");
      else if (err.message === 'OWN_BABY') setJoinError("That's your own baby — no need to join!");
      else if (err.message === 'ALREADY_JOINED') setJoinError("You're already linked to this baby.");
      else setJoinError('Something went wrong. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!selectedBaby) return;
    setShareLoading(true);
    try {
      await generateShareCode(selectedBaby.$id);
    } catch {
      // silent fail — user can retry
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!selectedBaby?.shareCode) return;
    try {
      await navigator.clipboard.writeText(selectedBaby.shareCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // clipboard may be unavailable (old browser)
    }
  };

  const handleDeleteBaby = async () => {
    if (!selectedBaby) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await removeBaby(selectedBaby.$id);
      setDeleteConfirmOpen(false);
      setEditBabyOpen(false);
    } catch {
      setDeleteError('Failed to delete profile. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Monthly milestone celebration — show once per calendar day
  const DISMISS_KEY = `milestone_dismissed_${new Date().toISOString().slice(0, 10)}`;
  const monthMilestone = selectedBaby ? isMonthBirthday(selectedBaby.dateOfBirth) : null;
  const [celebrationDismissed, setCelebrationDismissed] = React.useState(
    () => !!localStorage.getItem(DISMISS_KEY)
  );
  const showCelebration = !!monthMilestone && !celebrationDismissed;
  const dismissCelebration = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setCelebrationDismissed(true);
  };

  const showNoBabyState = babies.length === 0 && !addBabyOpen;

  const todayFeeds = feeds.filter((e) => isToday(e.datetime));
  const todayNappies = nappies.filter((e) => isToday(e.datetime));
  const todayMeds = medications.filter((e) => isToday(e.datetime));
  const todayMl = todayFeeds.reduce((sum, e) => sum + e.amountMl, 0);
  const lastNappy = nappies[0];
  const now = new Date();
  const nextAppt = appointments
    .filter((e) => new Date(e.datetime) >= now)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0];

  const recentActivity = [
    ...feeds.slice(0, 3).map((e) => ({
      id: e.$id, type: 'feed' as const, datetime: e.datetime,
      text: `Feed: ${e.amountMl} ml`, icon: <Droplets size={14} />, colour: 'mint' as const,
    })),
    ...nappies.slice(0, 3).map((e) => ({
      id: e.$id, type: 'nappy' as const, datetime: e.datetime,
      text: `Nappy: ${e.kind}`, icon: <Baby size={14} />, colour: 'sky' as const,
    })),
    ...symptoms.slice(0, 2).map((e) => ({
      id: e.$id, type: 'symptom' as const, datetime: e.datetime,
      text: `Symptoms: ${e.skinColour} skin`, icon: <Activity size={14} />,
      colour: e.skinColour === 'blue' ? 'red' as const : 'purple' as const,
    })),
  ]
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const isOwner = selectedBaby?.userId === user?.$id;

  if (!babyContextLoading && babies.length === 0 && !localStorage.getItem('mylestone_onboarded')) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <AppShell>
      <div className="relative bg-gradient-to-br from-[#3ECFBF] via-brand-mint to-[#1E9E92] px-5 pt-6 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-8 right-16 w-16 h-16 rounded-full bg-white/5" />
          <div className="absolute -bottom-2 -left-4 w-24 h-24 rounded-full bg-white/5" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="w-full h-6 fill-gray-50 dark:fill-gray-900">
            <path d="M0,24 C100,0 300,0 400,24 L400,24 L0,24 Z" />
          </svg>
        </div>
        <div className="flex items-center justify-between mb-4 relative">
          <div>
            <p className="text-white font-extrabold text-lg font-heading tracking-tight leading-none">Mylestone</p>
            <p className="text-white/60 text-[11px] font-medium mt-0.5">Every milestone, beautifully tracked</p>
          </div>
          <span className="text-2xl">✨</span>
        </div>
        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-white/80 text-sm font-medium">{greeting},</p>
            <h1 className="text-white text-2xl font-extrabold mt-0.5 font-heading">
              {user?.name?.split(' ')[0] || 'Parent'} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="p-2 rounded-xl bg-white/20 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              onClick={() => navigate('/profile')}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/20 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Profile & settings"
            >
              <UserCircle size={20} />
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-white/20 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Log out"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
        {selectedBaby && (
          <motion.div
            className="mt-4 bg-white/20 rounded-2xl px-4 py-3 flex items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <Heart size={20} className="text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold">{selectedBaby.name}</p>
              <p className="text-white/80 text-xs">
                {babyAge(selectedBaby.dateOfBirth)}{selectedBaby.diagnosis ? ` · ${selectedBaby.diagnosis}` : ''}
              </p>
              {selectedBaby.nhsNumber && (
                <button
                  onClick={handleCopyNhs}
                  className="flex items-center gap-1.5 mt-1 text-white/70 hover:text-white transition-colors"
                >
                  <span className="text-[11px] font-mono tracking-wide">
                    NHS {selectedBaby.nhsNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                  </span>
                  {nhsCopied
                    ? <Check size={11} className="text-white" />
                    : <Copy size={11} />}
                </button>
              )}
            </div>
            {babies.length > 1 && (
              <motion.button
                onClick={() => setSwitcherOpen(true)}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-white/20 text-white flex-shrink-0 flex items-center gap-1"
                aria-label="Switch baby profile"
              >
                <ChevronDown size={14} />
              </motion.button>
            )}
            {isOwner && (
              <motion.button
                onClick={() => { setCodeCopied(false); setShareBabyOpen(true); }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-white/20 text-white flex-shrink-0"
                aria-label="Share baby"
              >
                <Share2 size={14} />
              </motion.button>
            )}
            {isOwner && (
              <motion.button
                onClick={openEditBaby}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-white/20 text-white flex-shrink-0"
                aria-label="Edit baby profile"
              >
                <Pencil size={14} />
              </motion.button>
            )}
          </motion.div>
        )}
      </div>


      <motion.div
        className="p-5 -mt-2 flex flex-col gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {showNoBabyState && (
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center"
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.6 }}
            >
              👶
            </motion.div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Add your baby's profile</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Set up your baby's profile to start tracking feeds, nappies, medications, and more.
            </p>
            <div className="flex flex-col gap-2 items-center">
              <Button onClick={() => openAddBaby('new')} size="md">Add baby profile</Button>
              <button
                onClick={() => openAddBaby('join')}
                className="text-sm text-brand-mint font-semibold hover:underline py-1"
              >
                Join with a code instead
              </button>
            </div>
          </motion.div>
        )}

        {selectedBaby && (
          <>
            <motion.div variants={itemVariants}>
              <NameMeaningCard name={selectedBaby.name} />
            </motion.div>

            {activeStay && (
              <motion.div variants={itemVariants}>
                <Link to="/hospital">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl px-4 py-3 border-2 border-blue-200 dark:border-blue-700"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                      <Stethoscope size={18} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                        <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Hospital Mode Active</p>
                      </div>
                      <p className="text-xs text-blue-500 dark:text-blue-400 truncate">{activeStay.hospital}</p>
                    </div>
                    <ChevronRight size={16} className="text-blue-400 flex-shrink-0" />
                  </motion.div>
                </Link>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <TrendInsightsCard
                babyId={selectedBaby.$id}
                babyName={selectedBaby.name}
                feeds={feeds}
                nappies={nappies}
                symptoms={symptoms}
                medications={medications}
                sleep={sleep}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Droplets size={18} />}
                label="Feeds today"
                value={todayFeeds.length}
                trend={todayFeeds.length > 0 ? `${todayFeeds.reduce((s, e) => s + e.amountMl, 0)} ml total` : undefined}
                colour="mint"
              />
              <StatCard
                icon={<Baby size={18} />}
                label="Nappies today"
                value={todayNappies.length}
                trend={lastNappy ? `Last: ${formatTime(lastNappy.datetime)}` : undefined}
                colour="sky"
              />
              <StatCard
                icon={<Calendar size={18} />}
                label="Next appointment"
                value={nextAppt ? nextAppt.hospitalName : 'None'}
                trend={nextAppt ? formatDateTime(nextAppt.datetime) : undefined}
                colour="purple"
              />
              <StatCard
                icon={<Pill size={18} />}
                label="Meds today"
                value={todayMeds.length}
                trend={todayMeds.length > 0 ? `Last: ${formatTime(todayMeds[0].datetime)}` : undefined}
                colour="orange"
              />
            </motion.div>

            {(todayFeeds.length > 0 || todayNappies.length > 0 || todayMeds.length > 0) && (
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Today at a glance</p>
                <div className="flex items-center justify-around">
                  {[
                    { emoji: '🍼', count: todayFeeds.length, label: 'feeds', sub: todayMl > 0 ? `${todayMl} ml` : null, color: 'text-teal-500' },
                    { emoji: '🚼', count: todayNappies.length, label: 'nappies', sub: null, color: 'text-sky-500' },
                    { emoji: '💊', count: todayMeds.length, label: 'meds', sub: null, color: 'text-violet-500' },
                  ].map((item, i) => (
                    <React.Fragment key={item.label}>
                      {i > 0 && <div className="w-px h-12 bg-gray-100 dark:bg-gray-700" />}
                      <div className="flex flex-col items-center gap-0.5">
                        <motion.span
                          className="text-2xl"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4, ease: 'easeInOut' }}
                        >
                          {item.emoji}
                        </motion.span>
                        <p className={`text-xl font-extrabold ${item.color}`}>{item.count}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{item.label}</p>
                        {item.sub && <p className="text-[11px] font-bold text-teal-500">{item.sub}</p>}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Quick actions</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Log feed', to: '/feeds', icon: Droplets, gradient: 'from-teal-400 to-emerald-500', shadow: 'shadow-teal-100 dark:shadow-teal-900/30' },
                  { label: 'Log nappy', to: '/nappies', icon: Baby, gradient: 'from-sky-400 to-blue-500', shadow: 'shadow-sky-100 dark:shadow-sky-900/30' },
                  { label: 'Log meds', to: '/medications', icon: Pill, gradient: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-100 dark:shadow-violet-900/30' },
                ].map((action) => (
                  <Link key={action.to} to={action.to}>
                    <motion.div
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className={`flex flex-col items-center gap-2.5 bg-gradient-to-br ${action.gradient} rounded-2xl p-4 shadow-lg ${action.shadow} min-h-[84px] justify-center`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                        <action.icon size={20} />
                      </div>
                      <p className="text-xs font-semibold text-white text-center">{action.label}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                onClick={() => setExportOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center">
                    <FileDown size={17} className="text-brand-dark" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Export health report</p>
                    <p className="text-xs text-gray-400">PDF for your care team</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </motion.div>

            {recentActivity.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent activity</h2>
                  <Link to="/feeds" className="text-sm text-brand-mint font-semibold flex items-center gap-1">
                    View all <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700">
                  {recentActivity.map((item, i) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.06 }}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.colour === 'mint' ? 'bg-brand-light text-brand-dark' :
                        item.colour === 'sky' ? 'bg-blue-50 text-blue-600' :
                        item.colour === 'red' ? 'bg-red-50 text-red-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.text}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{formatDateTime(item.datetime)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
        <motion.div variants={itemVariants}>
          <Link to="/feedback">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                <MessageSquarePlus size={20} className="text-brand-mint" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Share your feedback</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Feature requests, bugs, or just say hello</p>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Share baby modal */}
      <Modal open={shareBabyOpen} onClose={() => setShareBabyOpen(false)} title="Share Baby's Data">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Give the other parent a code so they can see and track {selectedBaby?.name}'s data from their own account.
          </p>
          {selectedBaby?.shareCode ? (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-brand-light dark:bg-brand-dark/30 rounded-2xl px-8 py-5 text-center w-full">
                <p className="text-3xl font-mono font-bold text-brand-dark dark:text-brand-mint tracking-[0.25em]">
                  {selectedBaby.shareCode}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 text-sm text-brand-mint font-semibold hover:underline"
              >
                {codeCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy code</>}
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                The other parent enters this code under "Join with a code" in the app.
              </p>
              <button
                onClick={handleGenerateCode}
                disabled={shareLoading}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              >
                {shareLoading ? 'Generating…' : 'Generate a new code'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center">
              <div className="text-4xl">🔗</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                No code yet. Generate one to share with the other parent.
              </p>
              <Button onClick={handleGenerateCode} loading={shareLoading}>Generate Code</Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit baby modal */}
      <Modal open={editBabyOpen} onClose={() => setEditBabyOpen(false)} title="Edit Baby Profile">
        <form onSubmit={handleEditBaby} className="flex flex-col gap-4">
          <Input
            label="Baby's name"
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="e.g. Oliver"
            required
          />
          <Input
            label="Date of birth"
            type="date"
            value={editDob}
            onChange={(e) => setEditDob(e.target.value)}
            required
          />
          <Select
            label="Gender (optional)"
            value={editGender}
            onChange={(e) => setEditGender(e.target.value)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            placeholder="Select gender"
          />
          <Input
            label="Medical notes / diagnosis (optional)"
            type="text"
            value={editDiagnosis}
            onChange={(e) => setEditDiagnosis(e.target.value)}
            placeholder="e.g. premature, healthy, or any notes"
          />
          <Input
            label="NHS number (optional)"
            type="text"
            value={editNhsNumber}
            onChange={(e) => setEditNhsNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="e.g. 9434765919"
            maxLength={10}
          />
          {editError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">{editError}</p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditBabyOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={editLoading} className="flex-1">Save Changes</Button>
          </div>
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-red-500 hover:text-red-600 font-medium mt-1"
          >
            <Trash2 size={14} />
            Delete this profile
          </button>
        </form>
      </Modal>

      {/* Add baby / join with code modal */}
      <Modal open={addBabyOpen} onClose={() => setAddBabyOpen(false)} title="Add Baby">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAddBabyTab('new')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                addBabyTab === 'new'
                  ? 'bg-brand-mint text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              New baby
            </button>
            <button
              type="button"
              onClick={() => setAddBabyTab('join')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                addBabyTab === 'join'
                  ? 'bg-brand-mint text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Join with code
            </button>
          </div>

          {addBabyTab === 'new' ? (
            <form onSubmit={handleAddBaby} className="flex flex-col gap-4">
              <Input
                label="Baby's name"
                type="text"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                placeholder="e.g. Oliver"
                required
              />
              <Input
                label="Date of birth"
                type="date"
                value={babyDob}
                onChange={(e) => setBabyDob(e.target.value)}
                required
              />
              <Select
                label="Gender (optional)"
                value={babyGender}
                onChange={(e) => setBabyGender(e.target.value)}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                placeholder="Select gender"
              />
              <Input
                label="Medical notes / diagnosis (optional)"
                type="text"
                value={babyDiagnosis}
                onChange={(e) => setBabyDiagnosis(e.target.value)}
                placeholder="e.g. premature, healthy, or any notes"
              />
              <Input
                label="NHS number (optional)"
                type="text"
                value={babyNhsNumber}
                onChange={(e) => setBabyNhsNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="e.g. 9434765919"
                maxLength={10}
              />
              {babyError && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">{babyError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={() => setAddBabyOpen(false)} className="flex-1">Cancel</Button>
                <Button type="submit" loading={babyLoading} className="flex-1">Save Profile</Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the 6-character code shared with you to link your account to the baby's data.
              </p>
              <Input
                label="6-character code"
                type="text"
                value={joinCode}
                onChange={(e) => { setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setJoinError(null); }}
                placeholder="ABC123"
                maxLength={6}
              />
              {joinError && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">{joinError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={() => setAddBabyOpen(false)} className="flex-1">Cancel</Button>
                <Button type="button" loading={joinLoading} onClick={handleJoinWithCode} className="flex-1">Join</Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {selectedBaby && (
        <motion.button
          onClick={() => openAddBaby('new')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="fixed z-40 w-14 h-14 rounded-full bg-brand-mint text-white shadow-lg hover:bg-brand-dark transition-colors flex items-center justify-center"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)', right: '20px' }}
          aria-label="Add baby profile"
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      )}

      {showCelebration && selectedBaby && monthMilestone && (
        <MilestoneCelebration
          babyName={selectedBaby.name}
          months={monthMilestone}
          onDismiss={dismissCelebration}
        />
      )}

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />

      {/* Baby profile switcher */}
      <Modal open={switcherOpen} onClose={() => setSwitcherOpen(false)} title="Switch Profile">
        <div className="flex flex-col gap-2">
          {babies.map((baby) => (
            <button
              key={baby.$id}
              onClick={() => { setSelectedBaby(baby); setSwitcherOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors text-left ${
                baby.$id === selectedBaby?.$id
                  ? 'bg-brand-light border-brand-mint'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-brand-mint'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                <Heart size={16} className="text-brand-mint" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{baby.name}</p>
                <p className="text-xs text-gray-400">{babyAge(baby.dateOfBirth)}{baby.diagnosis ? ` · ${baby.diagnosis}` : ''}</p>
              </div>
              {baby.$id === selectedBaby?.$id && <Check size={16} className="text-brand-mint flex-shrink-0" />}
            </button>
          ))}
        </div>
      </Modal>

      {/* Delete baby confirmation */}
      <Modal open={deleteConfirmOpen} onClose={() => { setDeleteConfirmOpen(false); setDeleteError(null); }} title="Delete Profile">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{selectedBaby?.name}</span>'s profile? This cannot be undone.
          </p>
          {deleteError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">{deleteError}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" type="button" onClick={() => { setDeleteConfirmOpen(false); setDeleteError(null); }} className="flex-1">Cancel</Button>
            <Button type="button" loading={deleteLoading} onClick={handleDeleteBaby} className="flex-1 !bg-red-500 hover:!bg-red-600">Delete</Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

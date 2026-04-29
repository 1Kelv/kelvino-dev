import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Droplets, Baby, Pill, Calendar, Plus, LogOut, ChevronRight, Activity, Sun, Moon } from 'lucide-react';
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
import { babyAge, isToday, formatDateTime, formatTime } from '../lib/utils';
import { localDateNow } from '../lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function HomePage() {
  const { selectedBaby, babies, addBaby } = useBabyContext();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const { entries: feeds } = useFeeds(selectedBaby?.$id);
  const { entries: nappies } = useNappies(selectedBaby?.$id);
  const { entries: appointments } = useAppointments(selectedBaby?.$id);
  const { entries: symptoms } = useSymptoms(selectedBaby?.$id);

  const [addBabyOpen, setAddBabyOpen] = useState(false);
  const [babyName, setBabyName] = useState('');
  const [babyDob, setBabyDob] = useState(localDateNow());
  const [babyGender, setBabyGender] = useState('');
  const [babyDiagnosis, setBabyDiagnosis] = useState('');
  const [babyLoading, setBabyLoading] = useState(false);
  const [babyError, setBabyError] = useState<string | null>(null);

  const showNoBabyState = babies.length === 0 && !addBabyOpen;

  const todayFeeds = feeds.filter((e) => isToday(e.datetime));
  const todayNappies = nappies.filter((e) => isToday(e.datetime));
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
      });
      setAddBabyOpen(false);
      setBabyName('');
    } catch {
      setBabyError('Failed to save baby profile. Please try again.');
    } finally {
      setBabyLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <AppShell>
      <div className="bg-gradient-to-br from-brand-mint to-brand-dark px-5 pt-6 pb-8">
        <div className="flex items-start justify-between">
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
              className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <Heart size={20} className="text-white" />
            </motion.div>
            <div>
              <p className="text-white font-bold">{selectedBaby.name}</p>
              <p className="text-white/80 text-xs">
                {babyAge(selectedBaby.dateOfBirth)}{selectedBaby.diagnosis ? ` · ${selectedBaby.diagnosis}` : ''}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        className="p-5 -mt-4 flex flex-col gap-5"
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Set up your baby's profile to start tracking feeds, nappies, medications, and more.
            </p>
            <Button onClick={() => setAddBabyOpen(true)} size="md">Add baby profile</Button>
          </motion.div>
        )}

        {selectedBaby && (
          <>
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
                label="Medications"
                value={feeds.filter((e) => isToday(e.datetime)).length > 0 ? 'On track' : 'Check doses'}
                colour="orange"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Quick actions</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Log feed', to: '/feeds', icon: Droplets, colour: 'bg-brand-light text-brand-dark' },
                  { label: 'Log nappy', to: '/nappies', icon: Baby, colour: 'bg-blue-50 text-blue-700' },
                  { label: 'Log meds', to: '/medications', icon: Pill, colour: 'bg-purple-50 text-purple-700' },
                ].map((action) => (
                  <Link key={action.to} to={action.to}>
                    <motion.div
                      whileHover={{ scale: 1.06, y: -3 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 min-h-[80px] justify-center"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.colour}`}>
                        <action.icon size={20} />
                      </div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{action.label}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
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
      </motion.div>

      <Modal open={addBabyOpen} onClose={() => setAddBabyOpen(false)} title="Add Baby Profile">
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
          {babyError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">{babyError}</p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setAddBabyOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={babyLoading} className="flex-1">Save Profile</Button>
          </div>
        </form>
      </Modal>

      {selectedBaby && (
        <motion.button
          onClick={() => setAddBabyOpen(true)}
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
    </AppShell>
  );
}

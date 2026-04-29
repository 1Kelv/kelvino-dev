// I render the home dashboard with summary cards and quick actions
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Droplets,
  Baby,
  Pill,
  Calendar,
  Plus,
  LogOut,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { useFeeds } from '../hooks/useFeeds';
import { useNappies } from '../hooks/useNappies';
import { useAppointments } from '../hooks/useAppointments';
import { useSymptoms } from '../hooks/useSymptoms';
import { babyAge, isToday, formatDateTime, formatTime } from '../lib/utils';
import { localDateNow } from '../lib/utils';

export function HomePage() {
  const { selectedBaby, babies, addBaby } = useBabyContext();
  const { user, logout } = useAuth();
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

  // I auto-open the add baby modal if no baby exists
  const showNoBabyState = babies.length === 0 && !addBabyOpen;

  const todayFeeds = feeds.filter((e) => isToday(e.datetime));
  const todayNappies = nappies.filter((e) => isToday(e.datetime));
  const lastNappy = nappies[0];
  const now = new Date();
  const nextAppt = appointments
    .filter((e) => new Date(e.datetime) >= now)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0];

  // I build recent activity from last 5 events across all tracked categories
  const recentActivity = [
    ...feeds.slice(0, 3).map((e) => ({
      id: e.$id,
      type: 'feed' as const,
      datetime: e.datetime,
      text: `Feed: ${e.amountMl} ml`,
      icon: <Droplets size={14} />,
      colour: 'mint' as const,
    })),
    ...nappies.slice(0, 3).map((e) => ({
      id: e.$id,
      type: 'nappy' as const,
      datetime: e.datetime,
      text: `Nappy: ${e.kind}`,
      icon: <Baby size={14} />,
      colour: 'sky' as const,
    })),
    ...symptoms.slice(0, 2).map((e) => ({
      id: e.$id,
      type: 'symptom' as const,
      datetime: e.datetime,
      text: `Symptoms: ${e.skinColour} skin`,
      icon: <Activity size={14} />,
      colour: e.skinColour === 'blue' ? 'red' as const : 'purple' as const,
    })),
  ]
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
    .slice(0, 5);

  const handleAddBaby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName || !babyDob) {
      setBabyError('Please enter baby name and date of birth.');
      return;
    }
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

  return (
    <AppShell>
      <div className="bg-gradient-to-br from-brand-mint to-brand-dark px-5 pt-6 pb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},</p>
            <h1 className="text-white text-2xl font-extrabold mt-0.5">{user?.name?.split(' ')[0] || 'Parent'}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/20 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Log out"
          >
            <LogOut size={20} />
          </button>
        </div>
        {selectedBaby && (
          <div className="mt-4 bg-white/20 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold">{selectedBaby.name}</p>
              <p className="text-white/80 text-xs">{babyAge(selectedBaby.dateOfBirth)}{selectedBaby.diagnosis ? ` · ${selectedBaby.diagnosis}` : ''}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 -mt-4 flex flex-col gap-5">
        {/* No baby prompt */}
        {showNoBabyState && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-3">👶</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Add your baby's profile</h2>
            <p className="text-sm text-gray-500 mb-4">
              Set up your baby's profile to start tracking feeds, nappies, medications, and more.
            </p>
            <Button onClick={() => setAddBabyOpen(true)} size="md">
              Add baby profile
            </Button>
          </div>
        )}

        {/* Today's summary */}
        {selectedBaby && (
          <>
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-3">Quick actions</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Log feed', to: '/feeds', icon: Droplets, colour: 'bg-brand-light text-brand-dark' },
                  { label: 'Log nappy', to: '/nappies', icon: Baby, colour: 'bg-blue-50 text-blue-700' },
                  { label: 'Log meds', to: '/medications', icon: Pill, colour: 'bg-purple-50 text-purple-700' },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-brand-mint transition-colors min-h-[80px] justify-center"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.colour}`}>
                      <action.icon size={20} />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 text-center">{action.label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            {recentActivity.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-gray-900">Recent activity</h2>
                  <Link to="/feeds" className="text-sm text-brand-mint font-semibold flex items-center gap-1">
                    View all <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.colour === 'mint' ? 'bg-brand-light text-brand-dark' :
                        item.colour === 'sky' ? 'bg-blue-50 text-blue-600' :
                        item.colour === 'red' ? 'bg-red-50 text-red-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.text}</p>
                        <p className="text-xs text-gray-400">{formatDateTime(item.datetime)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add baby modal */}
      <Modal
        open={addBabyOpen}
        onClose={() => setAddBabyOpen(false)}
        title="Add Baby Profile"
      >
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
            placeholder="e.g. Tetralogy of Fallot, premature, healthy"
          />
          {babyError && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{babyError}</p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setAddBabyOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={babyLoading} className="flex-1">
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* FAB to add baby if none */}
      {selectedBaby && (
        <button
          onClick={() => setAddBabyOpen(true)}
          className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-brand-mint text-white shadow-lg hover:bg-brand-dark transition-colors flex items-center justify-center"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
          aria-label="Add baby profile"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      )}
    </AppShell>
  );
}

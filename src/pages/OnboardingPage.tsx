import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, Baby, Check } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useBabyContext } from '../lib/BabyContext';
import { useAuth } from '../lib/AuthContext';
import { localDateNow } from '../lib/utils';

type Step = 1 | 2 | 3;

export function OnboardingPage() {
  const { addBaby } = useBabyContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [babyName, setBabyName] = useState('');
  const [babyDob, setBabyDob] = useState(localDateNow());
  const [babyGender, setBabyGender] = useState('');
  const [babyDiagnosis, setBabyDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBaby = async () => {
    if (!babyName.trim() || !babyDob) {
      setError("Please enter your baby's name and date of birth.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addBaby({
        name: babyName.trim(),
        dateOfBirth: babyDob,
        userId: user?.$id || '',
        gender: (babyGender as 'male' | 'female' | 'other') || undefined,
        diagnosis: babyDiagnosis.trim() || undefined,
      });
      setStep(3);
    } catch {
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('mylestone_onboarded', '1');
    navigate('/app', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-mint to-brand-dark flex flex-col items-center justify-center px-5 py-10">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="w-full max-w-sm flex flex-col items-center text-center gap-6"
          >
            <motion.div
              className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <Heart size={42} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-extrabold text-white font-heading tracking-tight">Mylestone</h1>
              <p className="text-white/80 text-lg mt-2">Every milestone, remembered.</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Track feeds, sleep, growth, medications, and every precious moment — all in one place.
            </p>
            <motion.button
              onClick={() => setStep(2)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="w-full py-4 rounded-2xl bg-white text-brand-dark font-bold text-base flex items-center justify-center gap-2 shadow-lg"
            >
              Get started <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="w-full max-w-sm"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-brand-light flex items-center justify-center">
                  <Baby size={20} className="text-brand-dark" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your little one</h2>
                  <p className="text-xs text-gray-400">Tell us about your baby</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Input
                  label="Baby's name"
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder="e.g. Oliver, Amelia..."
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
                    { value: 'male', label: 'Boy' },
                    { value: 'female', label: 'Girl' },
                    { value: 'other', label: 'Other / prefer not to say' },
                  ]}
                  placeholder="Select (optional)"
                />
                <Input
                  label="Any medical notes? (optional)"
                  type="text"
                  value={babyDiagnosis}
                  onChange={(e) => setBabyDiagnosis(e.target.value)}
                  placeholder="e.g. premature, CHD, healthy..."
                />
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
                )}
                <Button onClick={handleCreateBaby} loading={loading} className="mt-2">
                  Continue
                </Button>
              </div>
            </div>
            <div className="flex justify-center mt-5 gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-6 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="w-full max-w-sm flex flex-col items-center text-center gap-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg"
            >
              <Check size={42} className="text-brand-mint" strokeWidth={3} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-extrabold text-white font-heading">
                All set!
              </h1>
              <p className="text-white/90 text-lg font-semibold mt-1">{babyName} has joined Mylestone</p>
              <p className="text-white/70 text-sm mt-2">
                Ready to track every feed, nappy, and precious moment.
              </p>
            </div>
            <motion.button
              onClick={handleFinish}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="w-full py-4 rounded-2xl bg-white text-brand-dark font-bold text-base shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Go to dashboard
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

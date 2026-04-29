import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/AuthContext';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const userId = params.get('userId') || '';
  const secret = params.get('secret') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError(null);
    try {
      await resetPassword(userId, secret, password);
      navigate('/login');
    } catch {
      setError('Reset link is invalid or expired. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const eyeButton = (
    <button
      type="button"
      onClick={() => setShowPassword(s => !s)}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col justify-center px-6 py-12">
      <motion.div
        className="w-full max-w-sm mx-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-brand-mint flex items-center justify-center mb-4 shadow-lg"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Heart size={32} className="text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading">Mylestone</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Set new password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Choose a strong password for your account.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="New password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
              rightElement={eyeButton}
            />
            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
              rightElement={eyeButton}
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">{error}</p>
            )}
            <Button type="submit" size="lg" loading={loading}>Reset password</Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <Link to="/login" className="text-brand-mint font-semibold hover:underline">Back to sign in</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

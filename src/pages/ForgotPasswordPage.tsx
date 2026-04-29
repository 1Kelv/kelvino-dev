import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/AuthContext';

export function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError('Could not send reset email. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Every milestone, remembered.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center py-4"
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                📬
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your inbox!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                We sent a reset link to <strong>{email}</strong>.
              </p>
              <Link to="/login" className="text-brand-mint font-semibold text-sm hover:underline">
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Forgot password?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Enter your email and we'll send a reset link.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3">{error}</p>
                )}
                <Button type="submit" size="lg" loading={loading}>Send reset link</Button>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Remember it?{' '}
                  <Link to="/login" className="text-brand-mint font-semibold hover:underline">Sign in</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

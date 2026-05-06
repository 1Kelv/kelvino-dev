import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MailCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth, EMAIL_NOT_VERIFIED } from '../../lib/AuthContext';

const formVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function LoginForm() {
  const { login, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError(null);
    setEmailNotVerified(false);
    setResendSent(false);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      if (err?.message === EMAIL_NOT_VERIFIED) {
        setEmailNotVerified(true);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { setError('Enter your email address above first.'); return; }
    setResendLoading(true);
    try {
      await resendVerificationEmail(email);
      setResendSent(true);
    } catch (err: any) {
      if (err?.message === 'NO_STORED_USER') {
        setResendSent(true); // Show as "sent" to avoid confusion; guide via forgot password below
      } else {
        setError('Could not resend the verification email. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      variants={formVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </motion.div>
      <motion.div variants={itemVariants} className="flex justify-end -mt-2">
        <Link to="/forgot-password" className="text-sm text-brand-mint font-semibold hover:underline">
          Forgot password?
        </Link>
      </motion.div>
      {emailNotVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3"
        >
          <div className="flex items-start gap-2">
            <MailCheck size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Your email hasn't been verified yet. Check your inbox for the verification link we sent when you signed up, or request a new one below.
            </p>
          </div>
          {resendSent ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-brand-mint font-semibold">Verification email sent — check your inbox and click the link.</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">No email? Use <Link to="/forgot-password" className="underline font-semibold">Forgot password?</Link> to regain access instead.</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-sm text-brand-mint font-semibold hover:underline disabled:opacity-50 text-left"
            >
              {resendLoading ? 'Sending…' : 'Resend verification email'}
            </button>
          )}
        </motion.div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-3"
        >
          {error}
        </motion.p>
      )}
      <motion.div variants={itemVariants}>
        <Button type="submit" size="lg" loading={loading}>Sign In</Button>
      </motion.div>
      <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-mint font-semibold hover:underline">Create one</Link>
      </motion.p>
    </motion.form>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/AuthContext';

const formVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate('/app');
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : '';
      const msg = raw.toLowerCase().includes('already exists')
        ? 'An account with this email already exists. Please sign in instead.'
        : raw || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
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
          label="Your name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          autoComplete="name"
          required
        />
      </motion.div>
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
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
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
        <Button type="submit" size="lg" loading={loading}>Create Account</Button>
      </motion.div>
      <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-mint font-semibold hover:underline">Sign in</Link>
      </motion.p>
    </motion.form>
  );
}

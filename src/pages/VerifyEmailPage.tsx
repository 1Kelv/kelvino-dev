import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MHeartIcon } from '../components/ui/MHeartIcon';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/AuthContext';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { createSessionFromToken } = useAuth();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = params.get('userId');
    const secret = params.get('secret');
    if (!userId || !secret) {
      setError('Invalid verification link.');
      setStatus('error');
      return;
    }
    createSessionFromToken(userId, secret)
      .then(() => navigate('/app', { replace: true }))
      .catch(() => {
        setError('This link has expired or already been used. Please sign in or request a new link.');
        setStatus('error');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col justify-center px-6 py-12">
      <motion.div
        className="w-full max-w-sm mx-auto text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-brand-mint flex items-center justify-center mx-auto mb-5 shadow-lg"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <MHeartIcon size={32} className="text-white" />
        </motion.div>

        {status === 'loading' ? (
          <>
            <div className="w-8 h-8 rounded-full border-2 border-brand-mint border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Verifying your account…</p>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
            <div className="text-3xl mb-3">😕</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Link not valid</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{error}</p>
            <a href="/login" className="text-brand-mint font-semibold text-sm hover:underline">
              Go to sign in
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}

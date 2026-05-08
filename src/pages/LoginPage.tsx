import React from 'react';
import { MHeartIcon } from '../components/ui/MHeartIcon';
import { motion } from 'framer-motion';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
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
            animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <MHeartIcon size={32} className="text-white" />
          </motion.div>
          <motion.h1
            className="text-3xl font-extrabold text-gray-900 dark:text-white font-heading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          >
            Mylestone
          </motion.h1>
          <motion.p
            className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Every milestone, remembered.
          </motion.p>
        </div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.15 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Welcome back 👋</h2>
          <LoginForm />
        </motion.div>
      </motion.div>
    </div>
  );
}

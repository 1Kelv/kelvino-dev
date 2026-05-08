import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Moon, TrendingUp, Pill, Calendar, Baby, Activity, FileText } from 'lucide-react';
import { MHeartIcon } from '../components/ui/MHeartIcon';
import { motion } from 'framer-motion';

const features = [
  { icon: Droplets, label: 'Feeds', desc: 'Log every feed with amount, type, and duration', colour: 'bg-brand-light text-brand-dark' },
  { icon: Baby, label: 'Nappies', desc: 'Track wet, dirty, and dry nappies throughout the day', colour: 'bg-blue-50 text-blue-600' },
  { icon: Pill, label: 'Medications', desc: 'Record doses, routes, and who administered each medication', colour: 'bg-purple-50 text-purple-600' },
  { icon: TrendingUp, label: 'Growth', desc: 'Plot weight and length over time with visual charts', colour: 'bg-green-50 text-green-600' },
  { icon: Activity, label: 'Symptoms', desc: 'Note how your baby is feeling day to day', colour: 'bg-red-50 text-red-600' },
  { icon: Moon, label: 'Sleep', desc: 'Track sleep sessions, wake counts, and patterns', colour: 'bg-indigo-50 text-indigo-600' },
  { icon: Calendar, label: 'Appointments', desc: 'Keep all hospital and clinic visits in one place', colour: 'bg-orange-50 text-orange-600' },
  { icon: FileText, label: 'Notes', desc: 'Save consultant summaries, discharge notes, and more', colour: 'bg-yellow-50 text-yellow-600' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 22, delay: i * 0.07 },
  }),
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-mint via-brand-sky to-brand-dark px-6 pt-16 pb-28 text-center relative overflow-hidden">
        {/* Floating bubbles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: 20 + i * 18,
              height: 20 + i * 18,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}

        <motion.div
          className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5 shadow-lg"
          animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <MHeartIcon size={36} className="text-white" />
        </motion.div>

        <motion.h1
          className="text-4xl font-extrabold text-white mb-3 font-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
        >
          Mylestone
        </motion.h1>
        <motion.p
          className="text-xl text-white/90 font-medium mb-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
        >
          Every milestone, remembered.
        </motion.p>
        <motion.p
          className="text-white/75 text-sm max-w-xs mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          The simple, beautiful way to track your baby's feeds, sleep, growth, and every precious moment.
        </motion.p>

        <motion.div
          className="flex flex-col gap-3 max-w-xs mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            <Link
              to="/register"
              className="block w-full bg-white text-brand-dark font-bold py-3.5 px-6 rounded-2xl text-base shadow-md hover:bg-brand-light transition-colors"
            >
              Get started free 🎉
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            <Link
              to="/login"
              className="block w-full bg-white/20 text-white font-semibold py-3.5 px-6 rounded-2xl text-base hover:bg-white/30 transition-colors"
            >
              Sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-5 py-12 max-w-lg mx-auto">
        <motion.h2
          className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-2 font-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          Everything in one place
        </motion.h2>
        <motion.p
          className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          8 tracking modules designed around your baby's daily routine.
        </motion.p>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm cursor-default"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${f.colour}`}>
                <f.icon size={18} />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{f.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Multi-baby callout */}
      <motion.div
        className="mx-5 mb-12 bg-brand-light dark:bg-brand-dark/20 rounded-3xl p-6 text-center max-w-lg lg:mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <motion.p
          className="text-3xl mb-3"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
        >
          👶
        </motion.p>
        <h3 className="font-extrabold text-brand-dark dark:text-brand-mint text-lg mb-2 font-heading">Multi-baby support</h3>
        <p className="text-sm text-brand-dark/80 dark:text-brand-mint/80">
          Add multiple baby profiles and switch between them instantly. Perfect for families with more than one little one.
        </p>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="px-5 pb-16 text-center max-w-xs mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
          <Link
            to="/register"
            className="block w-full bg-brand-mint text-white font-bold py-4 rounded-2xl text-base shadow-lg hover:bg-brand-dark transition-colors"
          >
            Start tracking today ✨
          </Link>
        </motion.div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Free to use. No credit card required.</p>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  colour?: 'mint' | 'sky' | 'purple' | 'orange' | 'green';
  index?: number;
}

const gradients: Record<string, string> = {
  mint:   'from-teal-400 to-emerald-500',
  sky:    'from-sky-400 to-blue-500',
  purple: 'from-violet-400 to-purple-500',
  orange: 'from-orange-400 to-pink-400',
  green:  'from-green-400 to-emerald-400',
};

const shadows: Record<string, string> = {
  mint:   'shadow-teal-200 dark:shadow-teal-900/40',
  sky:    'shadow-sky-200 dark:shadow-sky-900/40',
  purple: 'shadow-violet-200 dark:shadow-violet-900/40',
  orange: 'shadow-orange-200 dark:shadow-orange-900/40',
  green:  'shadow-green-200 dark:shadow-green-900/40',
};

export function StatCard({ icon, label, value, trend, className, colour = 'mint', index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26, delay: index * 0.07 }}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        `bg-gradient-to-br ${gradients[colour]} rounded-2xl p-4 shadow-lg ${shadows[colour]} flex flex-col gap-2`,
        className
      )}
    >
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
        {icon}
      </div>
      <p className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">{label}</p>
      <motion.p
        key={String(value)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="text-2xl font-extrabold text-white leading-none"
      >
        {value}
      </motion.p>
      {trend && (
        <p className="text-[11px] font-medium text-white/70 leading-tight">{trend}</p>
      )}
    </motion.div>
  );
}

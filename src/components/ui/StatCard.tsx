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
  colour?: 'mint' | 'sky' | 'purple' | 'orange';
}

export function StatCard({ icon, label, value, trend, trendUp, className, colour = 'mint' }: StatCardProps) {
  const iconBg = {
    mint: 'bg-brand-light text-brand-dark',
    sky: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600',
  }[colour];

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-2',
        className
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      {trend && (
        <p className={cn('text-xs font-medium', trendUp ? 'text-green-600' : 'text-gray-500 dark:text-gray-400')}>
          {trend}
        </p>
      )}
    </motion.div>
  );
}

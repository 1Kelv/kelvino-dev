import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FABProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function FAB({ onClick, label = 'Add entry', className }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'fixed z-40 w-14 h-14 rounded-full bg-brand-mint text-white shadow-lg hover:bg-brand-dark transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-mint focus:ring-offset-2',
        className
      )}
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)', right: '20px' }}
      aria-label={label}
    >
      <Plus size={28} strokeWidth={2.5} />
    </motion.button>
  );
}

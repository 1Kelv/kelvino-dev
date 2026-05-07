import React, { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LogItemProps {
  timestamp: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  extra?: React.ReactNode;
  onDelete: () => Promise<void>;
  onEdit?: () => void;
  className?: string;
}

export function LogItem({ timestamp, title, subtitle, badge, extra, onDelete, onEdit, className }: LogItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch {
      setError('Failed to delete.');
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-3',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{timestamp}</p>
          {badge}
        </div>
        <p className="font-semibold text-gray-900 dark:text-white mt-0.5 truncate">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{subtitle}</p>}
        {extra}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-mint transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Edit entry"
          >
            <Pencil size={16} />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-50"
          aria-label="Delete entry"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}

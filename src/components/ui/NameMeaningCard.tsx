import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNameInfo } from '../../data/nameData';

interface NameMeaningCardProps {
  name: string;
}

export function NameMeaningCard({ name }: NameMeaningCardProps) {
  const [open, setOpen] = useState(false);
  const info = getNameInfo(name);
  const displayName = name.trim();

  return (
    <div className="bg-brand-light dark:bg-gray-700/50 rounded-2xl px-4 py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <p className="text-sm font-semibold text-brand-dark dark:text-brand-mint truncate">
          ✨ About the name {displayName}
        </p>
        {open ? (
          <ChevronUp size={16} className="text-brand-dark dark:text-brand-mint flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-brand-dark dark:text-brand-mint flex-shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pt-3 flex flex-col gap-2">
              {info ? (
                <>
                  <span className="inline-block self-start text-xs font-semibold text-brand-dark dark:text-brand-mint bg-white/60 dark:bg-gray-600/60 rounded-full px-2.5 py-0.5">
                    {info.origin}
                  </span>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {info.meaning}
                  </p>
                  <p className="text-sm italic text-gray-500 dark:text-gray-400 flex gap-1.5">
                    <span className="not-italic flex-shrink-0">💡</span>
                    {info.funFact}
                  </p>
                </>
              ) : (
                <p className="text-sm italic text-gray-500 dark:text-gray-400">
                  Every name carries a story — {displayName}'s is yours to tell.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

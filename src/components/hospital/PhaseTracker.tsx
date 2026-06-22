import React from 'react';
import { motion } from 'framer-motion';
import { PHASES } from './hospitalExtras';

interface PhaseTrackerProps {
  currentPhase: string | null | undefined;
  onSelect: (phase: string) => void;
  disabled?: boolean;
}

export function PhaseTracker({ currentPhase, onSelect, disabled }: PhaseTrackerProps) {
  const activeIndex = PHASES.findIndex((p) => p.key === currentPhase);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Recovery Phase</p>
      <div className="flex items-center gap-0">
        {PHASES.map((phase, idx) => {
          const isActive = phase.key === currentPhase;
          const isPast = activeIndex !== -1 && idx < activeIndex;
          const isFuture = activeIndex === -1 || idx > activeIndex;

          return (
            <React.Fragment key={phase.key}>
              <button
                onClick={() => !disabled && onSelect(phase.key)}
                disabled={disabled}
                className={`flex flex-col items-center gap-1 flex-1 min-w-0 px-1 py-1.5 rounded-xl transition-all duration-200 ${
                  disabled ? 'cursor-default' : 'cursor-pointer active:scale-95'
                } ${isActive ? 'bg-gray-50 dark:bg-gray-700/60 ring-2 ring-offset-1 dark:ring-offset-gray-800 ' + phase.border : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm ${
                    isActive
                      ? phase.bg
                      : isPast
                      ? phase.bg + ' opacity-50'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  {isActive ? (
                    <span className="text-[10px]">{idx + 1}</span>
                  ) : isPast ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">{idx + 1}</span>
                  )}
                </motion.div>
                <span
                  className={`text-[9px] font-semibold leading-tight text-center truncate w-full ${
                    isActive
                      ? phase.text
                      : isPast
                      ? phase.mutedText + ' opacity-70'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {phase.label}
                </span>
              </button>
              {idx < PHASES.length - 1 && (
                <div
                  className={`h-0.5 flex-shrink-0 w-2 rounded-full ${
                    isPast || isActive ? 'bg-gray-300 dark:bg-gray-500' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

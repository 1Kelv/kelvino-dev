import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, subDays, addDays } from 'date-fns';

interface DateNavigatorProps {
  date: Date;
  onChange: (date: Date) => void;
}

export function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const onToday = isToday(date);
  const label = onToday ? 'Today' : format(date, 'EEE, d MMM');

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl px-4 py-2.5 border border-gray-100 dark:border-gray-700 shadow-sm">
      <button
        onClick={() => onChange(subDays(date, 1))}
        className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft size={18} className="text-gray-500 dark:text-gray-400" />
      </button>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
      <button
        onClick={() => onChange(addDays(date, 1))}
        disabled={onToday}
        className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next day"
      >
        <ChevronRight size={18} className="text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}

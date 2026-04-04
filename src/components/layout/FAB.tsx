// I render the floating action button above the bottom nav
import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FABProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function FAB({ onClick, label = 'Add entry', className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-brand-mint text-white shadow-lg hover:bg-brand-dark transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-mint focus:ring-offset-2',
        className
      )}
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
      aria-label={label}
    >
      <Plus size={28} strokeWidth={2.5} />
    </button>
  );
}

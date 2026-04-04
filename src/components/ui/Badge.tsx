// I render a small coloured pill badge
import React from 'react';
import { cn } from '../../lib/utils';

type BadgeColour = 'mint' | 'sky' | 'purple' | 'orange' | 'red' | 'gray' | 'yellow' | 'green';

interface BadgeProps {
  children: React.ReactNode;
  colour?: BadgeColour;
  className?: string;
}

const colourClasses: Record<BadgeColour, string> = {
  mint: 'bg-brand-light text-brand-dark',
  sky: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  orange: 'bg-orange-50 text-orange-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-gray-100 text-gray-600',
  yellow: 'bg-yellow-50 text-yellow-700',
  green: 'bg-green-50 text-green-700',
};

export function Badge({ children, colour = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
        colourClasses[colour],
        className
      )}
    >
      {children}
    </span>
  );
}

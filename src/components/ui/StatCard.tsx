// I render a stat card with icon, label, value, and optional trend
import React from 'react';
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

export function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  className,
  colour = 'mint',
}: StatCardProps) {
  const iconBg = {
    mint: 'bg-brand-light text-brand-dark',
    sky: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }[colour];

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2',
        className
      )}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p
          className={cn(
            'text-xs font-medium',
            trendUp ? 'text-green-600' : 'text-gray-500'
          )}
        >
          {trend}
        </p>
      )}
    </div>
  );
}

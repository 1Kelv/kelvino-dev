import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  babyName?: string;
  babyAge?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, babyName, babyAge, action }: PageHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pt-4 pb-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          {babyName && (
            <p className="text-sm text-brand-dark dark:text-brand-mint font-medium mt-1">
              {babyName}{babyAge ? ` · ${babyAge}` : ''}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

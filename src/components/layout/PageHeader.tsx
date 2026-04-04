// I render the page header with title, subtitle, and baby info
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
    <div className="bg-white border-b border-gray-100 px-5 pt-4 pb-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          {babyName && (
            <p className="text-sm text-brand-dark font-medium mt-1">
              {babyName}
              {babyAge ? ` · ${babyAge}` : ''}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

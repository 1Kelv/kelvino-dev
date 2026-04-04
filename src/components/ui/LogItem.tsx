// I render a log list item with timestamp, info, and delete button
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogItemProps {
  timestamp: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  onDelete: () => Promise<void>;
  className?: string;
}

export function LogItem({
  timestamp,
  title,
  subtitle,
  badge,
  onDelete,
  className,
}: LogItemProps) {
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
    <div
      className={cn(
        'bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs text-gray-400 font-medium">{timestamp}</p>
          {badge}
        </div>
        <p className="font-semibold text-gray-900 mt-0.5 truncate">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{subtitle}</p>}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-50 flex-shrink-0"
        aria-label="Delete entry"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

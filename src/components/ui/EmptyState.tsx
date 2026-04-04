// I render an empty state with emoji, heading, subtext, and optional CTA
import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  emoji?: string;
  heading: string;
  subtext: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ emoji = '📋', heading, subtext, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-5xl mb-4" role="img" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{heading}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">{subtext}</p>
      {ctaLabel && onCta && (
        <Button onClick={onCta} size="md">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

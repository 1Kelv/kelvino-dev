import React from 'react';
import type { Theme } from '../hooks/useTheme';

interface Props { theme: Theme; onToggle: () => void; }

export function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label="Toggle colour scheme">
      {theme === 'dark'
        ? <><span className="toggle-icon">☀</span> Light</>
        : <><span className="toggle-icon">◑</span> Dark</>}
    </button>
  );
}

// I wrap all protected pages with the bottom nav and layout structure
import React from 'react';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

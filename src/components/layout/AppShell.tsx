import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 240);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <main
        className="flex-1"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }}
      >
        {children}
      </main>
      <BottomNav />
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 z-40 w-10 h-10 rounded-full bg-brand-mint shadow-lg flex items-center justify-center text-white hover:bg-brand-dark active:scale-95 transition-all"
          aria-label="Back to top"
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}

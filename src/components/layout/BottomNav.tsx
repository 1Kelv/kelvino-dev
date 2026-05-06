import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, Droplets, Baby, Pill, TrendingUp, Moon, Calendar, FileText, Activity, Sparkles, MessageSquarePlus } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/app', icon: House, label: 'Home', exact: true },
  { to: '/feeds', icon: Droplets, label: 'Feeds' },
  { to: '/nappies', icon: Baby, label: 'Nappies' },
  { to: '/medications', icon: Pill, label: 'Meds' },
  { to: '/growth', icon: TrendingUp, label: 'Growth' },
  { to: '/symptoms', icon: Activity, label: 'Symptoms' },
  { to: '/sleep', icon: Moon, label: 'Sleep' },
  { to: '/appointments', icon: Calendar, label: 'Appts' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/ai', icon: Sparkles, label: 'AI' },
  { to: '/feedback', icon: MessageSquarePlus, label: 'Feedback' },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[64px] min-h-[56px] flex-shrink-0 transition-colors',
                isActive ? 'text-brand-mint' : 'text-gray-500 dark:text-gray-400 hover:text-brand-mint'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.75} className="flex-shrink-0" />
                <span className="text-[10px] font-semibold leading-none">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';
import { FeedbackForm } from '../components/feedback/FeedbackForm';
import { useAuth } from '../lib/AuthContext';

export function FeedbackPage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <PageHeader title="Feedback" />
      <div className="p-5 flex flex-col gap-5">
        <div className="flex items-start gap-3 bg-brand-light dark:bg-brand-dark/30 rounded-2xl px-4 py-4">
          <div className="w-10 h-10 rounded-xl bg-brand-mint/20 flex items-center justify-center flex-shrink-0">
            <MessageSquarePlus size={20} className="text-brand-mint" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-dark dark:text-white mb-0.5">Help shape Mylestone</p>
            <p className="text-xs text-brand-dark/70 dark:text-gray-300 leading-relaxed">
              Got a feature idea? Found a bug? Or just want to say hello?
              We read every submission — your input directly improves the app for families everywhere.
            </p>
          </div>
        </div>

        <FeedbackForm
          userId={user?.$id || ''}
          userEmail={(user as any)?.email || ''}
        />
      </div>
    </AppShell>
  );
}

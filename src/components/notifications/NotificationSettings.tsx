import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Check, Loader2 } from 'lucide-react';
import { isPushSupported, subscribeToPush, unsubscribeFromPush, getCurrentPushSubscription } from '../../lib/pushSubscription';
import { pushSubscriptionsDb } from '../../lib/db';

interface NotificationSettingsProps {
  userId: string;
  babyId: string;
}

type Status = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed';

export function NotificationSettings({ userId, babyId }: NotificationSettingsProps) {
  const [status, setStatus] = useState<Status>('loading');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) { setStatus('unsupported'); return; }
    if (Notification.permission === 'denied') { setStatus('denied'); return; }
    getCurrentPushSubscription().then((sub) => {
      setStatus(sub ? 'subscribed' : 'unsubscribed');
    });
  }, []);

  const handleEnable = async () => {
    setBusy(true);
    setError(null);
    try {
      const sub = await subscribeToPush();
      if (!sub) {
        setStatus(Notification.permission === 'denied' ? 'denied' : 'unsubscribed');
        return;
      }
      const keys = sub.toJSON().keys as { p256dh: string; auth: string };
      await pushSubscriptionsDb.upsert({
        userId,
        babyId,
        endpoint: sub.endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      });
      setStatus('subscribed');
    } catch {
      setError('Could not enable notifications. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    setError(null);
    try {
      await unsubscribeFromPush();
      await pushSubscriptionsDb.deleteByUserId(userId);
      setStatus('unsubscribed');
    } catch {
      setError('Could not disable notifications. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
        <Loader2 size={18} className="animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Checking notification status…</span>
      </div>
    );
  }

  if (status === 'unsupported') {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
        <BellOff size={18} className="text-gray-400" />
        <span className="text-sm text-gray-500">Push notifications are not supported on this device.</span>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="flex flex-col gap-1 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20">
        <div className="flex items-center gap-2">
          <BellOff size={16} className="text-amber-500" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Notifications blocked</span>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-300 leading-relaxed">
          You've blocked notifications for Mylestone. To re-enable, go to your browser or device settings and allow notifications for this site.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          {status === 'subscribed'
            ? <Bell size={18} className="text-brand-mint" />
            : <BellOff size={18} className="text-gray-400" />
          }
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {status === 'subscribed' ? 'Notifications on' : 'Notifications off'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {status === 'subscribed'
                ? 'Medication reminders and appointment alerts are active'
                : 'Get reminded about medications and upcoming appointments'}
            </p>
          </div>
        </div>
        <button
          onClick={status === 'subscribed' ? handleDisable : handleEnable}
          disabled={busy}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
            status === 'subscribed' ? 'bg-brand-mint' : 'bg-gray-300 dark:bg-gray-600'
          } ${busy ? 'opacity-60' : ''}`}
        >
          {busy
            ? <Loader2 size={12} className="absolute left-1/2 -translate-x-1/2 animate-spin text-white" />
            : <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${status === 'subscribed' ? 'translate-x-6' : 'translate-x-1'}`} />
          }
        </button>
      </div>
      {status === 'subscribed' && (
        <div className="flex items-start gap-2 px-4 py-2 rounded-xl bg-brand-mint/10">
          <Check size={14} className="text-brand-mint mt-0.5 flex-shrink-0" />
          <p className="text-xs text-brand-dark/70 dark:text-gray-300 leading-relaxed">
            You'll be reminded about medications at their scheduled times, and receive alerts 24 hours and 1 hour before appointments.
          </p>
        </div>
      )}
      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
  );
}

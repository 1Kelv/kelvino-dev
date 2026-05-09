import { useEffect } from 'react';
import { MedicationEntry } from '../types';

export function useNotificationReminders(entries: MedicationEntry[]) {
  useEffect(() => {
    if (!('Notification' in window)) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const today = now.toISOString().slice(0, 10);

      // Unique active reminders: latest entry per medication name that has a reminderTime
      const seen = new Set<string>();
      const reminders = entries.filter((e) => {
        if (!e.reminderTime) return false;
        if (seen.has(e.medicationName)) return false;
        seen.add(e.medicationName);
        return true;
      });

      for (const entry of reminders) {
        if (entry.reminderTime !== currentTime) continue;
        const key = `reminder_fired_${today}_${entry.medicationName}_${entry.reminderTime}`;
        if (localStorage.getItem(key)) continue;
        localStorage.setItem(key, '1');

        if (Notification.permission === 'granted') {
          new Notification(`Time for ${entry.medicationName}`, {
            body: `${entry.dose} ${entry.unit} · ${entry.route}`,
            icon: '/pwa-192x192.png',
            tag: `med-${entry.medicationName}`,
          });
        }
      }
    };

    const interval = setInterval(checkReminders, 60_000);
    checkReminders();
    return () => clearInterval(interval);
  }, [entries]);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

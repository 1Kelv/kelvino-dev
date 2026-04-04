// I provide utility functions used across the Mylestone app
import { format, formatDistanceToNow, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

// I format a datetime string for display
export function formatDateTime(dt: string): string {
  return format(new Date(dt), 'dd MMM yyyy, HH:mm');
}

// I format a date string for display
export function formatDate(dt: string): string {
  return format(new Date(dt), 'dd MMM yyyy');
}

// I format a time string for display
export function formatTime(dt: string): string {
  return format(new Date(dt), 'HH:mm');
}

// I return a human-readable relative time like "2 hours ago"
export function timeAgo(dt: string): string {
  return formatDistanceToNow(new Date(dt), { addSuffix: true });
}

// I compute baby's age as a friendly string
export function babyAge(dateOfBirth: string): string {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const years = differenceInYears(now, dob);
  const months = differenceInMonths(now, dob);
  const days = differenceInDays(now, dob);
  if (years >= 1) return `${years} year${years > 1 ? 's' : ''} old`;
  if (months >= 1) return `${months} month${months > 1 ? 's' : ''} old`;
  return `${days} day${days !== 1 ? 's' : ''} old`;
}

// I convert kg to lbs
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 100) / 100;
}

// I convert lbs to kg
export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 1000) / 1000;
}

// I join class names conditionally
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// I format duration in minutes to a human-readable string
export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// I get today's start and end as ISO strings
export function todayRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

// I check if a datetime string falls within today
export function isToday(dt: string): boolean {
  const d = new Date(dt);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// I get the current local datetime in the format required for datetime-local inputs
export function localDateTimeNow(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

// I get today's date in YYYY-MM-DD format for date inputs
export function localDateNow(): string {
  return localDateTimeNow().slice(0, 10);
}

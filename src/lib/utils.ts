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

// I check if a datetime/date string falls on a given Date
export function isOnDate(dt: string, date: Date): boolean {
  const d = new Date(dt);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
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

// I convert an ISO datetime string to the format required for datetime-local inputs
export function toLocalDateTimeInput(iso: string): string {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
}

// I convert an ISO date string to the format required for date inputs
export function toLocalDateInput(iso: string): string {
  return toLocalDateTimeInput(iso).slice(0, 10);
}

// I return a human-readable countdown for an appointment datetime.
// On the day itself it shows hours/mins remaining rather than just "Today".
export function appointmentCountdown(datetime: string): string {
  const appt = new Date(datetime);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const apptStart = new Date(appt.getFullYear(), appt.getMonth(), appt.getDate());
  const diffDays = Math.round((apptStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffMins = Math.round((appt.getTime() - now.getTime()) / 60000);
    if (diffMins <= 0) return 'Earlier today';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} to go`;
    const hours = Math.floor(diffMins / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} to go`;
  }
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) {
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 14) return 'In 1 week';
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
    if (diffDays < 60) return 'In 1 month';
    return `In ${Math.floor(diffDays / 30)} months`;
  }
  const absDays = Math.abs(diffDays);
  if (absDays < 7) return `${absDays} days ago`;
  if (absDays < 14) return '1 week ago';
  if (absDays < 30) return `${Math.floor(absDays / 7)} weeks ago`;
  if (absDays < 60) return '1 month ago';
  return `${Math.floor(absDays / 30)} months ago`;
}

// I return a label for who added a log entry ("Mum", "Dad", "Guardian", "Caregiver", first name, or "Co-parent")
export function getAuthorLabel(entryUserId: string, currentUser: { $id: string; name?: string; prefs?: { relationship?: string } } | null): string {
  if (!currentUser || entryUserId !== currentUser.$id) return 'Co-parent';
  const rel = currentUser.prefs?.relationship;
  if (rel) return rel; // "Mum", "Dad", "Guardian", "Caregiver"
  return currentUser.name?.split(' ')[0] || 'You';
}

// I return the month count if today is exactly N months after the DOB (same calendar day), else null.
// Used to trigger the monthly milestone celebration on the home screen.
export function isMonthBirthday(dateOfBirth: string): number | null {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  if (dob.getDate() !== now.getDate()) return null;
  const months = differenceInMonths(now, dob);
  if (months < 1) return null;
  // Verify the month count really lands exactly today (guard against same-day-different-month edge cases)
  const expected = new Date(dob);
  expected.setMonth(expected.getMonth() + months);
  if (expected.getDate() !== now.getDate() || expected.getMonth() !== now.getMonth() || expected.getFullYear() !== now.getFullYear()) return null;
  return months;
}

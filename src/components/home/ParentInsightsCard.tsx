import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { FeedEntry, NappyEntry, MedicationEntry, AppointmentEntry } from '../../types';

interface Props {
  babyName: string;
  babyGender?: string | null;
  feeds: FeedEntry[];
  nappies: NappyEntry[];
  medications: MedicationEntry[];
  appointments: AppointmentEntry[];
}

interface Insight {
  icon: string;
  text: string;
}

function weekStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 6);
  return d;
}

function pronoun(gender?: string | null): string {
  if (gender === 'female') return 'her';
  if (gender === 'male') return 'him';
  return 'them';
}

export function ParentInsightsCard({ babyName, babyGender, feeds, nappies, medications, appointments }: Props) {
  const since = weekStart();
  const now = new Date();

  const wFeeds = feeds.filter((f) => new Date(f.datetime) >= since);
  const wNappies = nappies.filter((n) => new Date(n.datetime) >= since);
  const wMeds = medications.filter((m) => new Date(m.datetime) >= since);
  const wAppts = appointments.filter((a) => {
    const d = new Date(a.datetime);
    return d >= since && d <= now;
  });

  if (wFeeds.length === 0 && wNappies.length === 0 && wMeds.length === 0) return null;

  const insights: Insight[] = [];

  if (wFeeds.length > 0) {
    const avg = wFeeds.length / 7;
    const level = avg >= 7 ? 'excellent' : avg >= 5 ? 'great' : avg >= 3 ? 'good' : 'tracking well';
    insights.push({ icon: '✅', text: `Feeding consistency: ${level}` });
  }

  if (wNappies.length > 0) {
    const wet = wNappies.filter((n) => n.kind === 'wet' || n.kind === 'both').length;
    const avgWet = wet / 7;
    const level = avgWet >= 5 ? 'reassuring' : avgWet >= 3 ? 'good' : 'keep it up';
    insights.push({ icon: '✅', text: `Hydration: ${level}` });
  }

  if (wMeds.length > 0) {
    const days = new Set(wMeds.map((m) => new Date(m.datetime).toDateString())).size;
    const level = days >= 6 ? 'outstanding' : days >= 4 ? 'excellent' : 'good';
    insights.push({ icon: '✅', text: `Medication adherence: ${level}` });
  }

  const parts: string[] = [];
  if (wFeeds.length > 0) parts.push(`${wFeeds.length} feed${wFeeds.length !== 1 ? 's' : ''}`);
  if (wNappies.length > 0) parts.push(`${wNappies.length} napp${wNappies.length !== 1 ? 'ies' : 'y'}`);
  if (parts.length > 0) {
    insights.push({ icon: '💙', text: `You logged ${parts.join(' and ')} this week` });
  }

  if (wAppts.length > 0) {
    insights.push({ icon: '💙', text: `You attended ${wAppts.length === 1 ? 'an appointment' : `${wAppts.length} appointments`} this week` });
  }

  insights.push({ icon: '💙', text: `You're giving ${babyName} exactly the care ${pronoun(babyGender)} needs` });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-5 shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <motion.div
          className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          <Heart size={17} className="text-white" />
        </motion.div>
        <div>
          <p className="text-white font-bold text-sm leading-none">Parent Insights</p>
          <p className="text-white/60 text-[11px] mt-0.5">This week</p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 320, damping: 26 }}
            className="flex items-start gap-2.5"
          >
            <span className="text-[15px] leading-none mt-0.5 flex-shrink-0">{insight.icon}</span>
            <p className="text-white/90 text-sm leading-snug">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

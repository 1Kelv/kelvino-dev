import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { FeedEntry, NappyEntry, SymptomEntry, MedicationEntry, SleepEntry } from '../../types';

interface TrendInsightsCardProps {
  babyId: string;
  babyName: string;
  feeds: FeedEntry[];
  nappies: NappyEntry[];
  symptoms: SymptomEntry[];
  medications: MedicationEntry[];
  sleep: SleepEntry[];
}

const CACHE_PREFIX = 'trendInsights_';

function buildSummary(
  feeds: FeedEntry[],
  nappies: NappyEntry[],
  symptoms: SymptomEntry[],
  medications: MedicationEntry[],
  sleep: SleepEntry[],
): string {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const rf = feeds.filter((e) => new Date(e.datetime) >= sevenDaysAgo);
  const rn = nappies.filter((e) => new Date(e.datetime) >= sevenDaysAgo);
  const rs = symptoms.filter((e) => new Date(e.datetime) >= sevenDaysAgo);
  const rm = medications.filter((e) => new Date(e.datetime) >= sevenDaysAgo);
  const rl = sleep.filter((e) => new Date(e.date) >= sevenDaysAgo);

  const avgMl = rf.length > 0 ? Math.round(rf.reduce((s, e) => s + e.amountMl, 0) / rf.length) : 0;
  const wetNappies = rn.filter((e) => e.kind === 'wet' || e.kind === 'both').length;
  const avgSleepMins = rl.length > 0 ? Math.round(rl.reduce((s, e) => s + e.durationMins, 0) / rl.length) : null;
  const cyanotic = rs.filter((e) => e.skinColour === 'blue').length;
  const poorFeeding = rs.filter((e) => !e.feedingWell).length;

  const lines = [
    `Baby tracking data — last 7 days:`,
    `Feeds: ${rf.length} total, avg ${avgMl}ml per feed`,
    `Nappies: ${rn.length} total (${wetNappies} wet/both)`,
    avgSleepMins ? `Sleep: ${rl.length} sessions, avg ${avgSleepMins} min` : `Sleep: no entries this week`,
    `Symptom checks: ${rs.length}${cyanotic > 0 ? `, ${cyanotic} cyanotic episodes` : ''}${poorFeeding > 0 ? `, ${poorFeeding} poor feeding noted` : ''}`,
    `Medications given: ${rm.length}`,
  ];
  return lines.join('\n');
}

function cacheKey(babyId: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `${CACHE_PREFIX}${babyId}_${today}`;
}

function getCache(babyId: string): string[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(babyId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCache(babyId: string, insights: string[]) {
  try {
    localStorage.setItem(cacheKey(babyId), JSON.stringify(insights));
  } catch {
    // storage full
  }
}

async function fetchInsights(summary: string): Promise<string[]> {
  const message = `You are Mylo, a warm supportive baby health assistant. Based on this 7-day tracking summary, give 2-4 short, non-alarmist, parent-friendly observations about patterns or trends. Focus on what's going well or what to watch. Never diagnose. Be warm and concise. Return ONLY a JSON array of strings, no markdown: ["observation 1", "observation 2"]\n\n${summary}`;

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: [] }),
  });

  if (!res.ok) throw new Error('API error');
  const json = await res.json();
  const text: string = json.response ?? '';
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error('Bad response shape');
  return parsed as string[];
}

export function TrendInsightsCard({ babyId, babyName, feeds, nappies, symptoms, medications, sleep }: TrendInsightsCardProps) {
  const [open, setOpen] = useState(false);
  const [insights, setInsights] = useState<string[] | null>(() => getCache(babyId));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCache(babyId);
      if (cached) { setInsights(cached); return; }
    }
    setLoading(true);
    setError(false);
    try {
      const summary = buildSummary(feeds, nappies, symptoms, medications, sleep);
      const result = await fetchInsights(summary);
      setCache(babyId, result);
      setInsights(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [babyId, feeds, nappies, symptoms, medications, sleep]);

  useEffect(() => {
    if (!open) return;
    if (!insights) load();
  }, [open, insights, load]);

  const hasData = feeds.length > 0 || nappies.length > 0;
  if (!hasData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-brand-dark" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Mylo's weekly insights</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">AI-powered trend analysis</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-50 dark:border-gray-700/50 pt-3">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-brand-mint border-t-transparent animate-spin flex-shrink-0" />
              Mylo is reading {babyName}'s data…
            </div>
          ) : error ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400 italic">Couldn't load insights right now.</p>
              <button onClick={() => load(true)} className="text-xs text-brand-mint font-semibold ml-2 flex items-center gap-1">
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : insights ? (
            <div className="flex flex-col gap-2">
              {insights.map((insight, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  <span className="text-brand-mint mt-0.5 flex-shrink-0 text-sm">•</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight}</p>
                </div>
              ))}
              <button
                onClick={() => load(true)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-mint transition-colors mt-1 self-end"
              >
                <RefreshCw size={11} /> Refresh
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

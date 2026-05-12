import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNameInfo } from '../../data/nameData';

interface NameInfo {
  origin: string;
  meaning: string;
  funFact: string;
}

interface NameMeaningCardProps {
  name: string;
}

const CACHE_PREFIX = 'nameMeaning_';

function getCached(name: string): NameInfo | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + name.toLowerCase());
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCache(name: string, info: NameInfo) {
  try {
    localStorage.setItem(CACHE_PREFIX + name.toLowerCase(), JSON.stringify(info));
  } catch {
    // storage full — ignore
  }
}

async function fetchNameInfoFromAI(name: string): Promise<NameInfo> {
  const message = `Give me the cultural origin, meaning, and one interesting fun fact about the baby name "${name}". Be warm, concise, and culturally accurate — especially for African, Yoruba, Igbo, Arabic, South Asian, East Asian and other non-English names. Respond ONLY with valid JSON in this exact format, no markdown, no extra text: {"origin":"...","meaning":"...","funFact":"..."}`;

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history: [] }),
  });

  if (!res.ok) throw new Error('API error');

  const json = await res.json();
  const text: string = json.response ?? '';

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.origin || !parsed.meaning || !parsed.funFact) throw new Error('Invalid response shape');
  return parsed as NameInfo;
}

export function NameMeaningCard({ name }: NameMeaningCardProps) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState<NameInfo | null>(() => {
    const cached = getCached(name);
    if (cached) return cached;
    const staticInfo = getNameInfo(name);
    return staticInfo ?? null;
  });
  const [loading, setLoading] = useState(false);
  const displayName = name.trim();

  useEffect(() => {
    if (info) return; // already have data (static or cached)
    if (!open) return; // lazy load — only fetch when opened

    let cancelled = false;
    setLoading(true);

    fetchNameInfoFromAI(name)
      .then((result) => {
        if (cancelled) return;
        setCache(name, result);
        setInfo(result);
      })
      .catch(() => {
        // silent — fallback message shown via info === null
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [open, name, info]);

  return (
    <div className="bg-brand-light dark:bg-gray-700/50 rounded-2xl px-4 py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <p className="text-sm font-semibold text-brand-dark dark:text-brand-mint truncate">
          ✨ About the name {displayName}
        </p>
        {open ? (
          <ChevronUp size={16} className="text-brand-dark dark:text-brand-mint flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-brand-dark dark:text-brand-mint flex-shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pt-3 flex flex-col gap-2">
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                  <span className="inline-block w-3 h-3 rounded-full border-2 border-brand-mint border-t-transparent animate-spin" />
                  Looking up {displayName}…
                </div>
              ) : info ? (
                <>
                  <span className="inline-block self-start text-xs font-semibold text-brand-dark dark:text-brand-mint bg-white/60 dark:bg-gray-600/60 rounded-full px-2.5 py-0.5">
                    {info.origin}
                  </span>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {info.meaning}
                  </p>
                  <p className="text-sm italic text-gray-500 dark:text-gray-400 flex gap-1.5">
                    <span className="not-italic flex-shrink-0">💡</span>
                    {info.funFact}
                  </p>
                </>
              ) : (
                <p className="text-sm italic text-gray-500 dark:text-gray-400">
                  Every name carries a story — {displayName}'s is yours to tell.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

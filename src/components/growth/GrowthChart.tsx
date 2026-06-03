import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ComposedChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { GrowthEntry } from '../../types';
import { differenceInDays } from 'date-fns';
import { getWHOWeightData } from '../../data/whoGrowthData';
import { useTheme } from '../../lib/ThemeContext';

interface GrowthChartProps {
  entries: GrowthEntry[];
  useKg: boolean;
  dob: string;
  gender?: 'male' | 'female' | 'other' | null;
}

function WeightTooltip({ active, payload, label, useKg }: any) {
  if (!active || !payload?.length) return null;
  const items = (payload as any[]).filter(
    (p) => ['weight', 'p50'].includes(p.dataKey) && p.value != null,
  );
  if (!items.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 text-sm border border-gray-100 dark:border-gray-700">
      <p className="text-xs text-gray-400 mb-2 font-medium">{label}m old</p>
      {items.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {p.dataKey === 'weight' && `${p.value} ${useKg ? 'kg' : 'lbs'}`}
            {p.dataKey === 'p50' && `${p.value} kg (median)`}
          </span>
        </div>
      ))}
    </div>
  );
}

function LengthTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const item = (payload as any[]).find((p) => p.dataKey === 'length' && p.value != null);
  if (!item) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-4 py-3 text-sm border border-gray-100 dark:border-gray-700">
      <p className="text-xs text-gray-400 mb-1 font-medium">{label}m old</p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#A78BFA] flex-shrink-0" />
        <span className="font-semibold text-gray-800 dark:text-gray-100">{item.value} cm</span>
      </div>
    </div>
  );
}

export function GrowthChart({ entries, useKg, dob, gender }: GrowthChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const dobDate = new Date(dob);
  const [showKey, setShowKey] = useState(false);

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const babyPoints = sorted.map((e) => {
    const daysOld = Math.max(0, differenceInDays(new Date(e.date), dobDate));
    const ageMonths = parseFloat((daysOld / 30.4375).toFixed(2));
    const w = useKg ? e.weightKg : e.weightLbs;
    return { ageMonths, weight: w > 0 ? w : null, length: e.lengthCm ?? null };
  });

  const maxBabyAge = babyPoints.length > 0 ? Math.max(...babyPoints.map((p) => p.ageMonths)) : 0;
  const maxWhoMonth = Math.min(24, Math.max(Math.ceil(maxBabyAge) + 1, 3));

  const showWHO = useKg;
  const whoData = showWHO ? getWHOWeightData(gender).filter((d) => d.month <= maxWhoMonth) : [];
  const whoPointsMap = new Map(whoData.map((d) => [d.month, d]));

  const ageSet = new Set<number>([
    ...whoData.map((d) => d.month),
    ...babyPoints.map((p) => p.ageMonths),
  ]);

  const weightData = Array.from(ageSet)
    .sort((a, b) => a - b)
    .map((ageMonths) => {
      const baby = babyPoints.find((p) => p.ageMonths === ageMonths);
      const who = whoPointsMap.get(ageMonths);
      return {
        ageMonths,
        weight: baby?.weight ?? null,
        p3: who ? who.p3 : null,
        bandWidth: who ? parseFloat((who.p97 - who.p3).toFixed(2)) : null,
        p50: who ? who.p50 : null,
      };
    });

  // Separate height dataset — only baby points that have length
  const lengthData = babyPoints
    .filter((p) => p.length !== null)
    .map((p) => ({ ageMonths: p.ageMonths, length: p.length }));

  const hasWeight = babyPoints.some((p) => p.weight !== null);
  const hasLength = lengthData.length > 0;

  if (!hasWeight && !hasLength) return null;

  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const gradientId = `whoGrad-${isDark ? 'dark' : 'light'}`;
  const genderLabel = gender === 'female' ? 'girls' : 'boys';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Growth over time</p>
        <button
          onClick={() => setShowKey((v) => !v)}
          className="flex items-center gap-1 text-xs text-brand-mint font-medium py-1 px-2 rounded-lg hover:bg-brand-light transition-colors"
        >
          <Info size={12} />
          {showKey ? 'Hide key' : 'How to read'}
          {showKey ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      </div>

      {/* Weight chart */}
      {hasWeight && (
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
            {showWHO && (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900 border border-blue-300 dark:border-blue-600 opacity-80" />
                <span className="text-xs text-gray-400 dark:text-gray-500">WHO {genderLabel} range</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-[3px] rounded-full" style={{ backgroundColor: '#4ECDC4' }} />
              <span className="text-xs text-gray-400 dark:text-gray-500">Weight ({useKg ? 'kg' : 'lbs'})</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={weightData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={isDark ? 0.35 : 0.22} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={isDark ? 0.1 : 0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.7} />
              <XAxis
                dataKey="ageMonths"
                type="number"
                domain={[0, maxWhoMonth]}
                tickFormatter={(v) => `${v}m`}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<WeightTooltip useKg={useKg} />} />
              {showWHO && (
                <>
                  <Area type="monotone" dataKey="p3" stroke="none" fill="transparent" stackId="band" legendType="none" connectNulls isAnimationActive={false} />
                  <Area type="monotone" dataKey="bandWidth" stroke="none" fill={`url(#${gradientId})`} stackId="band" legendType="none" connectNulls isAnimationActive={false} />
                  <Line type="monotone" dataKey="p50" stroke={isDark ? '#60a5fa' : '#93c5fd'} strokeWidth={1.5} dot={false} activeDot={false} connectNulls legendType="none" isAnimationActive={false} />
                </>
              )}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#4ECDC4"
                strokeWidth={3}
                dot={{ fill: '#4ECDC4', r: 5, strokeWidth: 2.5, stroke: isDark ? '#1f2937' : '#fff' }}
                activeDot={{ r: 7, fill: '#2A9D8F', strokeWidth: 2.5, stroke: isDark ? '#1f2937' : '#fff' }}
                connectNulls
                legendType="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Height chart */}
      {hasLength && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-5 h-[2px] rounded-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#A78BFA 0,#A78BFA 5px,transparent 5px,transparent 8px)' }} />
            <span className="text-xs text-gray-400 dark:text-gray-500">Length / height (cm)</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lengthData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.7} />
              <XAxis
                dataKey="ageMonths"
                type="number"
                domain={[0, maxWhoMonth]}
                tickFormatter={(v) => `${v}m`}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#A78BFA' }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip content={<LengthTooltip />} />
              <Line
                type="monotone"
                dataKey="length"
                stroke="#A78BFA"
                strokeWidth={2.5}
                strokeDasharray="5 4"
                dot={{ fill: '#A78BFA', r: 4, strokeWidth: 2, stroke: isDark ? '#1f2937' : '#fff' }}
                activeDot={{ r: 6, fill: '#7C3AED', strokeWidth: 2, stroke: isDark ? '#1f2937' : '#fff' }}
                connectNulls
                legendType="none"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showKey && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Chart key</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                <div className="w-5 h-[3px] rounded-full bg-[#4ECDC4]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#4ECDC4] border-2 border-white dark:border-gray-800" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Weight</span> — each dot is a recorded measurement in {useKg ? 'kg' : 'lbs'}.
              </p>
            </div>
            {hasLength && (
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                  <div className="w-5 h-[2px] rounded-full bg-[#A78BFA]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#A78BFA 0,#A78BFA 4px,transparent 4px,transparent 7px)' }} />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] border-2 border-white dark:border-gray-800" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Length / height</span> — recorded length in cm, on its own separate chart below.
                </p>
              </div>
            )}
            {showWHO && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-4 rounded-sm bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">WHO healthy range (P3–P97)</span> — where 94% of healthy {genderLabel} fall at each age, based on WHO 2006 growth standards.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-[2px] rounded-full bg-blue-300 dark:bg-blue-400 flex-shrink-0 mt-1.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Median (P50)</span> — half of healthy {genderLabel} weigh more than this, half weigh less.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2.5 mt-1">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    A baby tracking below P3 or above P97 is not automatically cause for concern — always discuss growth trends with your healthcare team.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

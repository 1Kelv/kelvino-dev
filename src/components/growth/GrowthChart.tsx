import React from 'react';
import {
  ComposedChart,
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

function ChartTooltip({ active, payload, label, useKg }: any) {
  if (!active || !payload?.length) return null;
  const items = (payload as any[]).filter(
    (p) => ['weight', 'length', 'p50'].includes(p.dataKey) && p.value !== null && p.value !== undefined
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
            {p.dataKey === 'length' && `${p.value} cm`}
            {p.dataKey === 'p50' && `${p.value} kg (median)`}
          </span>
        </div>
      ))}
    </div>
  );
}

export function GrowthChart({ entries, useKg, dob, gender }: GrowthChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const dobDate = new Date(dob);

  const babyPoints = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => {
      const daysOld = Math.max(0, differenceInDays(new Date(e.date), dobDate));
      const ageMonths = parseFloat((daysOld / 30.4375).toFixed(2));
      return {
        ageMonths,
        weight: useKg ? e.weightKg : e.weightLbs,
        length: e.lengthCm ?? null,
      };
    });

  const maxBabyAge = babyPoints.length > 0 ? Math.max(...babyPoints.map((p) => p.ageMonths)) : 0;
  const maxWhoMonth = Math.min(24, Math.max(Math.ceil(maxBabyAge) + 1, 3));

  const showWHO = useKg;
  const whoData = showWHO
    ? getWHOWeightData(gender).filter((d) => d.month <= maxWhoMonth)
    : [];

  const whoPointsMap = new Map(whoData.map((d) => [d.month, d]));

  const ageSet = new Set<number>([
    ...whoData.map((d) => d.month),
    ...babyPoints.map((p) => p.ageMonths),
  ]);

  const data = Array.from(ageSet)
    .sort((a, b) => a - b)
    .map((ageMonths) => {
      const baby = babyPoints.find((p) => p.ageMonths === ageMonths);
      const who = whoPointsMap.get(ageMonths);
      return {
        ageMonths,
        weight: baby?.weight ?? null,
        length: baby?.length ?? null,
        // Stacked band: p3 is transparent base, bandWidth fills to p97
        p3: who ? who.p3 : null,
        bandWidth: who ? parseFloat((who.p97 - who.p3).toFixed(2)) : null,
        p50: who ? who.p50 : null,
      };
    });

  if (data.length === 0) return null;

  const genderLabel = gender === 'female' ? 'girls' : 'boys';
  const hasLength = data.some((d) => d.length !== null);
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const gradientId = `whoGrad-${isDark ? 'dark' : 'light'}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Growth over time</p>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
        {showWHO && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900 border border-blue-300 dark:border-blue-600 opacity-80" />
            <span className="text-xs text-gray-400 dark:text-gray-500">WHO {genderLabel} range</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-[3px] rounded-full" style={{ backgroundColor: '#4ECDC4' }} />
          <span className="text-xs text-gray-400 dark:text-gray-500">Weight</span>
        </div>
        {hasLength && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-[2px] rounded-full" style={{ backgroundColor: '#A78BFA' }} />
            <span className="text-xs text-gray-400 dark:text-gray-500">Length</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <ComposedChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
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

          <Tooltip content={<ChartTooltip useKg={useKg} />} />

          {/* WHO filled band: transparent base + filled top layer */}
          {showWHO && (
            <>
              <Area
                type="monotone"
                dataKey="p3"
                stroke="none"
                fill="transparent"
                stackId="band"
                legendType="none"
                connectNulls
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="bandWidth"
                stroke="none"
                fill={`url(#${gradientId})`}
                stackId="band"
                legendType="none"
                connectNulls
                isAnimationActive={false}
              />
              {/* P50 median — thin solid line inside the band */}
              <Line
                type="monotone"
                dataKey="p50"
                stroke={isDark ? '#60a5fa' : '#93c5fd'}
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
                connectNulls
                legendType="none"
                isAnimationActive={false}
              />
            </>
          )}

          {/* Length — secondary line */}
          <Line
            type="monotone"
            dataKey="length"
            stroke="#A78BFA"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ fill: '#A78BFA', r: 4, strokeWidth: 2, stroke: isDark ? '#1f2937' : '#fff' }}
            activeDot={{ r: 6, fill: '#7C3AED', strokeWidth: 2, stroke: isDark ? '#1f2937' : '#fff' }}
            connectNulls
            legendType="none"
          />

          {/* Weight — hero line */}
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
  );
}

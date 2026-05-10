import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { GrowthEntry } from '../../types';
import { differenceInDays } from 'date-fns';
import { getWHOWeightData } from '../../data/whoGrowthData';

interface GrowthChartProps {
  entries: GrowthEntry[];
  useKg: boolean;
  dob: string;
  gender?: 'male' | 'female' | 'other' | null;
}

export function GrowthChart({ entries, useKg, dob, gender }: GrowthChartProps) {
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

  // WHO percentile overlay only available in kg mode
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
        p3: who ? who.p3 : null,
        p50: who ? who.p50 : null,
        p97: who ? who.p97 : null,
      };
    });

  if (data.length === 0) return null;

  const genderLabel = gender === 'female' ? 'girls' : 'boys';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Growth over time</p>
      {showWHO && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          WHO {genderLabel} reference: P3 / P50 / P97
        </p>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontSize: 13,
            }}
            labelFormatter={(v) => `Age: ${v}m`}
            formatter={(val: number, name: string) => {
              if (name === 'weight') return [`${val} ${useKg ? 'kg' : 'lbs'}`, 'Weight'];
              if (name === 'length') return [`${val} cm`, 'Length'];
              if (name === 'p3') return [`${val} kg`, 'P3'];
              if (name === 'p50') return [`${val} kg`, 'P50 (median)'];
              if (name === 'p97') return [`${val} kg`, 'P97'];
              return [val, name];
            }}
          />
          {showWHO && (
            <>
              <Line type="monotone" dataKey="p97" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" dot={false} connectNulls legendType="none" />
              <Line type="monotone" dataKey="p50" stroke="#93c5fd" strokeWidth={1.5} strokeDasharray="4 3" dot={false} connectNulls legendType="none" />
              <Line type="monotone" dataKey="p3" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 3" dot={false} connectNulls legendType="none" />
            </>
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#4ECDC4"
            strokeWidth={2.5}
            dot={{ fill: '#4ECDC4', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#2A9D8F' }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="length"
            stroke="#A78BFA"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#A78BFA', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#7C3AED' }}
            connectNulls
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

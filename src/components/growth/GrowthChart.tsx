// I render a line chart showing weight and length over time
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
import { format } from 'date-fns';

interface GrowthChartProps {
  entries: GrowthEntry[];
  useKg: boolean;
}

export function GrowthChart({ entries, useKg }: GrowthChartProps) {
  // I sort entries by date ascending for the chart
  const data = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      date: format(new Date(e.date), 'dd MMM'),
      weight: useKg ? e.weightKg : e.weightLbs,
      length: e.lengthCm ?? null,
    }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <p className="text-sm font-semibold text-gray-600 mb-3">
        Growth over time
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
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
            formatter={(val: number, name: string) =>
              name === 'weight'
                ? [`${val} ${useKg ? 'kg' : 'lbs'}`, 'Weight']
                : [`${val} cm`, 'Length']
            }
          />
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

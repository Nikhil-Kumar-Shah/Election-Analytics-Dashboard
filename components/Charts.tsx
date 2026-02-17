/**
 * Election Analytics Dashboard - Chart Components
 * Copyright (c) 2026 Nikhil Kumar Shah
 * All rights reserved. Unauthorized copying or distribution is prohibited.
 */

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

export const COLORS = {
  primary: '#2563eb', // blue-600
  secondary: '#64748b', // slate-500
  accent: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  success: '#10b981', // emerald-500
};

interface ChartProps {
  data: any[];
  xKey: string;
  yKey?: string; // For single line/bar
  keys?: string[]; // For multi-line/bar
  width?: string | number;
  height?: number;
}

export const TrendLineChart: React.FC<ChartProps> = ({ data, xKey, keys = ['value'] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
      <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
      <Tooltip 
        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        itemStyle={{ color: '#1e293b' }}
      />
      <Legend />
      {keys.map((key, index) => (
        <Line 
          key={key} 
          type="monotone" 
          dataKey={key} 
          stroke={index === 0 ? COLORS.primary : COLORS.accent} 
          strokeWidth={2.5} 
          dot={{ r: 3, fill: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 5 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export const ComparisonBarChart: React.FC<ChartProps> = ({ data, xKey, yKey = 'value' }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
      <XAxis dataKey={xKey} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
      <Tooltip 
         cursor={{ fill: '#f1f5f9' }}
         contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
      />
      <Bar dataKey={yKey} fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={40} />
    </BarChart>
  </ResponsiveContainer>
);

export const DriverScatterChart: React.FC<ChartProps & { zKey?: string, name?: string }> = ({ data, xKey, yKey = 'y', zKey, name }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" dataKey={xKey} name={xKey} unit="" stroke="#64748b" fontSize={12} label={{ value: xKey, position: 'bottom', offset: 0 }} />
      <YAxis type="number" dataKey={yKey} name={name || "Turnout"} unit="%" stroke="#64748b" fontSize={12} />
      <ZAxis type="number" dataKey={zKey} range={[40, 200]} name={zKey} />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px' }} />
      <Scatter name={name} data={data} fill={COLORS.primary} />
    </ScatterChart>
  </ResponsiveContainer>
);

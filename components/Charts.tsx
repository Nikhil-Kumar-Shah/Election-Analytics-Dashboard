/**
 * Election Analytics Dashboard - Chart Components
 * Copyright (c) 2026 Nikhil Kumar Shah. All rights reserved.
 * Unauthorized reproduction or distribution prohibited.
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

export const TrendLineChart: React.FC<ChartProps> = ({ data, xKey, keys = ['value'] }) => {
  // Custom tooltip for trend chart
  const TrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs">
          <p className="font-semibold text-slate-700 mb-1">Year: {payload[0].payload[xKey]}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-slate-600">
              <span className="font-semibold" style={{ color: entry.color }}>Avg Turnout:</span> {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#64748b" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          label={{ value: 'Year', position: 'insideBottom', offset: -10, style: { fontSize: 11, fill: '#64748b', fontWeight: 600 } }}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          domain={['auto', 'auto']}
          label={{ value: 'Turnout (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b', fontWeight: 600 } }}
        />
        <Tooltip content={<TrendTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          formatter={(value) => 'Average Turnout'}
        />
        {keys.map((key, index) => (
          <Line 
            key={key} 
            type="monotone" 
            dataKey={key} 
            name="Average Turnout"
            stroke={index === 0 ? COLORS.primary : COLORS.accent} 
            strokeWidth={2.5} 
            dot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

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

export const DriverScatterChart: React.FC<ChartProps & { zKey?: string, name?: string, xLabel?: string, yLabel?: string }> = ({ 
  data, 
  xKey, 
  yKey = 'y', 
  zKey, 
  name,
  xLabel,
  yLabel 
}) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs">
          <p className="font-bold text-slate-900 mb-1">{point.name || 'Unknown'}</p>
          {point.state && <p className="text-slate-500 mb-2 text-[10px]">{point.state}</p>}
          <div className="space-y-1">
            <p className="text-slate-700">
              <span className="font-semibold">{xLabel || 'X'}:</span> {typeof point.x === 'number' ? point.x.toFixed(1) : point.x}
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Turnout:</span> {typeof point.y === 'number' ? point.y.toFixed(1) : point.y}%
            </p>
            {point.z !== undefined && (
              <p className="text-slate-700">
                <span className="font-semibold">{zKey === 'z' ? 'Size' : zKey}:</span> {typeof point.z === 'number' ? point.z.toFixed(0) : point.z}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey={xKey} 
          name={xLabel || xKey} 
          stroke="#64748b" 
          fontSize={12} 
          label={{ value: xLabel || xKey, position: 'bottom', offset: -5, style: { fontSize: 11, fill: '#64748b' } }} 
        />
        <YAxis 
          type="number" 
          dataKey={yKey} 
          name={name || "Turnout"} 
          unit="%" 
          stroke="#64748b" 
          fontSize={12}
          label={{ value: yLabel || 'Turnout %', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
        />
        <ZAxis type="number" dataKey={zKey} range={[40, 200]} name={zKey} />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name={name} data={data} fill={COLORS.primary} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

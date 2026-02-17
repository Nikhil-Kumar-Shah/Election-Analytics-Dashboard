/**
 * Election Analytics Dashboard - Trends Analysis Page
 * Copyright (c) 2026 Nikhil Kumar Shah. All rights reserved.
 * Unauthorized reproduction or distribution prohibited.
 */

import React from 'react';
import { ConstituencyData, FilterState } from '../types';
import { TrendLineChart, ComparisonBarChart } from '../components/Charts';
import { getRawData } from '../services/dataService';

interface TrendsProps {
  data: ConstituencyData[];
  filters: FilterState;
}

export const Trends: React.FC<TrendsProps> = ({ data, filters }) => {
  const rawData = getRawData();
  
  // Filter raw data by selected states/constituencies
  let filteredRaw = rawData;
  if (filters.states.length > 0) {
    filteredRaw = filteredRaw.filter(d => filters.states.includes(d.state_name));
  }
  if (filters.constituencies.length > 0) {
    filteredRaw = filteredRaw.filter(d => filters.constituencies.includes(d.ac_name));
  }

  // Calculate Decline vs Growth split
  const increasing = data.filter(d => d.turnout_change > 0).length;
  const decreasing = data.filter(d => d.turnout_change < 0).length;
  const stable = data.filter(d => d.turnout_change === 0).length;
  const totalWithChange = data.filter(d => d.turnout_change !== 0).length;
  const increasingPct = totalWithChange > 0 ? ((increasing / totalWithChange) * 100).toFixed(1) : '0';
  const decreasingPct = totalWithChange > 0 ? ((decreasing / totalWithChange) * 100).toFixed(1) : '0';

  // Calculate yearly averages
  const yearlyData = filteredRaw.reduce((acc: any, curr) => {
    if (!acc[curr.year]) {
      acc[curr.year] = { sum: 0, count: 0 };
    }
    acc[curr.year].sum += curr.turnout;
    acc[curr.year].count += 1;
    return acc;
  }, {});

  const yearlyAvg = Object.entries(yearlyData)
    .map(([year, data]: [string, any]) => ({
      year: parseInt(year),
      value: Number((data.sum / data.count).toFixed(2))
    }))
    .sort((a, b) => a.year - b.year);

  // Turnout distribution for current year
  const buckets = [
    { name: '<50%', count: 0 },
    { name: '50-60%', count: 0 },
    { name: '60-70%', count: 0 },
    { name: '70-80%', count: 0 },
    { name: '>80%', count: 0 },
  ];

  data.forEach(d => {
    if (d.turnout < 50) buckets[0].count++;
    else if (d.turnout < 60) buckets[1].count++;
    else if (d.turnout < 70) buckets[2].count++;
    else if (d.turnout < 80) buckets[3].count++;
    else buckets[4].count++;
  });

  // Year-over-year change data: show top 10 increases AND top 10 decreases
  const allChanges = data
    .filter(d => d.turnout_change !== 0)
    .sort((a, b) => b.turnout_change - a.turnout_change);
  
  const topIncreases = allChanges.slice(0, 10).map(d => ({
    name: d.ac_name.substring(0, 20),
    value: Number(d.turnout_change.toFixed(2)),
    isNegative: false,
    fullName: d.ac_name,
    state: d.state_name
  }));
  
  const topDecreases = allChanges.slice(-10).reverse().map(d => ({
    name: d.ac_name.substring(0, 20),
    value: Number(d.turnout_change.toFixed(2)),
    isNegative: true,
    fullName: d.ac_name,
    state: d.state_name
  }));
  
  const changeData = [...topIncreases, ...topDecreases];

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-600 p-6 rounded-r-2xl shadow-sm">
        <h3 className="font-bold text-blue-900 text-lg">Participation Over Time</h3>
        <p className="text-sm text-blue-800/80 mt-1 max-w-3xl">
          Track how voter turnout evolves across election cycles. Identify declining trends, growth patterns, and volatility to understand engagement dynamics.
        </p>
      </div>

      {/* Decline vs Growth Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Increasing Turnout</span>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          </div>
          <div className="text-3xl font-bold text-emerald-700">{increasingPct}%</div>
          <p className="text-xs text-slate-500 mt-1">{increasing} constituencies showing growth</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Decreasing Turnout</span>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <div className="text-3xl font-bold text-red-700">{decreasingPct}%</div>
          <p className="text-xs text-slate-500 mt-1">{decreasing} constituencies showing decline</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Trend Analysis</span>
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
          </div>
          <div className="text-lg font-bold text-slate-700">
            {parseFloat(decreasingPct) > parseFloat(increasingPct) ? 'Widespread Decline' : 'Positive Momentum'}
          </div>
          <p className="text-xs text-slate-500 mt-1">Based on year-over-year change</p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">National Average Change</div>
          <div className="text-3xl font-bold text-slate-900">
            {yearlyAvg.length > 1 
              ? `${(yearlyAvg[yearlyAvg.length - 1].value - yearlyAvg[0].value) > 0 ? '+' : ''}${(yearlyAvg[yearlyAvg.length - 1].value - yearlyAvg[0].value).toFixed(2)}%`
              : 'N/A'
            }
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {yearlyAvg.length > 1 ? `From ${yearlyAvg[0].year} to ${yearlyAvg[yearlyAvg.length - 1].year}` : 'Insufficient data'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Constituencies Improving</div>
          <div className="text-3xl font-bold text-emerald-700">{increasing.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Showing positive year-over-year growth</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm">
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">Constituencies Declining</div>
          <div className="text-3xl font-bold text-red-700">{decreasing.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Showing negative year-over-year change</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Time Series */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800">Average Turnout Trend</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Aggregated voter participation across selected scope over time</p>
          </div>
          {yearlyAvg.length > 0 ? (
            <>
              <TrendLineChart data={yearlyAvg} xKey="year" />
              <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100">
                <strong className="text-slate-900">Key Insight:</strong>{' '}
                {yearlyAvg.length > 1 && yearlyAvg[yearlyAvg.length - 1]?.value < yearlyAvg[0]?.value
                  ? `Overall declining trend observed (${(yearlyAvg[0].value - yearlyAvg[yearlyAvg.length - 1].value).toFixed(2)}% decrease). Sharp declines may indicate substantial voter disengagement.`
                  : 'Turnout trends indicate relative stability or growth. Continue monitoring for sustained engagement.'}
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <p>No data available for selected filters</p>
            </div>
          )}
        </div>

        {/* Chart 2: Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800">Turnout Distribution ({filters.year})</h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Number of constituencies by turnout bracket</p>
          </div>
          <ComparisonBarChart data={buckets} xKey="name" yKey="count" />
          <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-100">
            <strong className="text-slate-900">Interpretation:</strong>{' '}
            {buckets[0].count > buckets[4].count
              ? 'Left-skewed distribution indicates widespread low participation challenges.'
              : 'Distribution shows healthy participation across most constituencies.'}
          </div>
        </div>
      </div>

      {/* Year-over-Year Change - Balanced View */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800">Largest Turnout Changes (Year-over-Year)</h3>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Top 10 increases and top 10 decreases - showing the full picture of engagement shifts
          </p>
        </div>
        {changeData.length > 0 ? (
          <div className="space-y-3">
            <div className="mb-6">
              <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                Top 10 Increases
              </h4>
              {topIncreases.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <div className="w-48 text-sm font-medium text-slate-700 truncate" title={item.fullName}>{item.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end px-3 text-xs font-bold text-white bg-emerald-500"
                      style={{ width: `${Math.min(Math.abs(item.value) * 5, 100)}%` }}
                    >
                      +{item.value}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-6">
              <h4 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Top 10 Decreases
              </h4>
              {topDecreases.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <div className="w-48 text-sm font-medium text-slate-700 truncate" title={item.fullName}>{item.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full flex items-center justify-end px-3 text-xs font-bold text-white bg-red-500"
                      style={{ width: `${Math.min(Math.abs(item.value) * 5, 100)}%` }}
                    >
                      {item.value}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-slate-400">
            <p>No year-over-year change data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

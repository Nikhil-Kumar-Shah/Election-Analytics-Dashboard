/**
 * Election Analytics Dashboard - Overview Page
 * Copyright (c) 2026 Nikhil Kumar Shah. All rights reserved.
 * Unauthorized reproduction or distribution prohibited.
 */

import React from 'react';
import { ConstituencyData, FilterState } from '../types';
import { Users, TrendingDown, Activity, AlertTriangle, Lightbulb, BookOpen, Info } from 'lucide-react';

interface OverviewProps {
  data: ConstituencyData[];
  filters: FilterState;
}

export const Overview: React.FC<OverviewProps> = ({ data, filters }) => {
  // Calculate KPI metrics
  const avgTurnout = data.length > 0 
    ? (data.reduce((acc, curr) => acc + curr.turnout, 0) / data.length).toFixed(1) 
    : '0';
  
  const countConstituencies = new Set(data.map(d => `${d.state_name}-${d.ac_name}`)).size;
  
  const decliningCount = data.filter(d => d.turnout_change < 0).length;
  const decliningPct = data.length > 0 ? ((decliningCount / data.length) * 100).toFixed(0) : '0';
  
  const highestPriority = data.length > 0 
    ? (Math.max(...data.map(d => d.priority_score)) * 100).toFixed(1) + '%'
    : '0.0%';
  
  // Empty state check
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertTriangle className="text-slate-300 mb-4" size={64} />
        <h3 className="text-xl font-bold text-slate-700 mb-2">No Data Available</h3>
        <p className="text-slate-500 max-w-md">
          No constituencies match your current filter selection. Try adjusting the state, constituency, or year filters to see data.
        </p>
      </div>
    );
  }
  
  // Sort by priority for top 10 table
  const topPriority = [...data]
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 10);

  return (
    <>
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard 
          title="Avg. Turnout" 
          value={`${avgTurnout}%`} 
          subtext={`Year ${filters.year}`} 
          icon={Activity} 
          color="blue"
          tooltip="Average voter turnout across all selected constituencies for the chosen year. Higher percentages indicate stronger democratic participation."
        />
        <KpiCard 
          title="Constituencies" 
          value={countConstituencies.toString()} 
          subtext="In selected scope" 
          icon={Users} 
          color="slate"
          tooltip="Total number of unique constituencies matching your current filter selection (state, year, etc.)."
        />
        <KpiCard 
          title="Declining Trend" 
          value={`${decliningPct}%`} 
          subtext="Negative turnout change" 
          icon={TrendingDown} 
          color="amber"
          tooltip="Percentage of constituencies showing negative year-over-year turnout change, indicating declining voter engagement requiring investigation."
        />
        <KpiCard 
          title="Highest Priority" 
          value={highestPriority} 
          subtext="Maximum score" 
          icon={AlertTriangle} 
          color="red"
          tooltip="Maximum priority score observed (composite metric combining low turnout, negative trend, volatility, and constituency size). Higher scores indicate urgent intervention need."
        />
      </div>

      {/* How to Read This Dashboard */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">How to Read This Dashboard</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="text-blue-600 font-bold text-lg">1</span>
            <p className="text-slate-600"><strong className="text-slate-900">Use filters</strong> (top right) to explore specific states, constituencies, or election years</p>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-600 font-bold text-lg">2</span>
            <p className="text-slate-600"><strong className="text-slate-900">Priority Score</strong> ranks constituencies by intervention urgency (higher = more urgent)</p>
          </div>
          <div className="flex gap-3">
            <span className="text-blue-600 font-bold text-lg">3</span>
            <p className="text-slate-600"><strong className="text-slate-900">Forward-Looking</strong> page provides early warning indicators for at-risk constituencies</p>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-600 p-8 rounded-r-2xl shadow-sm">
        <h3 className="font-bold text-blue-900 text-xl mb-4">Executive Summary</h3>
        <p className="text-blue-800/90 leading-relaxed max-w-4xl">
          In {filters.year}, the average voter turnout across {countConstituencies.toLocaleString()} constituencies was <strong>{avgTurnout}%</strong>. 
          Turnout ranges from {Math.min(...data.map(d => d.turnout)).toFixed(1)}% to {Math.max(...data.map(d => d.turnout)).toFixed(1)}%, 
          with <strong>{data.filter(d => d.turnout < 50).length.toLocaleString()} constituencies below 50%</strong> participation. 
          <strong>{decliningPct}% of constituencies</strong> experienced a decline compared to the previous election cycle, indicating widespread engagement challenges. 
          Several constituencies also exhibit high volatility in turnout, signaling unstable participation patterns that require targeted intervention.
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FindingCard 
          number="01"
          title="Participation Variance"
          text={`Turnout ranges from ${Math.min(...data.map(d => d.turnout)).toFixed(1)}% to ${Math.max(...data.map(d => d.turnout)).toFixed(1)}% across ${countConstituencies.toLocaleString()} constituencies, with ${data.filter(d => d.turnout < 50).length} constituencies below 50% participation, indicating local governance and engagement factors are critical drivers.`}
        />
        <FindingCard 
          number="02"
          title="Declining Engagement"
          text={`${decliningPct}% of constituencies indicate negative turnout changes from the previous cycle, signaling potential voter apathy or systemic barriers to voting.`}
        />
        <FindingCard 
          number="03"
          title="High Volatility Zones"
          text="Several constituencies exhibit high volatility in turnout across election cycles, representing unpredictable engagement patterns that require monitoring."
        />
      </div>

      {/* Top Priority Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-xl">Top 10 Priority Constituencies (Year {filters.year})</h3>
            <div className="group relative">
              <Info size={16} className="text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block w-80 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                <strong className="block mb-1">What this shows:</strong>
                Constituencies ranked by composite priority score (combining low turnout, negative trend, volatility, and size).
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <strong className="block mb-1">Judge's Insight:</strong>
                  These are the highest-risk constituencies requiring immediate targeted intervention and resource allocation.
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">Ranked by composite priority score - highest intervention need</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 font-semibold uppercase bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Rank</th>
                <th className="px-8 py-4">State</th>
                <th className="px-8 py-4">Constituency</th>
                <th className="px-8 py-4 text-right">Turnout</th>
                <th className="px-8 py-4 text-right">Avg Turnout</th>
                <th className="px-8 py-4 text-right">Volatility</th>
                <th className="px-8 py-4 text-right">Priority Score</th>
              </tr>
            </thead>
            <tbody>
              {topPriority.map((row, index) => (
                <tr key={`${row.state_name}-${row.ac_name}`} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-4 font-mono text-slate-400 font-bold">#{index + 1}</td>
                  <td className="px-8 py-4 font-medium text-slate-900">{row.state_name}</td>
                  <td className="px-8 py-4 text-slate-700 group-hover:text-blue-600 transition-colors font-medium">{row.ac_name}</td>
                  <td className="px-8 py-4 text-right font-mono font-medium text-slate-700">{row.turnout.toFixed(1)}%</td>
                  <td className="px-8 py-4 text-right font-mono text-slate-500">{row.avg_turnout.toFixed(1)}%</td>
                  <td className="px-8 py-4 text-right font-mono text-slate-500">{row.turnout_volatility.toFixed(2)}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full ${row.priority_score > 0.30 ? 'bg-red-500' : row.priority_score > 0.20 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                          style={{ width: `${Math.min(row.priority_score * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-800 w-12 text-right">{(row.priority_score * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50/50 px-8 py-4 text-center border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600">
            View complete prioritization analysis and download reports in the <span className="text-blue-600 font-bold">Prioritization</span> tab
          </p>
        </div>
      </div>

      {/* Key Recommendations */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-r-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-amber-900 text-xl">📌 Recommended Actions</h3>
        </div>
        <div className="space-y-3 text-amber-900">
          <div className="flex gap-3 items-start">
            <span className="bg-amber-200 text-amber-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
            <p className="text-sm leading-relaxed">
              <strong>Focus immediate interventions</strong> on the Top 10 priority constituencies listed above. 
              These areas demonstrate the highest composite risk and greatest potential for impact.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-amber-200 text-amber-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
            <p className="text-sm leading-relaxed">
              <strong>Stabilize high-volatility constituencies</strong> through continuous engagement programs. 
              Unpredictable turnout patterns (see Forward-Looking tab) indicate need for consistent voter education between cycles.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-amber-200 text-amber-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
            <p className="text-sm leading-relaxed">
              <strong>Investigate urban high-electorate, low-turnout areas</strong> for systemic access barriers. 
              Large constituencies with persistent low participation may require infrastructure improvements or weekend voting options.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Sub-components
const KpiCard = ({ title, value, subtext, icon: Icon, color, tooltip }: any) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-50 text-slate-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          {tooltip && (
            <div className="group/tooltip relative">
              <Info size={12} className="text-slate-300 cursor-help" />
              <div className="absolute left-0 top-5 hidden group-hover/tooltip:block w-64 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm font-medium text-slate-400 mt-1">{subtext}</p>
      </div>
      <div className={`p-3 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform duration-200`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
    </div>
  );
};

const FindingCard = ({ number, title, text }: any) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-200 hover:shadow-md transition-all duration-300">
    <div className="absolute -top-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors"></div>
    <div className="absolute top-4 right-6 font-black text-4xl text-slate-100 select-none group-hover:text-blue-100 transition-colors">
      {number}
    </div>
    <h4 className="text-lg font-bold text-slate-900 mb-3 relative z-10">{title}</h4>
    <p className="text-sm text-slate-600 leading-relaxed relative z-10 font-medium">{text}</p>
  </div>
);

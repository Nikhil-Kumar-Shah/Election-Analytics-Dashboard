/**
 * Election Analytics Dashboard - Forward-Looking Analysis Page
 * Copyright (c) 2026 Nikhil Kumar Shah. All rights reserved.
 * Unauthorized reproduction or distribution prohibited.
 */

import React from 'react';
import { ConstituencyData } from '../types';
import { AlertTriangle, TrendingDown, Activity, CircleAlert, Info } from 'lucide-react';

interface ForwardLookingProps {
  data: ConstituencyData[];
}

export const ForwardLooking: React.FC<ForwardLookingProps> = ({ data }) => {
  // Top 10 most volatile
  const volatile = [...data]
    .sort((a, b) => b.turnout_volatility - a.turnout_volatility)
    .slice(0, 10);

  // Largest recent declines
  const declining = [...data]
    .filter(d => d.turnout_change < 0)
    .sort((a, b) => a.turnout_change - b.turnout_change)
    .slice(0, 10);

  // High risk watchlist: low avg + negative change OR high volatility
  const watchlist = [...data]
    .filter(d => 
      (d.avg_turnout < 60 && d.turnout_change < 0) || 
      d.turnout_volatility > 5
    )
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 15);

  // Risk flag function
  const getRiskFlag = (row: ConstituencyData) => {
    if (row.priority_score > 0.30 || (row.avg_turnout < 50 && row.turnout_change < -3)) {
      return { emoji: '🔴', label: 'Critical', color: 'text-red-600' };
    } else if (row.priority_score > 0.20 || row.turnout_volatility > 5) {
      return { emoji: '🟠', label: 'High', color: 'text-orange-600' };
    } else {
      return { emoji: '🟡', label: 'Monitor', color: 'text-yellow-600' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Rationale Box - Why This Matters */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl shadow-sm">
        <h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center gap-2">
          <AlertTriangle className="text-blue-600" size={20} />
          Why Volatility and Negative Changes Matter
        </h3>
        <p className="text-sm text-blue-800/90 leading-relaxed">
          <strong>High volatility</strong> signals unpredictable engagement patterns, making it difficult to plan resources and infrastructure. 
          <strong> Large negative changes</strong> suggest systematic erosion of voter confidence or logistical barriers requiring immediate investigation. 
          Monitoring these early-warning signals enables proactive intervention before constituencies experience sustained democratic disengagement.
        </p>
      </div>

       <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-bold text-amber-900 mb-1">Early Warning System</h3>
            <p className="text-amber-800/90 text-sm leading-relaxed max-w-4xl">
              Proactive monitoring of constituencies showing unstable patterns or rapid deterioration. 
              These metrics help election authorities anticipate logistical challenges and deploy targeted interventions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Volatility */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-blue-600" size={24} />
            <h4 className="font-bold text-slate-800 text-lg">Highest Volatility Constituencies</h4>
            <div className="group relative">
              <Info size={16} className="text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block w-72 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                <strong className="block mb-1">What this shows:</strong>
                Constituencies with highest turnout volatility (σ = standard deviation) across election cycles.
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <strong className="block mb-1">Why it matters:</strong>
                  High volatility = unpredictable engagement, making resource planning difficult and indicating systemic instability.
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {volatile.map((v, idx) => (
              <div key={`${v.state_name}-${v.ac_name}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                 <div className="flex items-center gap-3">
                   <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
                   <div>
                     <div className="font-bold text-slate-900 text-sm">{v.ac_name}</div>
                     <div className="text-xs font-medium text-slate-500 mt-0.5">{v.state_name}</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-bold text-slate-700">σ = {v.turnout_volatility.toFixed(2)}</div>
                   <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${v.turnout_change < 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                     {v.turnout_change > 0 ? '+' : ''}{v.turnout_change.toFixed(1)}%
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Declining */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="text-red-600" size={24} />
            <h4 className="font-bold text-slate-800 text-lg">Largest Recent Declines</h4>
            <div className="group relative">
              <Info size={16} className="text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block w-72 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                <strong className="block mb-1">What this shows:</strong>
                Constituencies with the largest negative turnout changes from previous election cycle.
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <strong className="block mb-1">Why it matters:</strong>
                  Sharp declines signal systematic erosion of voter confidence or logistical barriers requiring urgent investigation.
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {declining.map((d, idx) => (
              <div key={`${d.state_name}-${d.ac_name}`} className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100 hover:border-red-200 transition-colors">
                 <div className="flex items-center gap-3">
                   <span className="text-xs font-bold text-red-400 w-6">#{idx + 1}</span>
                   <div>
                     <div className="font-bold text-slate-900 text-sm">{d.ac_name}</div>
                     <div className="text-xs font-medium text-slate-500 mt-0.5">{d.state_name}</div>
                   </div>
                 </div>
                 <div className="text-right">
                   <div className="text-sm font-bold text-red-700">{d.turnout_change.toFixed(1)}%</div>
                   <div className="text-xs text-slate-500 mt-0.5">from {d.turnout.toFixed(1)}%</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Risk Watchlist Table */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-red-100 bg-red-50/50">
          <h3 className="font-bold text-red-900 text-xl flex items-center gap-2">
            <AlertTriangle size={20} />
            High Risk Watchlist
          </h3>
          <p className="text-sm text-red-700 mt-1">
            Constituencies with low turnout + negative trend OR extreme volatility - requiring immediate monitoring
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 font-semibold uppercase bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Risk</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Constituency</th>
                <th className="px-6 py-4 text-right">Avg Turnout</th>
                <th className="px-6 py-4 text-right">Recent Change</th>
                <th className="px-6 py-4 text-right">Volatility</th>
                <th className="px-6 py-4 text-right">Priority Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {watchlist.map((row) => {
                const risk = getRiskFlag(row);
                return (
                  <tr key={`${row.state_name}-${row.ac_name}`} className="hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl">{risk.emoji}</span>
                        <span className={`text-xs font-bold ${risk.color}`}>{risk.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700 text-xs">{row.state_name}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{row.ac_name}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono font-bold px-2 py-1 rounded ${row.avg_turnout < 50 ? 'bg-red-100 text-red-700' : 'text-slate-700'}`}>
                        {row.avg_turnout.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono font-bold ${row.turnout_change < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {row.turnout_change > 0 ? '+' : ''}{row.turnout_change.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">{row.turnout_volatility.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-red-700">{(row.priority_score * 100).toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitoring Checklist */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <CircleAlert className="text-blue-600" size={24} />
          <h4 className="font-bold text-blue-900 text-lg">Monitoring Checklist for Election Authorities</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Conduct booth-level audits in 🔴 Critical constituencies</p>
                <p className="text-xs text-slate-600 mt-1">Verify polling station accessibility, staffing adequacy, and voter list accuracy</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Launch targeted SVEEP campaigns in low-turnout areas</p>
                <p className="text-xs text-slate-600 mt-1">Systematic Voters' Education and Electoral Participation programs</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Deploy mobile polling units for remote/underserved areas</p>
                <p className="text-xs text-slate-600 mt-1">Address geographical barriers affecting high-volatility constituencies</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Review electoral roll cleanup in urban constituencies</p>
                <p className="text-xs text-slate-600 mt-1">Remove duplicates, migrate voters, and update addresses</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Monitor social media sentiment in declining areas</p>
                <p className="text-xs text-slate-600 mt-1">Identify voter apathy causes and address misinformation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">Schedule quarterly review meetings for watchlist constituencies</p>
                <p className="text-xs text-slate-600 mt-1">Track intervention effectiveness and adjust strategies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Interventions */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h4 className="font-bold text-slate-800 mb-6 text-lg">Recommended Interventions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            <div>
              <h5 className="text-slate-900 font-bold text-sm mb-1">High Volatility</h5>
              <p className="text-xs text-slate-600 leading-relaxed">Deploy consistent voter education programs across cycles to stabilize participation patterns.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
            <div>
              <h5 className="text-slate-900 font-bold text-sm mb-1">Declining Trend</h5>
              <p className="text-xs text-slate-600 leading-relaxed">Audit electoral rolls for migration, duplication, or accessibility issues affecting turnout.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
            <div>
              <h5 className="text-slate-900 font-bold text-sm mb-1">Urban Low Turnout</h5>
              <p className="text-xs text-slate-600 leading-relaxed">Implement weekend voting, mobile polling stations, and digital awareness campaigns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

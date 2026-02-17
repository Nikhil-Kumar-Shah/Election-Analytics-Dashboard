/**
 * Election Analytics Dashboard - Prioritization Page
 * Copyright (c) 2026 Nikhil Kumar Shah
 * All rights reserved. Unauthorized copying or distribution is prohibited.
 */

import React, { useState, useMemo } from 'react';
import { ConstituencyData } from '../types';
import { AlertCircle, ArrowDown, ArrowUp, Minus, Download, ChevronDown, ChevronUp, Sliders } from 'lucide-react';

interface PrioritizationProps {
  data: ConstituencyData[];
}

export const Prioritization: React.FC<PrioritizationProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showScenario, setShowScenario] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  // Custom weights (default: 40/30/20/10)
  const [weights, setWeights] = useState({
    turnout: 40,
    trend: 30,
    volatility: 20,
    size: 10
  });

  // Normalize data for custom scoring
  const normalizedData = useMemo(() => {
    const turnouts = data.map(d => d.avg_turnout);
    const minTurnout = Math.min(...turnouts);
    const maxTurnout = Math.max(...turnouts);
    
    const changes = data.map(d => d.turnout_change);
    const minChange = Math.min(...changes);
    
    const volatilities = data.map(d => d.turnout_volatility);
    const maxVolatility = Math.max(...volatilities);
    
    const sizes = data.map(d => d.total_electors);
    const maxSize = Math.max(...sizes);
    
    return data.map(row => {
      // Low turnout factor (inverse, so low = bad)
      const turnoutFactor = 1 - ((row.avg_turnout - minTurnout) / (maxTurnout - minTurnout || 1));
      
      // Negative trend factor (negative change = bad)
      const trendFactor = row.turnout_change < 0 ? Math.abs(row.turnout_change) / Math.abs(minChange || 1) : 0;
      
      // High volatility factor
      const volatilityFactor = row.turnout_volatility / (maxVolatility || 1);
      
      // Large size factor
      const sizeFactor = row.total_electors / (maxSize || 1);
      
      // Custom priority score using user weights
      const customScore = (
        (turnoutFactor * weights.turnout / 100) +
        (trendFactor * weights.trend / 100) +
        (volatilityFactor * weights.volatility / 100) +
        (sizeFactor * weights.size / 100)
      );
      
      return {
        ...row,
        customScore,
        turnoutFactor,
        trendFactor,
        volatilityFactor,
        sizeFactor
      };
    });
  }, [data, weights]);
  
  // Sort by Custom Priority Score Descending
  const sortedData = [...normalizedData].sort((a, b) => b.customScore - a.customScore);
  
  // Filter by search (trim whitespace and search both constituency and state names)
  const filteredData = sortedData.filter(d => {
    const searchLower = searchTerm.toLowerCase().trim();
    return d.ac_name.toLowerCase().includes(searchLower) ||
           d.state_name.toLowerCase().includes(searchLower);
  });

  const getTrend = (change: number) => {
    if (change > 1) return 'rising';
    if (change < -1) return 'falling';
    return 'stable';
  };

  return (
    <div className="space-y-8">
      {/* Explanation Card */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <AlertCircle className="text-amber-400 w-6 h-6" />
            Priority Scoring Model
          </h3>
          <button 
            onClick={() => setShowScenario(!showScenario)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-white/20"
          >
            <Sliders size={14} />
            {showScenario ? 'Hide' : 'Adjust'} Weights
          </button>
        </div>
        <p className="text-slate-300 text-sm mb-8 max-w-4xl leading-relaxed opacity-90">
          The Priority Score (0-1 scale) identifies constituencies requiring intervention. 
          It's a weighted composite index combining low turnout, negative trends, high volatility, and large electorate challenges.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="block text-amber-400 font-bold text-2xl mb-1">{weights.turnout}%</span>
            <span className="text-slate-300 font-medium text-xs uppercase tracking-wide">Low Avg. Turnout</span>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="block text-amber-400 font-bold text-2xl mb-1">{weights.trend}%</span>
            <span className="text-slate-300 font-medium text-xs uppercase tracking-wide">Negative Trend</span>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="block text-amber-400 font-bold text-2xl mb-1">{weights.volatility}%</span>
            <span className="text-slate-300 font-medium text-xs uppercase tracking-wide">High Volatility</span>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="block text-amber-400 font-bold text-2xl mb-1">{weights.size}%</span>
            <span className="text-slate-300 font-medium text-xs uppercase tracking-wide">Electorate Size</span>
          </div>
        </div>

        {/* Scenario Weight Sliders */}
        {showScenario && (
          <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 mb-4">Scenario Analysis: Adjust Weights</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-300">Low Average Turnout</label>
                  <span className="text-xs font-bold text-amber-400">{weights.turnout}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.turnout}
                  onChange={(e) => setWeights({ ...weights, turnout: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-300">Negative Trend</label>
                  <span className="text-xs font-bold text-amber-400">{weights.trend}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.trend}
                  onChange={(e) => setWeights({ ...weights, trend: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-300">High Volatility</label>
                  <span className="text-xs font-bold text-amber-400">{weights.volatility}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.volatility}
                  onChange={(e) => setWeights({ ...weights, volatility: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-300">Large Electorate Size</label>
                  <span className="text-xs font-bold text-amber-400">{weights.size}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.size}
                  onChange={(e) => setWeights({ ...weights, size: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-400">
                Total: <span className={`font-bold ${weights.turnout + weights.trend + weights.volatility + weights.size !== 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {weights.turnout + weights.trend + weights.volatility + weights.size}%
                </span>
                {weights.turnout + weights.trend + weights.volatility + weights.size !== 100 && (
                  <span className="ml-2 text-red-400">(Weights should sum to 100%)</span>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-amber-400">Formula:</strong> Score = (Low Turnout Factor × {weights.turnout}%) + (Negative Trend × {weights.trend}%) + (Volatility × {weights.volatility}%) + (Size Penalty × {weights.size}%)
            <br/>
            <span className="text-slate-400 text-xs mt-2 block">Higher scores indicate higher urgency for targeted intervention programs.</span>
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
           <div>
             <h3 className="font-bold text-slate-800 text-xl">Ranked Constituencies</h3>
             <p className="text-sm text-slate-500 mt-1">Comprehensive priority list sorted by intervention need</p>
           </div>
           <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search constituency or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[250px]"
              />
              <a 
                href="https://docs.google.com/spreadsheets/d/1IzhMEtJtlEXw5iVmNXdtcpSJ6o5Yf_lsdoCi-N4hg88" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                 <Download size={16} />
                 View Source Data
              </a>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 font-semibold uppercase bg-slate-50/50 border-b border-slate-100 sticky top-0">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Constituency</th>
                <th className="px-6 py-4 text-right">Electors</th>
                <th className="px-6 py-4 text-right">Turnout</th>
                <th className="px-6 py-4 text-right">Avg Turnout</th>
                <th className="px-6 py-4 text-center">Trend</th>
                <th className="px-6 py-4 text-right">Volatility</th>
                <th className="px-6 py-4 text-right">Priority Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="text-slate-400">
                      <p className="text-lg font-semibold mb-1">No results found</p>
                      <p className="text-sm">Try searching with a different constituency or state name</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.slice(0, 100).map((row, index) => {
                const trend = getTrend(row.turnout_change);
                const isExpanded = expandedRow === index;
                return (
                  <React.Fragment key={`${row.state_name}-${row.ac_name}`}>
                    <tr className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 text-slate-400 font-mono font-medium">#{index + 1}</td>
                      <td className="px-6 py-4 text-slate-600 text-xs">{row.state_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{row.ac_name}</div>
                          {index === 0 && (
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : index)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Why is this ranked #1?"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600 font-medium">{(row.total_electors / 1000).toFixed(0)}k</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-bold px-2 py-1 rounded-md ${row.turnout < 50 ? 'bg-red-50 text-red-600' : 'text-slate-700'}`}>
                          {row.turnout.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-500">{row.avg_turnout.toFixed(1)}%</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          {trend === 'rising' && <div className="p-1 rounded bg-emerald-100 text-emerald-600"><ArrowUp className="w-3.5 h-3.5" /></div>}
                          {trend === 'falling' && <div className="p-1 rounded bg-red-100 text-red-600"><ArrowDown className="w-3.5 h-3.5" /></div>}
                          {trend === 'stable' && <div className="p-1 rounded bg-slate-100 text-slate-400"><Minus className="w-3.5 h-3.5" /></div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-500">{row.turnout_volatility.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-3">
                           <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                              <div 
                                className={`h-full rounded-full ${row.customScore > 0.30 ? 'bg-red-500' : row.customScore > 0.20 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                                style={{ width: `${Math.min(row.customScore * 100, 100)}%` }}
                              ></div>
                           </div>
                           <span className="font-bold text-slate-800 w-12 text-right">{row.customScore.toFixed(3)}</span>
                         </div>
                      </td>
                    </tr>
                    {/* Expandable Breakdown Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 bg-blue-50/50 border-l-4 border-blue-500">
                          <div className="space-y-3">
                            <h5 className="text-sm font-bold text-slate-800">Why is {row.ac_name} ranked #{index + 1}?</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-slate-500 mb-1">Low Turnout Factor</div>
                                <div className="font-bold text-lg text-slate-800">{(row.turnoutFactor * 100).toFixed(1)}%</div>
                                <div className="text-slate-400 mt-1">Weight: {weights.turnout}%</div>
                                <div className="text-blue-600 font-semibold mt-1">Contribution: {(row.turnoutFactor * weights.turnout).toFixed(2)}</div>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-slate-500 mb-1">Negative Trend Factor</div>
                                <div className="font-bold text-lg text-slate-800">{(row.trendFactor * 100).toFixed(1)}%</div>
                                <div className="text-slate-400 mt-1">Weight: {weights.trend}%</div>
                                <div className="text-blue-600 font-semibold mt-1">Contribution: {(row.trendFactor * weights.trend).toFixed(2)}</div>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-slate-500 mb-1">Volatility Factor</div>
                                <div className="font-bold text-lg text-slate-800">{(row.volatilityFactor * 100).toFixed(1)}%</div>
                                <div className="text-slate-400 mt-1">Weight: {weights.volatility}%</div>
                                <div className="text-blue-600 font-semibold mt-1">Contribution: {(row.volatilityFactor * weights.volatility).toFixed(2)}</div>
                              </div>
                              <div className="p-3 bg-white rounded-lg border border-slate-200">
                                <div className="text-slate-500 mb-1">Size Factor</div>
                                <div className="font-bold text-lg text-slate-800">{(row.sizeFactor * 100).toFixed(1)}%</div>
                                <div className="text-slate-400 mt-1">Weight: {weights.size}%</div>
                                <div className="text-blue-600 font-semibold mt-1">Contribution: {(row.sizeFactor * weights.size).toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="p-3 bg-white rounded-lg border border-blue-200 border-l-4">
                              <p className="text-xs text-slate-600 leading-relaxed">
                                <strong className="text-blue-600">Total Score Calculation:</strong> {(row.turnoutFactor * weights.turnout).toFixed(2)} + {(row.trendFactor * weights.trend).toFixed(2)} + {(row.volatilityFactor * weights.volatility).toFixed(2)} + {(row.sizeFactor * weights.size).toFixed(2)} = <strong className="text-slate-800">{row.customScore.toFixed(3)}</strong>
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
              )}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <p>No constituencies match your search criteria</p>
          </div>
        )}
        {filteredData.length > 100 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-sm text-slate-600">
            Showing top 100 of {filteredData.length} constituencies. Use search to filter or export full CSV.
          </div>
        )}
      </div>
    </div>
  );
};

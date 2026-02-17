/**
 * Election Analytics Dashboard - Drivers Analysis Page
 * Copyright (c) 2026 Nikhil Kumar Shah. All rights reserved.
 * Unauthorized reproduction or distribution prohibited.
 */

import React from 'react';
import { ConstituencyData } from '../types';
import { DriverScatterChart } from '../components/Charts';
import { AlertTriangle, Info, Lightbulb } from 'lucide-react';

interface DriversProps {
  data: ConstituencyData[];
}

export const Drivers: React.FC<DriversProps> = ({ data }) => {
  // Empty state check
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertTriangle className="text-slate-300 mb-4" size={64} />
        <h3 className="text-xl font-bold text-slate-700 mb-2">No Data Available</h3>
        <p className="text-slate-500 max-w-md">
          No constituencies match your current filter selection. Adjust filters to analyze turnout drivers.
        </p>
      </div>
    );
  }
  
  // Prepare scatter data with constituency names
  const scatterCandidates = data.map(d => ({ 
    x: d.num_candidates, 
    y: d.turnout, 
    z: d.total_electors / 1000,
    name: d.ac_name,
    state: d.state_name
  }));
  
  const scatterMargin = data.map(d => ({ 
    x: d.margin, 
    y: d.turnout, 
    z: d.total_electors / 1000,
    name: d.ac_name,
    state: d.state_name
  }));

  const scatterElectors = data.map(d => ({ 
    x: d.total_electors / 1000, 
    y: d.turnout, 
    z: d.num_candidates,
    name: d.ac_name,
    state: d.state_name
  }));

  // Calculate correlation coefficients (Pearson r)
  const calculateCorrelation = (dataPoints: any[], xKey: string, yKey: string) => {
    const n = dataPoints.length;
    if (n === 0) return 0;
    
    const sumX = dataPoints.reduce((sum, d) => sum + d[xKey], 0);
    const sumY = dataPoints.reduce((sum, d) => sum + d[yKey], 0);
    const sumXY = dataPoints.reduce((sum, d) => sum + d[xKey] * d[yKey], 0);
    const sumX2 = dataPoints.reduce((sum, d) => sum + d[xKey] * d[xKey], 0);
    const sumY2 = dataPoints.reduce((sum, d) => sum + d[yKey] * d[yKey], 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const corrCandidates = calculateCorrelation(scatterCandidates, 'x', 'y').toFixed(3);
  const corrMargin = calculateCorrelation(scatterMargin, 'x', 'y').toFixed(3);
  const corrElectors = calculateCorrelation(scatterElectors, 'x', 'y').toFixed(3);

  const getCorrelationStrength = (r: number) => {
    const abs = Math.abs(r);
    if (abs < 0.3) return 'weak';
    if (abs < 0.7) return 'moderate';
    return 'strong';
  };

  const getCorrelationDirection = (r: number) => {
    return r > 0 ? 'positive' : 'negative';
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-600 p-6 rounded-r-2xl shadow-sm">
        <h3 className="font-bold text-blue-900 text-lg">Understanding Turnout Drivers</h3>
        <p className="text-sm text-blue-800/80 mt-1 max-w-3xl">
          Explore relationships between voter turnout and key factors like electoral competition, constituency size, and victory margins. 
          These correlations help identify structural barriers and opportunities for intervention.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scatter 1: Candidates vs Turnout */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h4 className="font-bold text-slate-800 text-lg">Turnout vs. Number of Candidates</h4>
            <div className="group relative">
              <Info size={16} className="text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block w-72 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                <strong className="block mb-1">What this shows:</strong>
                Relationship between electoral competition (# candidates) and voter turnout.
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <strong className="block mb-1">Expected Pattern:</strong>
                  More candidates → higher mobilization → increased turnout (positive correlation).
                </div>
              </div>
            </div>
          </div>
          <DriverScatterChart 
            data={scatterCandidates} 
            xKey="x" 
            yKey="y" 
            zKey="z" 
            name="Turnout %"
            xLabel="Number of Candidates"
            yLabel="Turnout %"
          />
          <div className="mt-6 text-xs text-slate-500 border-t pt-4 border-slate-100 leading-relaxed">
            <strong className="text-slate-800">Observation:</strong> More candidates typically drive higher turnout due to increased mobilization, 
            though extreme fragmentation (20+ candidates) may dilute voter clarity.
            <br/><span className="italic text-slate-400 mt-1 block">Bubble Size: Electorate (thousands)</span>
          </div>
        </div>

        {/* Scatter 2: Margin vs Turnout */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h4 className="font-bold text-slate-800 text-lg">Turnout vs. Victory Margin</h4>
            <div className="group relative">
              <Info size={16} className="text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block w-72 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                <strong className="block mb-1">What this shows:</strong>
                Relationship between electoral competitiveness (margin between winner and runner-up) and voter turnout.
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <strong className="block mb-1">Expected Pattern:</strong>
                  Close races (low margin) → voters feel vote matters → higher turnout (negative correlation).
                </div>
              </div>
            </div>
          </div>
          <DriverScatterChart 
            data={scatterMargin} 
            xKey="x" 
            yKey="y" 
            zKey="z" 
            name="Turnout %"
            xLabel="Victory Margin (%)"
            yLabel="Turnout %"
          />
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-900">
              Pearson r = {corrMargin} ({getCorrelationStrength(parseFloat(corrMargin))} {getCorrelationDirection(parseFloat(corrMargin))} correlation)
            </p>
          </div>
          <div className="mt-4 text-xs text-slate-500 border-t pt-4 border-slate-100 leading-relaxed">
            <strong className="text-slate-800">Observation:</strong> Closer races (lower margins) often correlate with higher turnout as voters 
            perceive their vote as more impactful. Landslide victories may suppress participation.
            <br/><span className="italic text-slate-400 mt-1 block">Bubble Size: Electorate (thousands)</span>
          </div>
        </div>

        {/* Scatter 3: Electorate Size vs Turnout */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <h4 className="font-bold text-slate-800 text-lg">Turnout vs. Total Electors</h4>
            <div className="group relative">
              <Info size={16} className="text-slate-400 cursor-help" />
              <div className="absolute left-0 top-6 hidden group-hover:block w-72 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl z-50">
                <strong className="block mb-1">What this shows:</strong>
                Relationship between constituency size (total registered voters) and turnout percentage.
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <strong className="block mb-1">Expected Pattern:</strong>
                  Larger electorates (urban) → logistical challenges → lower turnout (negative correlation).
                </div>
              </div>
            </div>
          </div>
          <DriverScatterChart 
            data={scatterElectors} 
            xKey="x" 
            yKey="y" 
            zKey="z" 
            name="Turnout %"
            xLabel="Total Electors (thousands)"
            yLabel="Turnout %"
          />
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-bold text-blue-900">
              Pearson r = {corrElectors} ({getCorrelationStrength(parseFloat(corrElectors))} {getCorrelationDirection(parseFloat(corrElectors))} correlation)
            </p>
          </div>
          <div className="mt-4 text-xs text-slate-500 border-t pt-4 border-slate-100 leading-relaxed">
            <strong className="text-slate-800">Observation:</strong> Large electorates (urban centers) often demonstrate lower turnout, 
            suggesting logistical challenges or urban apathy. Smaller constituencies tend to exhibit higher participation rates.
            <br/><span className="italic text-slate-400 mt-1 block">Bubble Size: Number of Candidates</span>
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="text-amber-400" size={24} />
          Key Takeaways & Decision Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <div className="font-bold text-amber-400 mb-2">📊 Competition Matters</div>
            <p className="text-slate-300 mb-3">More candidates and closer margins generally correlate with higher engagement, though correlation ≠ causation.</p>
            <p className="text-xs text-amber-200 italic">Implication: Competitive contests drive participation. Strengthen multi-party engagement.</p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <div className="font-bold text-amber-400 mb-2">🏙️ Scale Challenges</div>
            <p className="text-slate-300 mb-3">Larger constituencies (urban centers) face systematic participation barriers - infrastructure and awareness must scale accordingly.</p>
            <p className="text-xs text-amber-200 italic">Implication: Urban low turnout requires infrastructure upgrades (weekend voting, mobile booths).</p>
          </div>
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <div className="font-bold text-amber-400 mb-2">⚠️ Context Required</div>
            <p className="text-slate-300 mb-3">External factors (demographics, weather, local events, socioeconomic conditions) not captured here also significantly influence turnout.</p>
            <p className="text-xs text-amber-200 italic">Implication: These correlations guide, but not replace, field-level investigation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

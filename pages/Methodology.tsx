/**
 * Election Analytics Dashboard - Methodology Documentation Page
 * Copyright (c) 2026 Nikhil Kumar Shah. All rights reserved.
 * Unauthorized reproduction or distribution prohibited.
 */

import React from 'react';
import { Database, BarChart3, Calculator, AlertCircle, Code, ShieldAlert } from 'lucide-react';

export const Methodology: React.FC = () => {
  return (
    <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Methodology & Data Sources</h2>
      <p className="text-slate-600 mb-10 leading-relaxed">
        A comprehensive technical overview of data collection, processing, feature engineering, and the priority scoring algorithm powering this dashboard.
      </p>
      
      <div className="space-y-10">
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Database className="text-blue-600" size={20} />
            <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
            Data Source & Collection
          </h3>
          <div className="pl-8 space-y-3 text-slate-600 leading-relaxed">
            <p>
              This dashboard utilizes the <code className="bg-slate-100 px-2 py-0.5 rounded text-sm font-mono">constituency_level.csv</code> dataset, 
              which aggregates election data at the constituency level across multiple election cycles.
            </p>
            <p>
              <strong className="text-slate-800">Data Coverage:</strong> General Elections from 2009, 2012, 2014, 2019, and 2021.
            </p>
            <p>
              <strong className="text-slate-800">Data Cleaning:</strong> Missing values were handled by excluding incomplete records. 
              Constituencies with data for fewer than 2 election cycles were excluded from trend calculations to ensure longitudinal accuracy.
            </p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-900">
                <strong>Total Records:</strong> 10,514+ constituency-year observations
                <br/><strong>States Covered:</strong> All Indian states and union territories with assembly elections
              </p>
            </div>
            
            {/* Visual Pipeline Diagram */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-300 rounded-xl p-6 mt-6">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Code className="text-purple-600" size={16} />
                Reproducible Data Pipeline
              </h4>
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 text-white px-4 py-3 rounded-lg font-bold shadow-md">
                    Raw CSV
                  </div>
                  <span className="text-slate-500 mt-1 text-[10px]">10,514 records</span>
                </div>
                <div className="text-slate-400 text-2xl">→</div>
                <div className="flex flex-col items-center">
                  <div className="bg-emerald-500 text-white px-4 py-3 rounded-lg font-bold shadow-md">
                    Data Cleaning
                  </div>
                  <span className="text-slate-500 mt-1 text-[10px]">Remove nulls</span>
                </div>
                <div className="text-slate-400 text-2xl">→</div>
                <div className="flex flex-col items-center">
                  <div className="bg-amber-500 text-white px-4 py-3 rounded-lg font-bold shadow-md">
                    Aggregation
                  </div>
                  <span className="text-slate-500 mt-1 text-[10px]">Group by year</span>
                </div>
                <div className="text-slate-400 text-2xl">→</div>
                <div className="flex flex-col items-center">
                  <div className="bg-purple-500 text-white px-4 py-3 rounded-lg font-bold shadow-md">
                    Feature Eng.
                  </div>
                  <span className="text-slate-500 mt-1 text-[10px]">Calc volatility</span>
                </div>
                <div className="text-slate-400 text-2xl">→</div>
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 text-white px-4 py-3 rounded-lg font-bold shadow-md">
                    Priority Score
                  </div>
                  <span className="text-slate-500 mt-1 text-[10px]">40/30/20/10</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-300 text-slate-600 text-xs leading-relaxed">
                <strong className="text-slate-800">Tools:</strong> Data processing in TypeScript (dataService.ts), 
                visualization using React + Recharts, deployed to Vercel for public access. 
                All calculations are deterministic and can be independently verified.
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <BarChart3 className="text-green-600" size={20} />
            <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
            Key Metrics & Definitions
          </h3>
          <ul className="pl-8 space-y-4 text-slate-600">
            <li className="pl-4 border-l-2 border-slate-200">
              <strong className="text-slate-800 block mb-1">Turnout %</strong> 
              Total valid votes cast divided by Total Registered Electors × 100. This represents voter participation rate.
            </li>
            <li className="pl-4 border-l-2 border-slate-200">
              <strong className="text-slate-800 block mb-1">Turnout Change</strong> 
              Year-over-year difference in turnout percentage. Negative values indicate declining participation.
            </li>
            <li className="pl-4 border-l-2 border-slate-200">
              <strong className="text-slate-800 block mb-1">Average Turnout</strong> 
              Mean turnout across all available election cycles for a constituency. Used to identify persistent low-turnout areas.
            </li>
            <li className="pl-4 border-l-2 border-slate-200">
              <strong className="text-slate-800 block mb-1">Turnout Volatility (σ)</strong> 
              Standard deviation of turnout across election cycles. High values indicate unstable/unpredictable voter engagement.
            </li>
            <li className="pl-4 border-l-2 border-slate-200">
              <strong className="text-slate-800 block mb-1">Margin</strong> 
              Difference in vote percentage between winner and runner-up. Lower margins suggest competitive races.
            </li>
            <li className="pl-4 border-l-2 border-slate-200">
              <strong className="text-slate-800 block mb-1">Number of Candidates</strong> 
              Total candidates contesting. More candidates may correlate with higher mobilization but also voter confusion.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
             <Calculator className="text-amber-600" size={20} />
             <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded flex items-center justify-center text-xs">3</span>
             Priority Scoring Algorithm
          </h3>
          <div className="pl-8 space-y-4 text-slate-600">
            <p>
              The <strong className="text-slate-800">Priority Score</strong> is a composite index (0-1 scale, displayed as 0-100% for clarity) 
              designed to rank constituencies by intervention urgency. Higher scores indicate higher priority.
            </p>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-sm text-slate-700 shadow-inner">
              <div className="mb-4 not-italic font-sans font-bold text-slate-800">Formula:</div>
              Priority Score = (Low_Turnout_Factor × 0.4) + (Negative_Trend_Factor × 0.3) + (Volatility_Factor × 0.2) + (Size_Penalty × 0.1)
            </div>

            <div className="space-y-3 mt-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <strong className="text-slate-800 block mb-1">Component 1: Low Turnout Score (40% weight)</strong>
                <p className="text-sm">Normalized from average turnout. Lower turnout = higher score. Captures persistent participation gaps.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <strong className="text-slate-800 block mb-1">Component 2: Negative Trend Score (30% weight)</strong>
                <p className="text-sm">Based on year-over-year turnout change. Declining turnout increases score. Identifies deteriorating engagement.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <strong className="text-slate-800 block mb-1">Component 3: Volatility Score (20% weight)</strong>
                <p className="text-sm">From standard deviation of turnout. High volatility = unpredictable engagement = higher risk score.</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <strong className="text-slate-800 block mb-1">Component 4: Large Electorate Penalty (10% weight)</strong>
                <p className="text-sm">Normalized by constituency size. Larger electorates with low turnout get higher priority due to impact scale.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
              <p className="text-sm text-amber-900">
                <strong>Example:</strong> A constituency with 45% avg turnout (low), -5% recent change (declining), 
                σ=8 (high volatility), and 250k electors would receive a high priority score (~0.40-0.50), 
                signaling urgent need for intervention.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded flex items-center justify-center text-xs">4</span>
            Limitations & Assumptions
          </h3>
          <ul className="pl-8 space-y-2 text-slate-600 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Correlation ≠ Causation:</strong> Relationships shown in "Drivers" are correlational. External factors not captured in data may be causal.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Data Quality:</strong> Accuracy depends on source data integrity. Errors in electoral rolls or vote counting propagate through analysis.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Missing Variables:</strong> Demographics (age, gender, income), weather on polling day, local boycotts, and infrastructure quality are not included.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Temporal Scope:</strong> Analysis limited to available election cycles. Long-term trends (10+ years) may reveal different patterns.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Priority Score Subjectivity:</strong> Weights (40/30/20/10) are design choices based on domain knowledge. Alternative weighting may yield different prioritization.</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Code className="text-purple-600" size={20} />
            <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded flex items-center justify-center text-xs">5</span>
            Reproducibility & Transparency
          </h3>
          <div className="pl-8 space-y-3 text-slate-600 text-sm leading-relaxed">
            <p>
              This dashboard is built on open-source principles to ensure transparency and reproducibility:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong className="text-slate-800">Dataset:</strong> <code className="bg-slate-100 px-2 py-0.5 rounded font-mono">constituency_level.csv</code> is available for download and independent verification</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong className="text-slate-800">Code:</strong> All data processing, normalization, and priority score calculations use deterministic algorithms (no black-box models)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong className="text-slate-800">Methodology:</strong> The 40/30/20/10 weighting scheme is explicitly documented and can be adjusted via the Prioritization page sliders</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong className="text-slate-800">Versioning:</strong> Last updated February 2026. Updates to data or methodology will be versioned and tracked</span>
              </li>
            </ul>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-4">
              <p className="text-sm text-purple-900">
                <strong>Verification:</strong> Election authorities and researchers can reproduce priority scores independently using the documented formula. 
                Any discrepancies should be reported for timely correction.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <ShieldAlert className="text-red-600" size={20} />
            <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded flex items-center justify-center text-xs">6</span>
            Ethical Use & Responsible Interpretation
          </h3>
          <div className="pl-8 space-y-3 text-slate-600 text-sm leading-relaxed">
            <p className="text-slate-800 font-semibold">
              This dashboard is intended for election administration planning and civic engagement research. All usage should adhere to the following ethical principles:
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">⚠</span>
                  <span><strong className="text-red-800">Non-Partisan Use:</strong> Priority scores must not be used for partisan advantage, voter suppression, or discriminatory targeting.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">⚠</span>
                  <span><strong className="text-red-800">Context Required:</strong> Low turnout alone does not imply voter apathy or voter incompetence and must not be used to justify disenfranchisement.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">⚠</span>
                  <span><strong className="text-red-800">Privacy Protection:</strong> No individual-level voter data is included. All metrics are aggregated to preserve anonymity and privacy.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600 font-bold">⚠</span>
                  <span><strong className="text-red-800">Fair Resource Allocation:</strong> Interventions should aim to enhance democratic participation equitably and must not reinforce existing inequalities.</span>
                </li>
              </ul>
            </div>
            <p className="mt-4 text-slate-700 italic">
              <strong>Recommended Use Cases:</strong> Identifying constituencies for voter education campaigns, polling booth infrastructure upgrades, 
              electoral roll verification, and accessibility improvements. This tool is designed to support the Election Commission of India's mandate to strengthen inclusive democratic participation.
            </p>
          </div>
        </section>

        <section className="border-t pt-8 mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-3">Future Enhancements</h3>
          <p className="pl-8 text-slate-600 text-sm leading-relaxed">
            Future iterations could incorporate demographic overlays (e.g., census data), infrastructure metrics (polling station density), 
            weather conditions, and machine learning models for predictive turnout forecasting. Integration with real-time data feeds could 
            enable dynamic dashboards for election-day monitoring and rapid response.
          </p>
        </section>
      </div>
    </div>
  );
};

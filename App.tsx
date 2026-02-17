/**
 * Election Analytics Dashboard - Main Application Component
 * Copyright (c) 2026 Nikhil Kumar Shah
 * All rights reserved. Unauthorized copying or distribution is prohibited.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { View, FilterState } from './types';
import { getFilteredData, getUniqueYears, waitForData, isDataLoaded } from './services/dataService';

// Pages
import { Overview } from './pages/Overview';
import { Trends } from './pages/Trends';
import { Drivers } from './pages/Drivers';
import { Prioritization } from './pages/Prioritization';
import { ForwardLooking } from './pages/ForwardLooking';
import { Methodology } from './pages/Methodology';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.OVERVIEW);
  const [dataReady, setDataReady] = useState(false);
  
  // Scroll to top when view changes
  const handleNavigate = (view: View) => {
    setCurrentView(view);
    // Scroll the main content area to top
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Wait for data to load
  useEffect(() => {
    const loadInitialData = async () => {
      await waitForData();
      setDataReady(true);
    };
    loadInitialData();
  }, []);
  
  // Default Filters - only set after data is loaded
  const [filters, setFilters] = useState<FilterState>({
    states: [],
    constituencies: [],
    year: 2024
  });
  
  // Update year filter once data is loaded
  useEffect(() => {
    if (dataReady) {
      const years = getUniqueYears();
      if (years.length > 0 && filters.year !== years[0]) {
        setFilters(prev => ({ ...prev, year: years[0] }));
      }
    }
  }, [dataReady]);

  // Data fetching based on filters
  const filteredData = useMemo(() => {
    return getFilteredData(filters.states, filters.constituencies, filters.year);
  }, [filters.states, filters.constituencies, filters.year]);

  const renderContent = () => {
    if (!dataReady) {
      return (
        <div className="space-y-6 animate-pulse">
          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-slate-300 rounded w-20"></div>
                  </div>
                  <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-32"></div>
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="h-6 bg-slate-300 rounded w-48 mb-6"></div>
            <div className="h-80 bg-slate-100 rounded"></div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="h-6 bg-slate-300 rounded w-64 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="grid grid-cols-4 gap-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case View.OVERVIEW:
        return <Overview data={filteredData} filters={filters} />;
      case View.TRENDS:
        return <Trends data={filteredData} filters={filters} />;
      case View.DRIVERS:
        return <Drivers data={filteredData} />;
      case View.PRIORITIZATION:
        return <Prioritization data={filteredData} />;
      case View.FORWARD_LOOKING:
        return <ForwardLooking data={filteredData} />;
      case View.METHODOLOGY:
        return <Methodology />;
      default:
        return <Overview data={filteredData} filters={filters} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={handleNavigate}
      filters={filters}
      onFilterChange={setFilters}
      dataReady={dataReady}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;

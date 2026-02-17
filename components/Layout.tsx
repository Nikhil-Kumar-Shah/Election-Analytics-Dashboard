/**
 * Election Analytics Dashboard - Layout Component
 * Copyright (c) 2026 Nikhil Kumar Shah
 * All rights reserved. Unauthorized copying or distribution is prohibited.
 */

import React, { useState, useEffect } from 'react';
import { View, FilterState } from '../types';
import { getUniqueStates, getUniqueConstituencies, getUniqueYears } from '../services/dataService';
import { LayoutDashboard, TrendingUp, Anchor, AlertCircle, Telescope, BookOpen, Menu, X, Filter, ChevronDown, Info, Search, Smartphone } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  dataReady: boolean;
}

const NAV_ITEMS = [
  { view: View.OVERVIEW, icon: LayoutDashboard, label: 'Overview' },
  { view: View.TRENDS, icon: TrendingUp, label: 'Trends' },
  { view: View.DRIVERS, icon: Anchor, label: 'Drivers' },
  { view: View.PRIORITIZATION, icon: AlertCircle, label: 'Prioritization' },
  { view: View.FORWARD_LOOKING, icon: Telescope, label: 'Forward-Looking' },
  { view: View.METHODOLOGY, icon: BookOpen, label: 'Methodology' },
];

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, filters, onFilterChange, dataReady }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showStateFilter, setShowStateFilter] = useState(false);
  const [showConstituencyFilter, setShowConstituencyFilter] = useState(false);
  const [showYearFilter, setShowYearFilter] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [showMobileWarningInfo, setShowMobileWarningInfo] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [constituencySearch, setConstituencySearch] = useState('');
  
  const [allStates, setAllStates] = useState<string[]>([]);
  const [availableConstituencies, setAvailableConstituencies] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  // Update filter options when data is ready
  useEffect(() => {
    if (dataReady) {
      setAllStates(getUniqueStates());
      setYears(getUniqueYears());
    }
  }, [dataReady]);

  // Update constituencies when states filter changes
  useEffect(() => {
    if (dataReady) {
      setAvailableConstituencies(getUniqueConstituencies(filters.states));
    }
  }, [filters.states, dataReady]);

  // Filter states by search
  const filteredStates = allStates.filter(state => 
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // Filter constituencies by search
  const filteredConstituencies = availableConstituencies.filter(constituency => 
    constituency.toLowerCase().includes(constituencySearch.toLowerCase())
  );

  const toggleState = (state: string) => {
    const newStates = filters.states.includes(state)
      ? filters.states.filter(s => s !== state)
      : [...filters.states, state];
    
    // Reset constituencies if states change
    const newConstituencies = newStates.length === 0 
      ? [] 
      : filters.constituencies.filter(c => {
          const newAvailable = getUniqueConstituencies(newStates);
          return newAvailable.includes(c);
        });
    
    onFilterChange({ ...filters, states: newStates, constituencies: newConstituencies });
  };

  const toggleConstituency = (constituency: string) => {
    const newConstituencies = filters.constituencies.includes(constituency)
      ? filters.constituencies.filter(c => c !== constituency)
      : [...filters.constituencies, constituency];
    onFilterChange({ ...filters, constituencies: newConstituencies });
  };

  // Close other dropdowns when one opens
  useEffect(() => {
    if (showStateFilter) {
      setShowConstituencyFilter(false);
      setShowYearFilter(false);
    }
  }, [showStateFilter]);

  useEffect(() => {
    if (showConstituencyFilter) {
      setShowStateFilter(false);
      setShowYearFilter(false);
    }
  }, [showConstituencyFilter]);

  useEffect(() => {
    if (showYearFilter) {
      setShowStateFilter(false);
      setShowConstituencyFilter(false);
    }
  }, [showYearFilter]);

  // Detect mobile screen and show warning only once per session
  useEffect(() => {
    const hasShownWarning = sessionStorage.getItem('mobileWarningShown') === 'true';
    
    if (!hasShownWarning) {
      const checkMobile = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setShowMobileWarning(true);
          // Mark as shown immediately to prevent re-showing on navigation
          sessionStorage.setItem('mobileWarningShown', 'true');
        }
      };
      
      // Check on initial load
      checkMobile();
      
      // Listen for window resize (for DevTools responsive mode)
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
  }, []);

  const handleCloseMobileWarning = () => {
    setShowMobileWarning(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-slate-900 text-lg tracking-tight">Election Analytics</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 hover:text-slate-900 transition-colors">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block flex-shrink-0 border-r border-slate-800 shadow-xl
      `}>
        <div className="p-6 border-b border-slate-800/50 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-white font-bold text-lg tracking-tight">Election Analytics</h1>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Dashboard</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1 mt-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              onClick={() => { onNavigate(item.view); setMobileMenuOpen(false); }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${currentView === item.view 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                  : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'}
              `}
            >
              <item.icon size={20} className={`${currentView === item.view ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Sidebar Footer Info */}
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800/50 bg-slate-900">
          <div className="text-xs text-slate-500 font-medium">
            <p className="text-slate-600">© 2026 Election Commission</p>
            <p className="text-slate-700 mt-1">Data-Driven Governance</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Sticky Header with Filters */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 px-6 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{currentView}</h2>
            <p className="text-sm text-slate-500 hidden md:block mt-0.5 font-medium">Reimagining Elections Through Data: Participation, Risk, and Prioritization</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
             {/* State Filter */}
             <div className="relative" data-dropdown>
               <button 
                 onClick={(e) => { e.stopPropagation(); setShowStateFilter(!showStateFilter); }}
                 className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-4 py-2.5 shadow-sm hover:border-slate-400 hover:shadow"
                 disabled={!dataReady}
               >
                 <Filter size={16} className="text-slate-600" />
                 <span className="text-xs font-medium text-slate-500">State:</span>
                 <span className="text-sm font-semibold text-slate-900">
                   {filters.states.length === 0 ? 'All' : `${filters.states.length}`}
                 </span>
                 <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showStateFilter ? 'rotate-180' : ''}`} />
               </button>
               
               {showStateFilter && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => { setShowStateFilter(false); setStateSearch(''); }}></div>
                   <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-300 rounded-lg shadow-xl z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                     {/* Search Box */}
                     <div className="p-3 border-b border-slate-200 bg-slate-50">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input
                           type="text"
                           placeholder="Search states..."
                           value={stateSearch}
                           onChange={(e) => setStateSearch(e.target.value)}
                           className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           onClick={(e) => e.stopPropagation()}
                         />
                       </div>
                     </div>
                     
                     {/* Clear All Button */}
                     <div className="p-2 border-b border-slate-100">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           onFilterChange({ ...filters, states: [], constituencies: [] });
                           setStateSearch('');
                         }}
                         className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 font-medium text-slate-700 transition-colors"
                       >
                         ✕ Clear All
                       </button>
                     </div>
                     
                     {/* State List */}
                     <div className="max-h-80 overflow-y-auto">
                       <div className="p-2 space-y-0.5">
                         {filteredStates.length > 0 ? (
                           <>
                             {filteredStates.slice(0, 100).map(state => (
                               <label 
                                 key={state} 
                                 className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors"
                                 onClick={(e) => e.stopPropagation()}
                               >
                                 <input
                                   type="checkbox"
                                   checked={filters.states.includes(state)}
                                   onChange={() => toggleState(state)}
                                   className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                   onClick={(e) => e.stopPropagation()}
                                 />
                                 <span className="text-sm text-slate-700 font-medium">{state}</span>
                               </label>
                             ))}
                             {filteredStates.length > 100 && (
                               <div className="px-3 py-3 text-center text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg mx-2 mt-2">
                                 <p className="font-semibold text-amber-700">Showing first 100 of {filteredStates.length} states</p>
                                 <p className="mt-1">Use the search box above to find specific states</p>
                               </div>
                             )}
                           </>
                         ) : (
                           <div className="px-3 py-8 text-center text-slate-500 text-sm">
                             No states found
                           </div>
                         )}
                       </div>
                     </div>
                     
                     {/* Footer Info */}
                     <div className="p-3 border-t border-slate-200 bg-slate-50">
                       <p className="text-xs text-slate-600">
                         <strong>{filters.states.length}</strong> of <strong>{allStates.length}</strong> selected
                       </p>
                     </div>
                   </div>
                 </>
               )}
             </div>

             {/* Constituency Filter */}
             <div className="relative" data-dropdown>
               <button
                 onClick={(e) => { e.stopPropagation(); setShowConstituencyFilter(!showConstituencyFilter); }}
                 className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-4 py-2.5 shadow-sm hover:border-slate-400 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                 disabled={availableConstituencies.length === 0 || !dataReady}
               >
                 <Filter size={16} className="text-slate-600" />
                 <span className="text-xs font-medium text-slate-500">Constituency:</span>
                 <span className="text-sm font-semibold text-slate-900">
                   {filters.constituencies.length === 0 ? 'All' : `${filters.constituencies.length}`}
                 </span>
                 <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showConstituencyFilter ? 'rotate-180' : ''}`} />
               </button>
               
               {showConstituencyFilter && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => { setShowConstituencyFilter(false); setConstituencySearch(''); }}></div>
                   <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-300 rounded-lg shadow-xl z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                     {/* Search Box */}
                     <div className="p-3 border-b border-slate-200 bg-slate-50">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                         <input
                           type="text"
                           placeholder="Search constituencies..."
                           value={constituencySearch}
                           onChange={(e) => setConstituencySearch(e.target.value)}
                           className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           onClick={(e) => e.stopPropagation()}
                         />
                       </div>
                     </div>
                     
                     {/* Clear All Button */}
                     <div className="p-2 border-b border-slate-100">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           onFilterChange({ ...filters, constituencies: [] });
                           setConstituencySearch('');
                         }}
                         className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 font-medium text-slate-700 transition-colors"
                       >
                         ✕ Clear All
                       </button>
                     </div>
                     
                     {/* Constituency List */}
                     <div className="max-h-80 overflow-y-auto">
                       <div className="p-2 space-y-0.5">
                         {filteredConstituencies.length > 0 ? (
                           <>
                             {filteredConstituencies.slice(0, 150).map(constituency => (
                               <label 
                                 key={constituency} 
                                 className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors"
                                 onClick={(e) => e.stopPropagation()}
                               >
                                 <input
                                   type="checkbox"
                                   checked={filters.constituencies.includes(constituency)}
                                   onChange={() => toggleConstituency(constituency)}
                                   className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                   onClick={(e) => e.stopPropagation()}
                                 />
                                 <span className="text-sm text-slate-700 font-medium">{constituency}</span>
                               </label>
                             ))}
                             {filteredConstituencies.length > 150 && (
                               <div className="px-3 py-3 text-center text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg mx-2 mt-2">
                                 <p className="font-semibold text-amber-700">Showing first 150 of {filteredConstituencies.length} constituencies</p>
                                 <p className="mt-1">Use the search box above to find specific constituencies</p>
                               </div>
                             )}
                           </>
                         ) : (
                           <div className="px-3 py-8 text-center text-slate-500 text-sm">
                             {constituencySearch ? 'No constituencies found' : 'No constituencies available'}
                           </div>
                         )}
                       </div>
                     </div>
                     
                     {/* Footer Info */}
                     <div className="p-3 border-t border-slate-200 bg-slate-50">
                       <p className="text-xs text-slate-600">
                         <strong>{filters.constituencies.length}</strong> of <strong>{availableConstituencies.length}</strong> selected
                       </p>
                     </div>
                   </div>
                 </>
               )}
             </div>

             {/* Year Filter */}
             <div className="relative" data-dropdown>
               <button
                 onClick={(e) => { e.stopPropagation(); setShowYearFilter(!showYearFilter); }}
                 className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-4 py-2.5 shadow-sm hover:border-slate-400 hover:shadow"
                 disabled={!dataReady || years.length === 0}
               >
                 <Filter size={16} className="text-slate-600" />
                 <span className="text-xs font-medium text-slate-500">Year:</span>
                 <span className="text-sm font-semibold text-slate-900">
                   {filters.year}
                 </span>
                 <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showYearFilter ? 'rotate-180' : ''}`} />
               </button>
               
               {showYearFilter && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setShowYearFilter(false)}></div>
                   <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-300 rounded-lg shadow-xl z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                     {/* Year List */}
                     <div className="max-h-80 overflow-y-auto">
                       <div className="p-2 space-y-0.5">
                         {years.map(year => (
                           <button
                             key={year}
                             onClick={(e) => {
                               e.stopPropagation();
                               onFilterChange({ ...filters, year });
                               setShowYearFilter(false);
                             }}
                             className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                               filters.year === year
                                 ? 'bg-blue-100 text-blue-700 font-semibold'
                                 : 'hover:bg-slate-50 text-slate-700 font-medium'
                             }`}
                           >
                             {year}
                           </button>
                         ))}
                       </div>
                     </div>
                     
                     {/* Footer Info */}
                     <div className="p-3 border-t border-slate-200 bg-slate-50">
                       <p className="text-xs text-slate-600">
                         <strong>{years.length}</strong> years available
                       </p>
                     </div>
                   </div>
                 </>
               )}
             </div>

             {/* About Button */}
             <button
               onClick={() => setShowAboutModal(true)}
               className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg p-2.5 shadow-sm hover:shadow"
               title="About Dashboard"
             >
               <Info size={18} />
             </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 md:px-10 scroll-smooth" id="main-content">
           <div className="max-w-7xl mx-auto space-y-8 pb-4">
             {children}
           </div>
           
           {/* Footer */}
           <footer className="max-w-7xl mx-auto mt-16 pt-12 pb-8 border-t border-slate-200 bg-gradient-to-b from-transparent to-slate-50/50">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm mb-8">
               <div className="md:col-span-2">
                 <h4 className="font-bold text-slate-900 mb-3 text-base">Election Participation Analytics</h4>
                 <p className="text-xs leading-relaxed text-slate-600">Data-driven decision support for electoral intervention and engagement strategy. Empowering democratic institutions through evidence-based insights.</p>
               </div>
               
               <div>
                 <h4 className="font-bold text-slate-900 mb-3">Data Source</h4>
                 <p className="text-xs text-slate-600 mb-2">Constituency-level election data</p>
                 <p className="text-xs text-slate-500 mb-3">10,514+ observations (2009-2021)</p>
                 <a 
                   href="https://docs.google.com/spreadsheets/d/1IzhMEtJtlEXw5iVmNXdtcpSJ6o5Yf_lsdoCi-N4hg88" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                 >
                   <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                   </svg>
                   View Source Dataset
                 </a>
               </div>
               
               <div>
                 <h4 className="font-bold text-slate-900 mb-3">Project Info</h4>
                 <p className="text-xs text-slate-600 mb-1">Author: Nikhil Kumar Shah</p>
                 <p className="text-xs text-slate-500">Updated: February 2026</p>
               </div>
             </div>
             
             <div className="pt-6 border-t border-slate-200">
               <div className="flex justify-center items-center">
                 <p className="text-xs text-slate-500">© 2026 Election Analytics Dashboard. Built for evidence-based governance.</p>
               </div>
             </div>
           </footer>
        </div>
      </main>

      {/* About Modal */}
      {showAboutModal && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAboutModal(false)}>
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div className="bg-slate-800 p-6 relative rounded-t-xl flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAboutModal(false);
                  }}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full p-1.5"
                >
                  <X size={20} />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2.5 rounded-lg">
                    <Info className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">About Dashboard</h2>
                    <p className="text-slate-300 text-xs mt-0.5">Election Participation Analytics</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded flex items-center justify-center text-xs">1</span>
                      Purpose
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed pl-7">
                      Identify constituencies requiring targeted intervention by analyzing voter turnout trends, volatility patterns, and demographic scale across multiple election cycles.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded flex items-center justify-center text-xs">2</span>
                      Key Decisions
                    </h3>
                    <ul className="text-sm text-slate-600 pl-7 space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Resource allocation for voter education</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Polling booth infrastructure planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Early warning for declining engagement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Priority ranking for interventions</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded flex items-center justify-center text-xs">3</span>
                      Data Source
                    </h3>
                    <p className="text-sm text-slate-600 pl-7">
                      <strong>10,514+</strong> observations from Indian assembly elections (2009-2024) including turnout rates, candidate counts, victory margins, and computed risk metrics.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded flex items-center justify-center text-xs">4</span>
                      Priority Score
                    </h3>
                    <p className="text-xs text-slate-600 pl-7 mb-3">
                      Composite index (0-1) ranking intervention urgency:
                    </p>
                    <div className="pl-7 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 w-12">40%</span>
                        <span className="text-slate-600">Low average turnout</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 w-12">30%</span>
                        <span className="text-slate-600">Negative trend</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 w-12">20%</span>
                        <span className="text-slate-600">High volatility</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 w-12">10%</span>
                        <span className="text-slate-600">Large electorate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAboutModal(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Warning Modal */}
      {showMobileWarning && (
        <>
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 relative rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
                    <Smartphone className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Mobile Device Detected</h2>
                  </div>
                </div>
                <button
                  onClick={handleCloseMobileWarning}
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900 font-semibold mb-2">
                      ⚠️ Best Viewed on Desktop or Laptop
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      For the best experience with the <strong>Election Analytics Dashboard</strong>, we highly recommend opening this application on a laptop or desktop computer.
                    </p>
                  </div>

                  {showMobileWarningInfo && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 animate-fadeIn">
                      <h3 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-2">
                        <Info size={16} className="text-blue-600" />
                        Why This Warning?
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        This dashboard was designed specifically for larger screens to display complex data visualizations, interactive charts, and detailed tables. Mobile screens may not provide optimal visual clarity for:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Multi-column data tables with extensive information</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Interactive charts and scatter plots</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Filter controls and navigation elements</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setShowMobileWarningInfo(!showMobileWarningInfo)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Info size={16} />
                    {showMobileWarningInfo ? 'Hide Details' : 'Why this warning?'}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex-shrink-0 space-y-2">
                <button
                  onClick={handleCloseMobileWarning}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  I Understand, Continue Anyway
                </button>
                <p className="text-xs text-center text-slate-500">
                  This warning won't appear again in this session
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

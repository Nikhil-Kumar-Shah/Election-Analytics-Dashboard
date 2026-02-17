/**
 * Election Analytics Dashboard - Data Service
 * Copyright (c) 2026 Nikhil Kumar Shah
 * All rights reserved. Unauthorized copying or distribution is prohibited.
 */

import { ConstituencyData } from '../types';

// Load CSV data
let RAW_DATA: ConstituencyData[] = [];
let dataLoaded = false;
let loadingPromise: Promise<void> | null = null;

// Create a data cache for better performance
const dataCache = new Map<string, ConstituencyData[]>();

// Parse CSV - optimized
const parseCSV = (text: string): ConstituencyData[] => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data: ConstituencyData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const obj: any = {};
    
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      const value = values[j];
      
      // Convert to appropriate types
      if (key === 'year' || key === 'total_electors' || key === 'total_valid_votes' || key === 'num_candidates') {
        obj[key] = parseInt(value) || 0;
      } else if (key === 'turnout' || key === 'margin' || key === 'winner_vote_share' || 
                 key === 'turnout_change' || key === 'avg_turnout' || key === 'turnout_volatility' ||
                 key === 'low_turnout_score' || key === 'negative_trend_score' || key === 'volatility_score' ||
                 key === 'large_electorate_penalty' || key === 'priority_score') {
        obj[key] = parseFloat(value) || 0;
      } else {
        obj[key] = value;
      }
    }
    data.push(obj as ConstituencyData);
  }
  
  return data;
};

// Load data on initialization
const loadData = async (): Promise<void> => {
  if (dataLoaded) return;
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = (async () => {
    try {
      // Use absolute path from public folder (works in both dev and production)
      const csvPath = `${import.meta.env.BASE_URL || '/'}dataset/constituency_level.csv`;
      console.log('Loading CSV from:', csvPath);
      
      const response = await fetch(csvPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('CSV file is empty');
      }
      
      RAW_DATA = parseCSV(text);
      
      if (RAW_DATA.length === 0) {
        throw new Error('No data parsed from CSV');
      }
      
      dataLoaded = true;
      console.log(`✓ Successfully loaded ${RAW_DATA.length} records from CSV`);
    } catch (error) {
      console.error('❌ Error loading CSV:', error);
      console.error('Please ensure dataset/constituency_level.csv exists in the public folder');
      RAW_DATA = [];
      dataLoaded = false;
      throw error; // Re-throw to allow proper error handling in components
    }
  })();
  
  return loadingPromise;
};

// Auto-initialize data loading
loadData();

export const getRawData = () => RAW_DATA;

export const isDataLoaded = () => dataLoaded;

export const waitForData = () => loadData();

export const getFilteredData = (
  stateFilters: string[], 
  constituencyFilters: string[], 
  yearFilter: number
): ConstituencyData[] => {
  if (!dataLoaded || RAW_DATA.length === 0) return [];
  
  // Create cache key
  const cacheKey = `${stateFilters.sort().join(',')}_${constituencyFilters.sort().join(',')}_${yearFilter}`;
  
  // Check cache
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey)!;
  }
  
  let filtered = RAW_DATA;
  
  // Filter by year
  filtered = filtered.filter(d => d.year === yearFilter);
  
  // Filter by states (if any selected)
  if (stateFilters.length > 0) {
    filtered = filtered.filter(d => stateFilters.includes(d.state_name));
  }
  
  // Filter by constituencies (if any selected)
  if (constituencyFilters.length > 0) {
    filtered = filtered.filter(d => constituencyFilters.includes(d.ac_name));
  }
  
  // Cache the result (limit cache size)
  if (dataCache.size > 50) {
    const firstKey = dataCache.keys().next().value;
    dataCache.delete(firstKey);
  }
  dataCache.set(cacheKey, filtered);
  
  return filtered;
};

export const getUniqueStates = (): string[] => {
  if (!dataLoaded || RAW_DATA.length === 0) return [];
  return Array.from(new Set(RAW_DATA.map(d => d.state_name))).sort();
};

export const getUniqueConstituencies = (states: string[] = []): string[] => {
  if (!dataLoaded || RAW_DATA.length === 0) return [];
  let data = RAW_DATA;
  if (states.length > 0) {
    data = data.filter(d => states.includes(d.state_name));
  }
  return Array.from(new Set(data.map(d => d.ac_name))).sort();
};

export const getUniqueYears = (): number[] => {
  if (!dataLoaded || RAW_DATA.length === 0) return [];
  return Array.from(new Set(RAW_DATA.map(d => d.year))).sort((a, b) => b - a);
};

// Get trends data for a specific constituency
export const getConstituencyTrend = (acName: string): ConstituencyData[] => {
  return RAW_DATA.filter(d => d.ac_name === acName).sort((a, b) => a.year - b.year);
};

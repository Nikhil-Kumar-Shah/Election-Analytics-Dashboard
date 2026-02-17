/**
 * Election Analytics Dashboard - Type Definitions
 * Copyright (c) 2026 Nikhil Kumar Shah
 * All rights reserved. Unauthorized copying or distribution is prohibited.
 */

export interface ConstituencyData {
  year: number;
  state_name: string;
  ac_name: string;
  total_electors: number;
  total_valid_votes: number;
  turnout: number;
  margin: number;
  num_candidates: number;
  winner_vote_share: number;
  turnout_change: number;
  avg_turnout: number;
  turnout_volatility: number;
  low_turnout_score: number;
  negative_trend_score: number;
  volatility_score: number;
  large_electorate_penalty: number;
  priority_score: number;
}

export interface FilterState {
  states: string[];
  constituencies: string[];
  year: number;
}

export enum View {
  OVERVIEW = 'Overview',
  TRENDS = 'Trends',
  DRIVERS = 'Drivers',
  PRIORITIZATION = 'Prioritization',
  FORWARD_LOOKING = 'Forward-Looking',
  METHODOLOGY = 'Methodology',
}

// types/stats.ts

export interface PerformanceStat {
  id: string;
  match_id: string;
  user_id: string;
  date: string;
  pts: number;
  ast: number;
  reb: number;
  stl: number;
  blk: number;
  // Add any additional fields as needed based on your API
}

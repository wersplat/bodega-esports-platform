import type { Team, TeamMember, TeamStats } from './team';
import { ApiError } from './error';

// Base response type for all API responses
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Paginated response type
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Team related types
export interface TeamApiResponse extends ApiResponse<{ item: Team }> {}

export type { Team } from './team';

export interface TeamMembersApiResponse extends ApiResponse<{ items: TeamMember[] }> {}

export interface TeamStatsApiResponse extends ApiResponse<{ item: TeamStats }> {}

// User related types
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string | null;
  bio?: string;
  position?: string;
  jersey_number?: number | null;
  team_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse extends ApiResponse<UserProfile> {}

// Match related types
export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_score: number | null;
  away_team_score: number | null;
  scheduled_at: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  league_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MatchWithDetails extends Match {
  home_team: Team;
  away_team: Team;
}

export interface MatchResponse extends ApiResponse<{ item: MatchWithDetails }> {}
export interface MatchesResponse extends ApiResponse<{ items: MatchWithDetails[] }> {}

// League related types
export interface League {
  id: string;
  name: string;
  description?: string;
  logo_url?: string | null;
  season: string;
  status: 'upcoming' | 'active' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
}

export interface LeagueResponse extends ApiResponse<{ item: League }> {}
export interface LeaguesResponse extends ApiResponse<{ items: League[] }> {}

// Standings related types
export interface TeamStanding {
  team_id: string;
  team_name: string;
  team_logo?: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form: Array<'W' | 'D' | 'L'>;
}

export interface StandingsResponse extends ApiResponse<{ items: TeamStanding[] }> {}


export type TeamRole = 'captain' | 'coach' | 'player' | 'manager';
export type TeamMemberStatus = 'active' | 'injured' | 'inactive' | 'pending';

export interface Team {
  id: string;
  name: string;
  tag?: string;
  logo_url: string | null;
  banner_url?: string | null;
  division: string;
  record?: string;
  created_at: string;
  updated_at: string;
  captain_id: string;
  description: string | null;
  home_court: string | null;
  website?: string | null;
  twitter_url?: string | null;
  twitch_url?: string | null;
  youtube_url?: string | null;
  discord_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  is_public: boolean;
  is_verified: boolean;
  member_count?: number;
  match_count?: number;
  win_count?: number;
  loss_count?: number;
  draw_count?: number;
  win_rate?: number;
  current_streak?: number;
  longest_streak?: number;
  current_rank?: number;
  highest_rank?: number;
  role?: TeamRole; // Current user's role in the team
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: TeamRole;
  position: string | null;
  jersey_number: number | null;
  status: TeamMemberStatus;
  joined_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string;
    email?: string;
    last_sign_in_at?: string;
    created_at: string;
  };
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  role: TeamRole;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at: string;
  created_at: string;
  updated_at: string;
  invited_by: string;
  team?: Pick<Team, 'id' | 'name' | 'logo_url'>;
  invitee?: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface TeamStats {
  team_id: string;
  team_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  draws: number;
  win_rate: number;
  points_scored: number;
  points_conceded: number;
  point_differential: number;
  current_streak: number;
  longest_streak: number;
  home_record: {
    wins: number;
    losses: number;
    draws: number;
  };
  away_record: {
    wins: number;
    losses: number;
    draws: number;
  };
  last_5_matches: Array<{
    match_id: string;
    opponent_id: string;
    opponent_name: string;
    opponent_logo: string | null;
    is_home: boolean;
    team_score: number;
    opponent_score: number;
    result: 'win' | 'loss' | 'draw';
    match_date: string;
  }>;
  // Game-specific stats
  points_per_game?: number;
  assists_per_game?: number;
  rebounds_per_game?: number;
  steals_per_game?: number;
  blocks_per_game?: number;
  field_goal_percentage?: number;
  three_point_percentage?: number;
  free_throw_percentage?: number;
  turnovers_per_game?: number;
  fouls_per_game?: number;
  plus_minus?: number;
  minutes_played_per_game?: number;
  efficiency_rating?: number;
  player_efficiency_rating?: number;
  true_shooting_percentage?: number;
  effective_field_goal_percentage?: number;
  offensive_rebounds_per_game?: number;
  defensive_rebounds_per_game?: number;
  // Add more game-specific stats as needed
}

export interface TeamMatch {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_score: number | null;
  away_team_score: number | null;
  scheduled_at: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'canceled';
  round?: number;
  best_of?: number;
  vod_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  home_team: Pick<Team, 'id' | 'name' | 'logo_url'>;
  away_team: Pick<Team, 'id' | 'name' | 'logo_url'>;
  league?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  tournament?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}
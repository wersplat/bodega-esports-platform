export interface Player {
  id: string;
  name: string;
  teamName: string;
  rank: number;
  points: number;
  wins: number;
  losses: number;
  winRate: number;
  role: string;
  stats: {
    kda: number;
    kills: number;
    deaths: number;
    assists: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  points: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
  players: Player[];
}

export interface StandingsData {
  teams: {
    id: string;
    name: string;
    wins: number;
    losses: number;
    winRate: number;
    points: number;
  }[];
}

export interface AdminStats {
  totalUsers: number;
  totalTeams: number;
  totalMatches: number;
  pendingApprovals: number;
}

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Auth API
export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

// Player API
export const getPlayerProfile = async (id: string) => {
  const { data } = await api.get(`/players/${id}`);
  return data;
};

// Team API
export const getTeam = async (id: string) => {
  const { data } = await api.get(`/teams/${id}`);
  return data;
};

export const getTeamMembers = async (teamId: string) => {
  const { data } = await api.get(`/teams/${teamId}/members`);
  return data;
};

// Leaderboard API
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data } = await api.get('/leaderboard');
  return data;
};

// Standings API
export const getStandings = async (): Promise<StandingsData> => {
  const { data } = await api.get('/standings');
  return data;
};

// Admin API
export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get('/admin/stats');
  return data;
};

// Types
export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  points: number;
  wins: number;
  losses: number;
  winRate: number;
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

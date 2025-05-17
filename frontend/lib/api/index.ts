import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Player, LeaderboardEntry, StandingsData, AdminStats, Team } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(async (config) => {
  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

// Auth API
export const login = async (email: string, password: string): Promise<{ user: any; session: any }> => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// Player API
export const getPlayerProfile = async (id: string): Promise<Player> => {
  const { data } = await api.get<Player>(`/players/${id}`);
  return data;
};

// Team API
export const getTeam = async (id: string): Promise<Team> => {
  const { data } = await api.get<Team>(`/teams/${id}`);
  return data;
};

export const getTeamMembers = async (teamId: string): Promise<Player[]> => {
  const { data } = await api.get<Player[]>(`/teams/${teamId}/members`);
  return data;
};

// Leaderboard API
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data } = await api.get<LeaderboardEntry[]>('/leaderboard');
  return data;
};

// Standings API
export const getStandings = async (): Promise<StandingsData> => {
  const { data } = await api.get<StandingsData>('/standings');
  return data;
};

// Admin API
export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get<AdminStats>('/admin/stats');
  return data;
};

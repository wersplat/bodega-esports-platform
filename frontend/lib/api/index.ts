import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Player, LeaderboardEntry, StandingsData, AdminStats } from './types';
import type { Team } from '@/types/team';

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
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (session?.access_token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// Auth API
export const login = async (email: string, password: string): Promise<{ user: any; session: any }> => {
  const response = await api.post('/auth/login', { email, password });
  if (!response || !response.data) throw new Error('No response data from login');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// Player API
export const getPlayerProfile = async (id: string): Promise<Player> => {
  const response = await api.get<Player>(`/players/${id}`);
  if (!response || !response.data) throw new Error('No response data for player profile');
  return response.data;
};

// Team API
export const getTeam = async (id: string): Promise<Team> => {
  const response = await api.get<Team>(`/teams/${id}`);
  if (!response || !response.data) throw new Error('No response data for team');
  return response.data;
};

export const getTeamMembers = async (teamId: string): Promise<Player[]> => {
  const response = await api.get<Player[]>(`/teams/${teamId}/members`);
  if (!response || !response.data) throw new Error('No response data for team members');
  return response.data;
};

// Leaderboard API
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const response = await api.get<LeaderboardEntry[]>('/leaderboard');
  if (!response || !response.data) throw new Error('No response data for leaderboard');
  return response.data;
};

// Standings API
export const getStandings = async (): Promise<StandingsData> => {
  const response = await api.get<StandingsData>('/standings');
  if (!response || !response.data) throw new Error('No response data for standings');
  return response.data;
};

// Admin API
export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get<AdminStats>('/admin/stats');
  if (!response || !response.data) throw new Error('No response data for admin stats');
  return response.data;
};

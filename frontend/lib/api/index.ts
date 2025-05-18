// Unified API client for all backend requests (no Supabase)
// Handles authentication, base URL, error handling, and typed endpoints
import type { Player, Team, LeaderboardEntry, StandingsData, AdminStats } from "./types";

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  status: number;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new Headers(options.headers || {});

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Set default headers if not FormData
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || response.statusText;
        throw new ApiError(
          errorMsg,
          response.status,
          data?.code,
          data?.details
        );
      }

      return data;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error.message || 'An unknown error occurred',
        error.status || 500
      );
    }
  }

  // ---- Auth endpoints ----
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // ---- Team endpoints ----
  async createTeam(teamData: {
    name: string;
    division: string;
    homeCourt?: string;
    description?: string;
  }): Promise<{ id: string; [key: string]: any }> {
    return this.request('/api/v2/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  }

  // ---- Avatar endpoints ----
  async uploadAvatar(userId: string, file: File): Promise<{ url: string; message?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    return this.request('/api/v2/avatar/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteAvatar(userId: string, avatarUrl: string): Promise<{ success: boolean; message?: string }> {
    return this.request('/api/v2/avatar/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, avatar_url: avatarUrl }),
    });
  }

  // ---- Leaderboard endpoints ----
  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  // ---- Standings endpoints ----
  async getStandings() {
    return this.request('/standings');
  }

  // ---- Admin endpoints ----
  async getAdminStats() {
    return this.request('/admin/stats');
  }
}

export const api = new ApiClient();
export const useApi = () => api;

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

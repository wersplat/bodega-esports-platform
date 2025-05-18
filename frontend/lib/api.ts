import { ApiResponse, UserProfile, Team, Match, League, TeamStanding, PaginatedResponse } from '@/types/api';
import { toApiError } from '@/types/error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bodegacatsgc.gg';
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  async uploadAvatar(userId: string, file: File): Promise<ApiResponse<{ url: string; message?: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/avatar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: toApiError({ ...data, status: response.status }) };
      }
      
      return { data };
    } catch (error) {
      return { error: toApiError(error) };
    }
  }

  async deleteAvatar(userId: string, avatarUrl: string): Promise<ApiResponse<{ success: boolean; message?: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/avatar`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...this.defaultHeaders,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ avatarUrl }),
      });

      // Handle 204 No Content response
      if (response.status === 204) {
        return { data: { success: true } };
      }

      const data = await response.json();
      
      if (!response.ok) {
        return { error: toApiError({ ...data, status: response.status }) };
      }
      
      return { data };
    } catch (error) {
      return { error: toApiError(error) };
    }
  }

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.defaultHeaders = { ...DEFAULT_HEADERS, ...defaultHeaders };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });
      if (response.status === 204) {
        return {} as ApiResponse<T>;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { error: toApiError({ ...data, status: response.status }) };
      }
      return { data };
    } catch (error) {
      return { error: toApiError(error) };
    }
  }

  get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  post<T>(endpoint: string, body?: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
  put<T>(endpoint: string, body: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
  patch<T>(endpoint: string, body: Partial<unknown>, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
  delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);

export const authApi = {
  getProfile: (): Promise<ApiResponse<UserProfile>> => api.get('/auth/me'),
  updateProfile: (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => api.patch('/auth/me', data),
};

export const teamsApi = {
  getTeams: (params?: { page?: number; pageSize?: number; search?: string }): Promise<ApiResponse<PaginatedResponse<Team>>> => {
    let endpoint = '/teams';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.page !== undefined) searchParams.append('page', String(params.page));
      if (params.pageSize !== undefined) searchParams.append('pageSize', String(params.pageSize));
      if (params.search) searchParams.append('search', params.search);
      const queryString = searchParams.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    return api.get(endpoint);
  },
  getTeamById: (id: string): Promise<ApiResponse<Team>> => api.get(`/teams/${id}`),
  createTeam: (data: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Team>> => api.post('/teams', data),
  updateTeam: (id: string, data: Partial<Team>): Promise<ApiResponse<Team>> => api.patch(`/teams/${id}`, data),
  deleteTeam: (id: string): Promise<ApiResponse<void>> => api.delete(`/teams/${id}`),
};

export const matchesApi = {
  getMatches: (params?: { teamId?: string; leagueId?: string; status?: string; page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Match>>> => {
    let endpoint = '/matches';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.teamId) searchParams.append('teamId', params.teamId);
      if (params.leagueId) searchParams.append('leagueId', params.leagueId);
      if (params.status) searchParams.append('status', params.status);
      if (params.page !== undefined) searchParams.append('page', String(params.page));
      if (params.limit !== undefined) searchParams.append('limit', String(params.limit));
      const queryString = searchParams.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    return api.get(endpoint);
  },
  getMatchById: (id: string): Promise<ApiResponse<Match>> => api.get(`/matches/${id}`),
};

export const leaguesApi = {
  getLeagues: (params?: { status?: string }): Promise<ApiResponse<League[]>> => {
    let endpoint = '/leagues';
    if (params && params.status) {
      endpoint += `?status=${encodeURIComponent(params.status)}`;
    }
    return api.get(endpoint);
  },
  getLeagueById: (id: string): Promise<ApiResponse<League>> => api.get(`/leagues/${id}`),
  getStandings: (leagueId: string): Promise<ApiResponse<TeamStanding[]>> => api.get(`/leagues/${leagueId}/standings`),
};

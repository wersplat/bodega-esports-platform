import { User } from '@supabase/supabase-js';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.bodegacatsgc.gg';

// Common response type for API calls
type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
};

// Type definitions for different entities
export interface PlayerProfile {
  id: string;
  display_name: string;
  username: string;
  platform?: string;
  gamer_tag?: string;
  positions?: string[];
  career_history?: string;
  team_id?: string;
  team_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches the current user's profile
 */
export const getPlayerProfile = async (): Promise<ApiResponse<PlayerProfile>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching player profile:', error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'Failed to fetch profile' 
      } 
    };
  }
};

/**
 * Fetches team information by ID
 */
export const getTeamById = async (teamId: string): Promise<ApiResponse<Team>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching team:', error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'Failed to fetch team' 
      } 
    };
  }
};

/**
 * Updates player profile
 */
export const updatePlayerProfile = async (
  profileData: Partial<PlayerProfile>
): Promise<ApiResponse<PlayerProfile>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error updating player profile:', error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'Failed to update profile' 
      } 
    };
  }
};

// Add more API functions as needed

/**
 * Helper function to handle API requests with auth
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : 'API request failed',
      } 
    };
  }
}

// Example usage of fetchWithAuth:
/*
export const getPlayerStats = async (playerId: string) => {
  return fetchWithAuth<PlayerStats>(`/players/${playerId}/stats`);
};
*/

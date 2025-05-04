export interface UserProfile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  position: string | null
  team_id: string | null
  jersey_number: number | null
  stats: UserStats | null
  created_at: string
  updated_at: string
}

export interface UserStats {
  games_played: number
  points_per_game: number
  assists_per_game: number
  rebounds_per_game: number
  steals_per_game: number
  blocks_per_game: number
}

export interface Team {
  id: string
  name: string
  logo_url: string | null
  division: string
  record: string
} 
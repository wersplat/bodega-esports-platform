export interface Team {
  id: string
  name: string
  logo_url: string | null
  division: string
  record: string
  created_at: string
  updated_at: string
  captain_id: string
  description: string | null
  home_court: string | null
}

export interface TeamMember {
  id: string
  user_id: string
  team_id: string
  role: "captain" | "coach" | "player" | "manager"
  position: string | null
  jersey_number: number | null
  status: "active" | "injured" | "inactive"
  joined_at: string
  user: {
    id: string
    full_name: string
    avatar_url: string | null
    username: string
  }
}

export interface TeamStats {
  wins: number
  losses: number
  points_per_game: number
  assists_per_game: number
  rebounds_per_game: number
  steals_per_game: number
  blocks_per_game: number
} 
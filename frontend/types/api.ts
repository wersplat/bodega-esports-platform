import { Team, TeamMember, TeamStats } from './team'

export interface TeamApiResponse {
  data: { item: Team }
  error: { message: string; code: string } | null
}

export interface TeamMembersApiResponse {
  data: { items: TeamMember[] }
  error: { message: string; code: string } | null
}

export interface TeamStatsApiResponse {
  data: { item: TeamStats }
  error: { message: string; code: string } | null
}


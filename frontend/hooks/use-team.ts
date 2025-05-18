"use client"

import { useState, useEffect, useRef } from "react"
// TODO: Replace Supabase logic with backend API calls
import { useAuth } from "@/components/auth/auth-provider"
import type { Team, TeamMember, TeamStats, TeamInvite } from "@/types/team"
import type { TeamApiResponse, TeamMembersApiResponse, TeamStatsApiResponse } from "@/types/api"
import axios, { AxiosResponse } from "axios"
import { useRuntimeConfig } from "./use-runtime-config"

export function useTeam(teamId?: string) {
  const { user } = useAuth()
  const [team, setTeam] = useState<Team | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const [members, setMembers] = useState<TeamMember[]>([])
  const [_stats, setStats] = useState<TeamStats | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const [error, setError] = useState<string | null>(null)
  // Store the user role in a ref to avoid lint warnings and closure issues
  const userRoleRef = useRef<string | null>(null)

  useEffect(() => {
    async function fetchTeamData() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        let targetTeamId: string | undefined = teamId

        // If no teamId is provided, fetch the user's team
        if (!targetTeamId) {
          try {
            const config = useRuntimeConfig()
            const response: AxiosResponse<TeamApiResponse> = await axios.get(`${config.apiBase}/api/${config.apiVersion}/teams/user`, {
              params: { user_id: user.id }
            })
            const responseData = response.data
            if (responseData.error) {
              throw new Error(responseData.error.message)
            }
            if (!responseData.data) {
              throw new Error('Team data missing')
            }
            const teamData = responseData.data.item
            if (!teamData) {
              throw new Error('Team data not found')
            }
            targetTeamId = teamData.id
            userRoleRef.current = teamData.role ?? null
            setTeam(teamData)
          } catch (error: any) {
            if (error.response?.status === 404) {
              setIsLoading(false)
              return
            }
            throw error
          }
        } else {
          try {
            const config = useRuntimeConfig()
            const response = await axios.get(`${config.apiBase}/api/${config.apiVersion}/teams/${targetTeamId}`)
            const responseData = response.data as TeamApiResponse
            if (responseData.error) {
              throw new Error(responseData.error.message)
            }
            if (!responseData.data) {
              throw new Error('Team data missing')
            }
            const teamData = responseData.data.item
            if (!teamData) {
              throw new Error('Team data not found')
            }
            setTeam(teamData)
          } catch (error: any) {
            throw error
          }
        }

        if (!targetTeamId) {
          setIsLoading(false)
          return
        }

        // Fetch team members
        try {
          const config = useRuntimeConfig()
          const response = await axios.get(`${config.apiBase}/api/${config.apiVersion}/teams/${targetTeamId}/members`)
          const responseData = response.data as TeamMembersApiResponse
          if (responseData.error) {
            throw new Error(responseData.error.message)
          }
          if (!responseData.data) {
            throw new Error('Team members data missing')
          }
          const membersData = responseData.data.items
          if (!membersData) {
            throw new Error('Team members data not found')
          }
          setMembers(membersData.map((member: any) => ({
            id: member.id,
            user_id: member.user_id,
            team_id: member.team_id,
            role: member.role,
            position: member.position,
            jersey_number: member.jersey_number,
            status: member.status,
            joined_at: member.joined_at,
            user: {
              id: member.user.id,
              full_name: member.user.full_name,
              avatar_url: member.user.avatar_url,
              username: member.user.username,
            },
          } as TeamMember)))
        } catch (error: any) {
          throw error
        }

        // Fetch team stats
        try {
          const config = useRuntimeConfig()
          const response = await axios.get(`${config.apiBase}/api/${config.apiVersion}/teams/${targetTeamId}/stats`)
          const responseData = response.data as TeamStatsApiResponse
          if (responseData.error) {
            throw new Error(responseData.error.message)
          }
          if (!responseData.data) {
            throw new Error('Team stats data missing')
          }
          const statsData = responseData.data.item
          if (!statsData) {
            throw new Error('Team stats data not found')
          }
          setStats(statsData)
        } catch (error: any) {
          setStats({
            team_id: '',
            team_name: '',
            matches_played: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            win_rate: 0,
            points_scored: 0,
            points_conceded: 0,
            point_differential: 0,
            current_streak: 0,
            longest_streak: 0,
            home_record: { wins: 0, losses: 0, draws: 0 },
            away_record: { wins: 0, losses: 0, draws: 0 },
            last_5_matches: [],
            points_per_game: 0,
            assists_per_game: 0,
            rebounds_per_game: 0,
            steals_per_game: 0,
            blocks_per_game: 0,
          })
        }
      } catch (err: any) {
        console.error("Error fetching team data:", err)
        setError(err.message || "Failed to load team data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamData()
  }, [user, teamId])

  async function addTeamMember(userData: {
    email: string
    role: "player" | "coach" | "manager"
    position?: string
    jersey_number?: number
  }): Promise<{ success: boolean; message: string }> {
    const isAdmin = userRoleRef.current === "captain" || userRoleRef.current === "coach" || userRoleRef.current === "manager"
    if (!team || !isAdmin) {
      return { success: false, message: "You don't have permission to add members" }
    }

    try {
      const config = useRuntimeConfig()
      const response = await axios.post(`${config.apiBase}/api/${config.apiVersion}/teams/${team.id}/members`, {
        email: userData.email,
        role: userData.role,
        position: userData.position,
        jersey_number: userData.jersey_number
      })

      return { success: true, message: response.data.message || "Member added successfully" }
    } catch (error: any) {
      console.error("Error adding team member:", error)
      return { 
        success: false, 
        message: error.response?.data?.error?.message || "Failed to add member" 
      } as const
    }
  }

  async function removeTeamMember(memberId: string): Promise<{ success: boolean; message: string }> {
    const isAdmin = userRoleRef.current === "captain" || userRoleRef.current === "coach" || userRoleRef.current === "manager"
    if (!team || !isAdmin) {
      return { success: false, message: "You don't have permission to remove members" }
    }
    try {
      // Check if the member is the team captain
      const memberToRemove = members.find((m: TeamMember) => m.id === memberId)
      if (memberToRemove?.role === "captain") {
        return { success: false, message: "Cannot remove the team captain" }
      }
      // TODO: Replace with actual backend endpoint to remove a team member
      const config = useRuntimeConfig()
      const response = await axios.delete(`${config.apiBase}/api/${config.apiVersion}/teams/${team.id}/members/${memberId}`)
      if (response.data.error) {
        throw new Error(response.data.error.message)
      }
      // Remove the member from local state
      setMembers((prev: TeamMember[]) => prev.filter((member: TeamMember) => member.id !== memberId))
      return { success: true, message: "Member removed successfully" }
    } catch (err: any) {
      console.error("Error removing team member:", err)
      return { success: false, message: err.message || "Failed to remove member" }
    }
  }

  async function updateTeam(updates: Partial<Team>): Promise<{ success: boolean; message: string }> {
    const isAdmin = userRoleRef.current === "captain" || userRoleRef.current === "coach" || userRoleRef.current === "manager"
    if (!team || !isAdmin) {
      return { success: false, message: "You don't have permission to update team" }
    }

    try {
      // TODO: Replace with actual backend endpoint to update team
      const config = useRuntimeConfig()
      const response = await axios.put(`${config.apiBase}/api/${config.apiVersion}/teams/${team.id}`, updates)
      if (response.data.error) {
        throw new Error(response.data.error.message)
      }

      // Update the team in local state
      setTeam((prev: Team | null) => (prev ? { ...prev, ...updates } : null))

      return { success: true, message: "Team updated successfully" }
    } catch (err: any) {
      console.error("Error updating team:", err)
      return { success: false, message: err.message || "Failed to update team" }
    }
  }

  async function resendInvite(invite: TeamInvite): Promise<{ success: boolean; message: string }> {
    if (!team) {
      throw new Error('Team is not initialized');
    }
    const config = useRuntimeConfig()
    await axios.post(`${config.apiBase}/api/${config.apiVersion}/teams/${team.id}/invites/resend`, {
      email: invite.email,
      teamId: invite.team_id,
      role: invite.role,
      invitedBy: invite.invited_by
    })

    return { success: true, message: "Invite resent successfully" }
  }

  async function cancelInvite(inviteId: string): Promise<{ success: boolean; message: string }> {
    if (!team) {
      return { success: false, message: "Team is not initialized" }
    }
    try {
      // TODO: Replace with actual backend endpoint to cancel invitation
      const config = useRuntimeConfig()
      const response = await axios.delete(`${config.apiBase}/api/${config.apiVersion}/teams/${team.id}/invites/${inviteId}`)
      if (response.data.error) {
        throw new Error(response.data.error.message)
      }
      setMembers((prev: TeamMember[]) => prev.filter((member) => member.id !== inviteId)) // If you want to update members, adjust as needed
      return { success: true, message: "Invitation cancelled successfully" }
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to cancel invitation" }
    }
  }

  return {
    team,
    members,
    stats: _stats,
    isLoading,
    error,
    isTeamAdmin: userRoleRef.current === "captain" || userRoleRef.current === "coach" || userRoleRef.current === "manager",
    addTeamMember,
    removeTeamMember,
    updateTeam,
    resendInvite,
    cancelInvite,
  } as const
}
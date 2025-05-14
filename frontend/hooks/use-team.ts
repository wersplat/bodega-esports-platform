"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"
import type { Team, TeamMember, TeamStats } from "@/types/team"
import type { TeamApiResponse, TeamMembersApiResponse, TeamStatsApiResponse } from "@/types/api"
import axios, { AxiosResponse } from "axios"
import { v4 as uuidv4 } from "uuid"
import { useRuntimeConfig } from "@/hooks/use-runtime-config"

export function useTeam(teamId?: string) {
  const { user } = useAuth()
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Determine if the current user is a captain or admin
  const isTeamAdmin = userRole === "captain" || userRole === "coach" || userRole === "manager"

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
          const config = useRuntimeConfig()
          const response: AxiosResponse<TeamApiResponse> = await axios.get(`${config.apiBase}/api/${config.apiVersion}/teams/user`, {
            params: { user_id: user.id }
          })
          const responseData = response.data
          if (responseData.error) {
            throw new Error(responseData.error.message)
          }
          const teamData = responseData.data.item
            if (!teamData) {
              throw new Error('Team data not found')
            }
            targetTeamId = teamData.id
            setUserRole(teamData.role)
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
            const response = await axios.get(`${API_BASE}/api/${API_VERSION}/teams/${targetTeamId}`)
            const responseData = response.data as TeamApiResponse
            if (responseData.error) {
              throw new Error(responseData.error.message)
            }
            setTeam(responseData.data.item)
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
          const response = await axios.get(`${API_BASE}/api/${API_VERSION}/teams/${targetTeamId}/members`)
          const responseData = response.data as TeamMembersApiResponse
          if (responseData.error) {
            throw new Error(responseData.error.message)
          }
          const teamMembers = responseData.data.items
          if (!teamMembers) {
            throw new Error('Team members data not found')
          }
          setMembers(teamMembers.map((member: any) => ({
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
          const response = await axios.get(`${API_BASE}/api/${API_VERSION}/teams/${targetTeamId}/stats`)
          const responseData = response.data as TeamStatsApiResponse
          if (responseData.error) {
            throw new Error(responseData.error.message)
          }
          const statsData = responseData.data.item
          if (!statsData) {
            throw new Error('Team stats data not found')
          }
          setStats(statsData)
        } catch (error: any) {
          setStats({
            wins: 0,
            losses: 0,
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
    if (!team || !isTeamAdmin) {
      return { success: false, message: "You don't have permission to add members" }
    }

    try {
      const response = await axios.post(`${API_BASE}/api/${API_VERSION}/teams/${team.id}/members`, {
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

  // Resend invite
  async function resendInvite(invite: any) {
    if (!team) {
      throw new Error('Team is not initialized');
    }
    await axios.post(`${API_BASE}/api/${API_VERSION}/teams/${team.id}/invites/resend`, {
      email: invite.email,
      teamId: invite.team_id,
      role: invite.role,
      token: invite.token,
      invitedBy: invite.invited_by
    })
  }

  // Cancel invite
  async function cancelInvite(inviteId: string) {
    await supabase
      .from("team_invitations")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", inviteId)
  }

  async function updateTeamMember(
    memberId: string,
    updates: {
      role?: "captain" | "coach" | "player" | "manager"
      position?: string
      jersey_number?: number
      status?: "active" | "injured" | "inactive"
    },
  ): Promise<{ success: boolean; message: string }> {
    if (!team || !isTeamAdmin) {
      return { success: false, message: "You don't have permission to update members" }
    }

    // Prevent demoting the only captain
    const memberToUpdate = members.find((m: TeamMember) => m.id === memberId)
    if (memberToUpdate && memberToUpdate.role === "captain" && updates.role && updates.role !== "captain") {
      const numCaptains = members.filter((m) => m.role === "captain").length
      if (numCaptains === 1) {
        return { success: false, message: "Cannot demote the only team captain. Assign another captain first." }
      }
    }

    try {
      const { error } = await supabase.from("team_members").update(updates).eq("id", memberId)

      if (error) {
        throw error
      }

      // Update the member in local state
      setMembers((prev: TeamMember[]) => prev.map((member) => (member.id === memberId ? { ...member, ...updates } : member)))

      return { success: true, message: "Member updated successfully" }
    } catch (err: any) {
      console.error("Error updating team member:", err)
      return { success: false, message: err.message || "Failed to update member" }
    }
  }

  async function removeTeamMember(memberId: string): Promise<{ success: boolean; message: string }> {
    if (!team || !isTeamAdmin) {
      return { success: false, message: "You don't have permission to remove members" }
    }

    try {
      // Check if the member is the team captain
      const memberToRemove = members.find((m: TeamMember) => m.id === memberId)
      if (memberToRemove?.role === "captain") {
        return { success: false, message: "Cannot remove the team captain" }
      }

      const { error } = await supabase.from("team_members").delete().eq("id", memberId)

      if (error) {
        throw error
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
    if (!team || !isTeamAdmin) {
      return { success: false, message: "You don't have permission to update team" }
    }

    try {
      const { error } = await supabase.from("teams").update(updates).eq("id", team.id)

      if (error) {
        throw error
      }

      // Update the team in local state
      setTeam((prev: Team | null) => (prev ? { ...prev, ...updates } : null))

      return { success: true, message: "Team updated successfully" }
    } catch (err: any) {
      console.error("Error updating team:", err)
      return { success: false, message: err.message || "Failed to update team" }
    }
  }

  return {
    team,
    members,
    stats,
    isLoading,
    error,
    isTeamAdmin,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    updateTeam,
    resendInvite,
    cancelInvite,
  } as const
} 
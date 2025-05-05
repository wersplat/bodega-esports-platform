"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"
import type { Team, TeamMember, TeamStats } from "@/types/team"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

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

        let targetTeamId = teamId

        // If no teamId is provided, fetch the user's team
        if (!targetTeamId) {
          const { data: userTeamData, error: userTeamError } = await supabase
            .from("team_members")
            .select("team_id, role")
            .eq("user_id", user.id)
            .single()

          if (userTeamError) {
            if (userTeamError.code !== "PGRST116") {
              // Not found error
              throw userTeamError
            }
            // User has no team
            setIsLoading(false)
            return
          }

          targetTeamId = userTeamData.team_id
          setUserRole(userTeamData.role)
        } else {
          // Check if user is a member of this team and get their role
          const { data: memberData, error: memberError } = await supabase
            .from("team_members")
            .select("role")
            .eq("user_id", user.id)
            .eq("team_id", targetTeamId)
            .single()

          if (!memberError) {
            setUserRole(memberData.role)
          }
        }

        if (!targetTeamId) {
          setIsLoading(false)
          return
        }

        // Fetch team details
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", targetTeamId)
          .single()

        if (teamError) throw teamError

        setTeam(teamData as Team)

        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from("team_members")
          .select(`
            id,
            user_id,
            team_id,
            role,
            position,
            jersey_number,
            status,
            joined_at,
            users:user_id (
              id,
              full_name,
              avatar_url,
              username
            )
          `)
          .eq("team_id", targetTeamId)
          .order("role", { ascending: false })

        if (membersError) throw membersError

        // Transform the data to match our TeamMember interface
        const formattedMembers = membersData.map((member: any) => ({
          ...member,
          user: member.users,
        })) as unknown as TeamMember[]

        setMembers(formattedMembers)

        // Fetch team stats
        const { data: statsData, error: statsError } = await supabase
          .from("team_stats")
          .select("*")
          .eq("team_id", targetTeamId)
          .single()

        if (!statsError && statsData) {
          setStats(statsData as TeamStats)
        } else {
          // If no stats found, create default stats
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
      // Always create an invitation record
      const token = uuidv4()
      const { data: invitee, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", userData.email)
        .single()

      if (!invitee) {
        // User not found, create pending invite and send email
        await supabase.from("team_invitations").insert({
          team_id: team.id,
          email: userData.email,
          role: userData.role,
          invited_by: user?.id || null,
          token,
          status: "pending"
        })
        // Send invite email (call API endpoint)
        await axios.post("/api/invite-team-member", {
          email: userData.email,
          teamId: team.id,
          role: userData.role,
          token,
          invitedBy: user?.id || null
        })
        return { success: true, message: "Invitation email sent to user." }
      } else {
        // User exists, add to team and mark invite as accepted
        await supabase.from("team_members").insert({
          user_id: invitee.id,
          team_id: team.id,
          role: userData.role,
          position: userData.position || null,
          jersey_number: userData.jersey_number || null,
          status: "active",
          joined_at: new Date().toISOString()
        })
        await supabase.from("team_invitations").insert({
          team_id: team.id,
          email: userData.email,
          role: userData.role,
          invited_by: user?.id || null,
          token,
          status: "accepted",
          accepted_at: new Date().toISOString()
        })
        return { success: true, message: "User added to team." }
      }
    } catch (err: any) {
      console.error("Error adding team member:", err)
      return { success: false, message: err.message || "Failed to add member" }
    }
  }

  // Resend invite
  async function resendInvite(invite: any) {
    await axios.post("/api/invite-team-member", {
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
    const memberToUpdate = members.find((m) => m.id === memberId)
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
      setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, ...updates } : member)))

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
      const memberToRemove = members.find((m) => m.id === memberId)
      if (memberToRemove?.role === "captain") {
        return { success: false, message: "Cannot remove the team captain" }
      }

      const { error } = await supabase.from("team_members").delete().eq("id", memberId)

      if (error) {
        throw error
      }

      // Remove the member from local state
      setMembers((prev) => prev.filter((member) => member.id !== memberId))

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
      setTeam((prev) => (prev ? { ...prev, ...updates } : null))

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
  }
} 
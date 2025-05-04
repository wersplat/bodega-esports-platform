"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import type { Team, TeamMember, TeamStats } from "@/types/team"

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
        const formattedMembers = membersData.map((member) => ({
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
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, full_name, avatar_url, username")
        .eq("email", userData.email)
        .single()

      if (userError) {
        return { success: false, message: "User not found with that email" }
      }

      // Check if user is already a member of this team
      const { data: existingMember, error: memberError } = await supabase
        .from("team_members")
        .select("id")
        .eq("user_id", userData.id)
        .eq("team_id", team.id)
        .single()

      if (existingMember) {
        return { success: false, message: "User is already a member of this team" }
      }

      // Add the user to the team
      const newMember = {
        user_id: userData.id,
        team_id: team.id,
        role: userData.role,
        position: userData.position || null,
        jersey_number: userData.jersey_number || null,
        status: "active",
        joined_at: new Date().toISOString(),
      }

      const { data: insertData, error: insertError } = await supabase.from("team_members").insert([newMember]).select()

      if (insertError) {
        throw insertError
      }

      // Add the new member to the local state
      const addedMember = {
        ...insertData[0],
        user: userData,
      } as unknown as TeamMember

      setMembers((prev) => [...prev, addedMember])

      return { success: true, message: "Team member added successfully" }
    } catch (err: any) {
      console.error("Error adding team member:", err)
      return { success: false, message: err.message || "Failed to add team member" }
    }
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

    try {
      const { error } = await supabase.from("team_members").update(updates).eq("id", memberId).eq("team_id", team.id)

      if (error) {
        throw error
      }

      // Update the member in local state
      setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, ...updates } : member)))

      return { success: true, message: "Team member updated successfully" }
    } catch (err: any) {
      console.error("Error updating team member:", err)
      return { success: false, message: err.message || "Failed to update team member" }
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

      const { error } = await supabase.from("team_members").delete().eq("id", memberId).eq("team_id", team.id)

      if (error) {
        throw error
      }

      // Remove the member from local state
      setMembers((prev) => prev.filter((member) => member.id !== memberId))

      return { success: true, message: "Team member removed successfully" }
    } catch (err: any) {
      console.error("Error removing team member:", err)
      return { success: false, message: err.message || "Failed to remove team member" }
    }
  }

  async function updateTeam(updates: Partial<Team>): Promise<{ success: boolean; message: string }> {
    if (!team || !isTeamAdmin) {
      return { success: false, message: "You don't have permission to update team details" }
    }

    try {
      const { error } = await supabase
        .from("teams")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", team.id)

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
    userRole,
    isTeamAdmin,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    updateTeam,
  }
} 
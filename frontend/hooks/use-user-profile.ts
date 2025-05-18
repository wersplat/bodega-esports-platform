"use client"

import { useState, useEffect } from "react"
// TODO: Replace Supabase logic with backend API calls
import { useAuth } from "@/components/auth/auth-provider"
import type { UserProfile, Team } from "@/types/user"

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch user profile from profiles table
        // TODO: Replace with actual backend endpoint to fetch user profile
        const res = await fetch(`/api/profile/${user.id}`)
        const profileData = await res.json()
        if (!res.ok) throw new Error(profileData.message || "Failed to fetch profile")

        if (!profileData || !profileData.id) {
          // Create a new profile if it doesn't exist
          // TODO: Replace with actual backend endpoint to create user profile
          const newProfile = {
            id: user.id,
            username: user.email?.split("@")?.[0] || "",
            full_name: user.email?.split("@")?.[0] || "",
            avatar_url: ("avatarUrl" in user ? (user as any).avatarUrl : null),
            bio: null,
            position: null,
            team_id: null,
            jersey_number: null,
            stats: {
              games_played: 0,
              points_per_game: 0,
              assists_per_game: 0,
              rebounds_per_game: 0,
              steals_per_game: 0,
              blocks_per_game: 0,
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          const res = await fetch(`/api/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProfile),
          })
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.message || "Failed to create profile")
          }
          setProfile(newProfile)
        } else {
          setProfile(profileData as UserProfile)

          // If user has a team, fetch team data
          if (profileData.team_id) {
            // TODO: Replace with actual backend endpoint to fetch team data
            const res = await fetch(`/api/teams/${profileData.team_id}`)
            const teamData = await res.json()
            if (!res.ok) {
              console.error("Error fetching team data:", teamData.message)
            } else {
              setTeam(teamData as Team)
            }
          }
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err)
        setError(err.message || "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user])

  async function updateProfile(updates: Partial<UserProfile>): Promise<boolean> {
    if (!user || !profile) return false

    try {
      setIsLoading(true)
      setError(null)

      // TODO: Replace with actual backend endpoint to update profile
      const res = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          updated_at: new Date().toISOString(),
        }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      // Update local state
      setProfile({
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      })

      return true
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    profile,
    team,
    isLoading,
    error,
    updateProfile,
  }
} 
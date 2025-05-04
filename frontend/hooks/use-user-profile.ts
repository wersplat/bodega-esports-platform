"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
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
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        if (!profileData) {
          // Create a new profile if it doesn't exist
          const newProfile = {
            id: user.id,
            username: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
            full_name: user.user_metadata?.full_name || "",
            avatar_url: user.user_metadata?.avatar_url || null,
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

          const { error: insertError } = await supabase.from("profiles").insert([newProfile])

          if (insertError) {
            throw insertError
          }

          setProfile(newProfile)
        } else {
          setProfile(profileData as UserProfile)

          // If user has a team, fetch team data
          if (profileData.team_id) {
            const { data: teamData, error: teamError } = await supabase
              .from("teams")
              .select("*")
              .eq("id", profileData.team_id)
              .single()

            if (teamError) {
              console.error("Error fetching team data:", teamError)
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

      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
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
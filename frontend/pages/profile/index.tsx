"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Save, X } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"
import { AvatarUpload } from "@/components/auth/avatar-upload"
import { StatsDisplay } from "@/components/stats-display"
import { RecentMatches } from "@/components/recent-matches"
import { Achievements } from "@/components/achievements"
import { PerformanceChart } from "@/components/performance-chart"
// import type { UserProfile, Team } from "@/types/user"

type UserProfile = {
  id: string
  username?: string
  full_name?: string
  bio?: string
  position?: string
  jersey_number?: number | string
  avatar_url?: string | null
  team_id?: string | null
  stats?: any
  [key: string]: any
}

type Team = {
  id: string
  name: string
  [key: string]: any
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const userId = params?.id as string

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    position: "",
    jersey_number: "",
  })

  const isOwnProfile = user?.id === userId

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single()

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // Profile not found
            router.push("/404")
            return
          }
          throw profileError
        }

        setProfile(profileData as UserProfile)

        // Initialize form data
        setFormData({
          username: profileData.username || "",
          full_name: profileData.full_name || "",
          bio: profileData.bio || "",
          position: profileData.position || "",
          jersey_number: profileData.jersey_number?.toString() || "",
        })

        // Fetch team data if user has a team
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
      } catch (err: any) {
        console.error("Error fetching user profile:", err)
        setError(err.message || "Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = async (url: string | null) => {
    if (!profile) return

    try {
      const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", profile.id)

      if (error) throw error

      setProfile({ ...profile, avatar_url: url })
    } catch (err) {
      console.error("Error updating avatar:", err)
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      setIsLoading(true)

      const updates = {
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        position: formData.position,
        jersey_number: formData.jersey_number ? Number.parseInt(formData.jersey_number) : undefined,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id)

      if (error) throw error

      setProfile({ ...profile, ...updates })
      setIsEditing(false)
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-[#e11d48] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-[#94a3b8] mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-[#94a3b8] mb-4">The requested profile could not be found.</p>
          <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8">
      <Card className="p-6 bg-[#1e293b] rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col items-center gap-4">
            <AvatarUpload avatarUrl={profile.avatar_url ?? null} onAvatarChange={handleAvatarChange} />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#f8fafc]">{profile.full_name || profile.username}</h1>
              <p className="text-[#94a3b8]">{profile.bio}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {isOwnProfile && !isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
        {isEditing && (
          <form className="mt-6 space-y-4" onSubmit={e => { e.preventDefault(); handleSaveProfile(); }}>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]"
            />
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]"
            />
            <Input
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              className="w-full bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]"
            />
            <Input
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Position"
              className="w-full bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]"
            />
            <Input
              name="jersey_number"
              value={formData.jersey_number}
              onChange={handleInputChange}
              placeholder="Jersey Number"
              className="w-full bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]"
            />
          </form>
        )}
        {team && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-[#f8fafc]">Team</h2>
            <p className="text-[#94a3b8]">{team.name}</p>
          </div>
        )}
      </Card>
      {profile.stats && <StatsDisplay stats={profile.stats} />}
      <RecentMatches userId={userId} />
      <Achievements userId={userId} />
      <PerformanceChart userId={userId} />
    </div>
  )
} 
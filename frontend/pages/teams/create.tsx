"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth/auth-provider"
import { api } from "@/lib/api"

export default function CreateTeamPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    division: "",
    homeCourt: "",
    description: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Check if user is already in a team
      // TODO: Replace with actual backend endpoint URL
      const checkTeamRes = await fetch("/api/team_members/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      })
      const checkTeamData = await checkTeamRes.json()
      if (checkTeamData.exists) {
        setError("You are already a member of a team. You must leave your current team before creating a new one.")
        setIsSubmitting(false)
        return
      }

      // Create new team
      const team = await api.createTeam(formData);
      if (team && typeof team === 'object' && 'id' in team && typeof team.id === 'string') {
        // Add user as team captain
        // TODO: Replace with actual backend endpoint URL
        const teamMember = {
          team_id: team.id,
          user_id: user.id,
          role: "captain",
        };
        const addMemberRes = await fetch("/api/team_members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamMember),
        })
        if (!addMemberRes.ok) {
          const err = await addMemberRes.json()
          throw new Error(err.message || "Failed to add user as team captain")
        }

        // Create initial team stats
        const teamStats = {
          team_id: team.id,
          wins: 0,
          losses: 0,
          points_per_game: 0,
          assists_per_game: 0,
          rebounds_per_game: 0,
          steals_per_game: 0,
          blocks_per_game: 0,
        }
        // TODO: Replace with actual backend endpoint URL
        const statsRes = await fetch("/api/team_stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamStats),
        })
        if (!statsRes.ok) {
          setError("Failed to create team stats")
          // Continue anyway as this is not critical
        }

        // Redirect to team management page
        router.push("/teams/manage");
      } else {
        setError("Team created but no team ID returned. Please check API response.");
      }
    } catch (err: any) {
      setError("Failed to create team");
      setError(err.message || "Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#e11d48] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#94a3b8]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create New Team</h1>
          <p className="text-[#94a3b8]">Set up your team and start recruiting players</p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500">{error}</div>
          )}

          <form onSubmit={handleCreateTeam} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Team Alpha"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Division *</Label>
                <Input
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., East"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeCourt">Home Court</Label>
                <Input
                  id="homeCourt"
                  name="homeCourt"
                  value={formData.homeCourt}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Arena"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Team Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your team..."
                className="w-full rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" className="mr-2" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#e11d48] text-[#f8fafc] hover:bg-[#be123c]">
                {isSubmitting ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
} 
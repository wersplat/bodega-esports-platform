"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { teamsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CreateTeamPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    division: "",
    home_court: "",
    description: "",
    is_public: true,
    is_verified: false,
    logo_url: "",
    captain_id: ""
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    
    // Set the current user as the captain
    setFormData(prev => ({
      ...prev,
      captain_id: user.id
    }))
    setIsLoading(false)
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      setError("You must be logged in to create a team")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create the team with the form data
      const { data: newTeam, error: createError } = await teamsApi.createTeam({
        ...formData,
        captain_id: user.id,
        logo_url: formData.logo_url || "",
        is_public: true,
        is_verified: false
      })
      
      if (createError || !newTeam) {
        throw new Error(createError?.message || 'Failed to create team')
      }
      
      // Redirect to the new team's page
      router.push(`/teams/${newTeam.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create team')
      setIsLoading(false)
    }
  }

  if (isLoading) {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Team</h1>
        <p className="text-muted-foreground">Set up your team and start recruiting players</p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
            {error}
          </div>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="home_court">Home Court</Label>
              <Input
                id="home_court"
                name="home_court"
                value={formData.home_court}
                onChange={handleInputChange}
                placeholder="e.g., Main Arena"
                disabled={isLoading}
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
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us about your team..."
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Team'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Save } from "lucide-react"
import { TeamLogoUpload } from "./team-logo-upload"
import type { Team } from "@/types/team"
import { useTeam } from "@/hooks/use-team"
// TODO: Replace Supabase logic with backend API calls
import type { TeamInvite } from "@/types/team"

interface TeamSettingsProps {
  team: Team
  isAdmin: boolean
  onUpdateTeam: (_updates: Partial<Team>) => Promise<{ success: boolean; message: string }>
}

export function TeamSettings({ team, isAdmin, onUpdateTeam }: TeamSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: team.name,
    division: team.division,
    description: team.description || "",
    home_court: team.home_court || "",
    logo_url: team.logo_url,
  })

  const { resendInvite, cancelInvite } = useTeam(team.id)
  const [pendingInvites, setPendingInvites] = useState<TeamInvite[]>([])
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteMessage, setInviteMessage] = useState("")

  useEffect(() => {
    async function fetchInvites() {
      if (!team?.id) return
      // TODO: Replace with actual backend endpoint to fetch pending invites
      const response = await fetch(`/api/teams/${team.id}/invites?status=pending`)
      const result = await response.json()
      setPendingInvites(result.data || [])
    }
    fetchInvites()
  }, [team?.id])

  async function handleResend(invite: TeamInvite) {
    setInviteLoading(true)
    setInviteMessage("")
    try {
      await resendInvite(invite)
      setInviteMessage("Invitation resent.")
    } catch {
      setInviteMessage("Failed to resend invitation.")
    }
    setInviteLoading(false)
  }

  async function handleCancel(inviteId: string) {
    setInviteLoading(true)
    setInviteMessage("")
    try {
      await cancelInvite(inviteId)
      setPendingInvites((prev) => prev.filter((i) => i.id !== inviteId))
      setInviteMessage("Invitation cancelled.")
    } catch {
      setInviteMessage("Failed to cancel invitation.")
    }
    setInviteLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, logo_url: url }))
  }

  const handleSaveSettings = async () => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const updates: Partial<Team> = {}

      if (formData.name !== team.name) updates.name = formData.name
      if (formData.division !== team.division) updates.division = formData.division
      if (formData.description !== team.description) updates.description = formData.description
      if (formData.home_court !== team.home_court) updates.home_court = formData.home_court
      if (formData.logo_url !== team.logo_url) updates.logo_url = formData.logo_url

      // Only update if there are changes
      if (Object.keys(updates).length === 0) {
        setMessage({ type: "error", text: "No changes to update" })
        setIsSubmitting(false)
        return
      }

      const result = await onUpdateTeam(updates)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        setIsEditing(false)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Team Settings</h3>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
          ) : (
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
          )}
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {isEditing ? (
            <div className="flex flex-col items-center mb-6">
              <TeamLogoUpload teamId={team.id} logoUrl={formData.logo_url} onLogoChange={handleLogoChange} />
              <p className="text-sm text-[#94a3b8] mt-2">Upload team logo</p>
            </div>
          ) : (
            formData.logo_url && (
              <div className="flex justify-center mb-6">
                <div className="h-32 w-32 rounded-full bg-[#0f172a] overflow-hidden">
                  <img
                    src={formData.logo_url || "/placeholder.svg"}
                    alt={team.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )
          )}

          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                ) : (
                  <p className="text-[#f8fafc] p-2 bg-[#0f172a] rounded-md">{formData.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                {isEditing ? (
                  <Input
                    id="division"
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                ) : (
                  <p className="text-[#f8fafc] p-2 bg-[#0f172a] rounded-md">{formData.division}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="home_court">Home Court</Label>
              {isEditing ? (
                <Input
                  id="home_court"
                  name="home_court"
                  value={formData.home_court}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., Main Arena"
                />
              ) : (
                <p className="text-[#f8fafc] p-2 bg-[#0f172a] rounded-md">{formData.home_court || "Not specified"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Team Description</Label>
              {isEditing ? (
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about your team..."
                  className="w-full rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                  rows={4}
                />
              ) : (
                <p className="text-[#f8fafc] p-2 bg-[#0f172a] rounded-md min-h-[80px]">
                  {formData.description || "No description provided"}
                </p>
              )}
            </div>
          </div>

          {/* Pending Invitations Section */}
          {isEditing && pendingInvites.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-[#f8fafc]">Pending Invitations</h4>
              <div className="space-y-2">
                {pendingInvites.map(invite => (
                  <div key={invite.id} className="flex items-center justify-between p-2 border-b border-[#1e293b]">
                    <span className="text-[#94a3b8]">{invite.email} ({invite.role})</span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleResend(invite)} disabled={inviteLoading}>Resend</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(invite.id)} disabled={inviteLoading}>Cancel</Button>
                    </div>
                  </div>
                ))}
                {inviteMessage && <div className="text-green-500 text-sm mt-2">{inviteMessage}</div>}
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
} 
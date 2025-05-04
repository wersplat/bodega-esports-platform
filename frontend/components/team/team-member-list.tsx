"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserPlus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { TeamMember } from "@/types/team"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TeamMemberListProps {
  members: TeamMember[]
  isAdmin: boolean
  onAddMember: (data: {
    email: string
    role: "player" | "coach" | "manager"
    position?: string
    jersey_number?: number
  }) => Promise<{ success: boolean; message: string }>
  onUpdateMember: (
    memberId: string,
    updates: {
      role?: "captain" | "coach" | "player" | "manager"
      position?: string
      jersey_number?: number
      status?: "active" | "injured" | "inactive"
    },
  ) => Promise<{ success: boolean; message: string }>
  onRemoveMember: (memberId: string) => Promise<{ success: boolean; message: string }>
}

export function TeamMemberList({ members, isAdmin, onAddMember, onUpdateMember, onRemoveMember }: TeamMemberListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state for adding a new member
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"player" | "coach" | "manager">("player")
  const [newMemberPosition, setNewMemberPosition] = useState("")
  const [newMemberJerseyNumber, setNewMemberJerseyNumber] = useState("")

  // Form state for editing a member
  const [editRole, setEditRole] = useState<"captain" | "coach" | "player" | "manager">("player")
  const [editPosition, setEditPosition] = useState("")
  const [editJerseyNumber, setEditJerseyNumber] = useState("")
  const [editStatus, setEditStatus] = useState<"active" | "injured" | "inactive">("active")

  const handleAddMember = async () => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await onAddMember({
        email: newMemberEmail,
        role: newMemberRole,
        position: newMemberPosition || undefined,
        jersey_number: newMemberJerseyNumber ? Number.parseInt(newMemberJerseyNumber) : undefined,
      })

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Reset form
        setNewMemberEmail("")
        setNewMemberRole("player")
        setNewMemberPosition("")
        setNewMemberJerseyNumber("")
        // Close dialog after a short delay
        setTimeout(() => {
          setIsAddDialogOpen(false)
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditMember = async () => {
    if (!selectedMember) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const updates: any = {}
      if (editRole !== selectedMember.role) updates.role = editRole
      if (editPosition !== selectedMember.position) updates.position = editPosition || null
      if (editJerseyNumber !== String(selectedMember.jersey_number)) {
        updates.jersey_number = editJerseyNumber ? Number.parseInt(editJerseyNumber) : null
      }
      if (editStatus !== selectedMember.status) updates.status = editStatus

      // Only update if there are changes
      if (Object.keys(updates).length === 0) {
        setMessage({ type: "error", text: "No changes to update" })
        setIsSubmitting(false)
        return
      }

      const result = await onUpdateMember(selectedMember.id, updates)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Close dialog after a short delay
        setTimeout(() => {
          setIsEditDialogOpen(false)
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!selectedMember) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await onRemoveMember(selectedMember.id)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Close dialog after a short delay
        setTimeout(() => {
          setIsRemoveDialogOpen(false)
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setEditRole(member.role)
    setEditPosition(member.position || "")
    setEditJerseyNumber(member.jersey_number ? String(member.jersey_number) : "")
    setEditStatus(member.status)
    setIsEditDialogOpen(true)
  }

  const openRemoveDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setIsRemoveDialogOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Team Members ({members.length})</h3>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Enter the email address of the user you want to add to your team.</DialogDescription>
              </DialogHeader>

              {message && (
                <div
                  className={`p-3 rounded-md ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {message.text}
                </div>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="col-span-3"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <select
                    id="role"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as any)}
                    className="col-span-3 h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                  >
                    <option value="player">Player</option>
                    <option value="coach">Coach</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Position
                  </Label>
                  <Input
                    id="position"
                    value={newMemberPosition}
                    onChange={(e) => setNewMemberPosition(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Point Guard"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="jersey" className="text-right">
                    Jersey #
                  </Label>
                  <Input
                    id="jersey"
                    type="number"
                    value={newMemberJerseyNumber}
                    onChange={(e) => setNewMemberJerseyNumber(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., 23"
                    min="0"
                    max="99"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember} disabled={isSubmitting || !newMemberEmail}>
                  {isSubmitting ? "Adding..." : "Add Member"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Position</TableHead>
              <TableHead className="text-center">Jersey #</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                      {member.user.avatar_url ? (
                        <Image
                          src={member.user.avatar_url || "/placeholder.svg"}
                          alt={member.user.full_name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-xs text-[#94a3b8]">
                          {member.user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href={`/profile/${member.user_id}`} className="font-medium hover:text-[#e11d48]">
                        {member.user.full_name}
                      </Link>
                      <p className="text-xs text-[#94a3b8]">@{member.user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      member.role === "captain"
                        ? "bg-[#e11d48]/10 text-[#e11d48]"
                        : member.role === "coach"
                          ? "bg-blue-500/10 text-blue-500"
                          : member.role === "manager"
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-[#0f172a] text-[#94a3b8]"
                    }`}
                  >
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{member.position || "-"}</TableCell>
                <TableCell className="text-center">{member.jersey_number || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      member.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : member.status === "injured"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-[#0f172a] text-[#94a3b8]"
                    }`}
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openEditDialog(member)}
                        disabled={member.role === "captain" && member.role !== "captain"}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#e11d48]"
                        onClick={() => openRemoveDialog(member)}
                        disabled={member.role === "captain"}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-8 text-[#94a3b8]">
                  No team members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update the details for {selectedMember?.user.full_name}</DialogDescription>
          </DialogHeader>

          {message && (
            <div
              className={`p-3 rounded-md ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
            >
              {message.text}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <select
                id="edit-role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as any)}
                className="col-span-3 h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                disabled={selectedMember?.role === "captain"}
              >
                <option value="player">Player</option>
                <option value="coach">Coach</option>
                <option value="manager">Manager</option>
                <option value="captain">Captain</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-position" className="text-right">
                Position
              </Label>
              <Input
                id="edit-position"
                value={editPosition}
                onChange={(e) => setEditPosition(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Point Guard"
                disabled={selectedMember?.role === "captain"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-jersey" className="text-right">
                Jersey #
              </Label>
              <Input
                id="edit-jersey"
                type="number"
                value={editJerseyNumber}
                onChange={(e) => setEditJerseyNumber(e.target.value)}
                className="col-span-3"
                placeholder="e.g., 23"
                min="0"
                max="99"
                disabled={selectedMember?.role === "captain"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <select
                id="edit-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="col-span-3 h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                disabled={selectedMember?.role === "captain"}
              >
                <option value="active">Active</option>
                <option value="injured">Injured</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember} disabled={isSubmitting || selectedMember?.role === "captain"}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedMember?.user.full_name} from the team?
            </DialogDescription>
          </DialogHeader>

          {message && (
            <div
              className={`p-3 rounded-md ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
            >
              {message.text}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRemoveMember} disabled={isSubmitting || selectedMember?.role === "captain"}>
              {isSubmitting ? "Removing..." : "Remove Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
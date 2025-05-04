"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
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
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

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
  // ... existing code from esport2.0 ...
} 
"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Save } from "lucide-react"
import { TeamLogoUpload } from "./team-logo-upload"
import type { Team } from "@/types/team"

interface TeamSettingsProps {
  team: Team
  isAdmin: boolean
  onUpdateTeam: (updates: Partial<Team>) => Promise<{ success: boolean; message: string }>
}

export function TeamSettings({ team, isAdmin, onUpdateTeam }: TeamSettingsProps) {
  // ... existing code from esport2.0 ...
} 
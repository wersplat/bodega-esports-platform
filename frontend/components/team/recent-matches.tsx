"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Match {
  id: string
  opponent: string
  date: string
  pts: number
  ast: number
  reb: number
  stl: number
  blk: number
}

interface RecentMatchesProps {
  userId: string
}

export function RecentMatches({ userId }: RecentMatchesProps) {
  // ... existing code from esport2.0 ...
} 
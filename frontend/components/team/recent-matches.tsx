"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import React, { useEffect, useState } from "react";
// TODO: Replace Supabase logic with backend API calls
import type { RecentMatch } from "@/types/match";

interface RecentMatchesProps {
  userId: string
}

export const RecentMatches: React.FC<RecentMatchesProps> = ({ userId }) => {
  const [matches, setMatches] = useState<RecentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentMatches() {
      try {
        setIsLoading(true)
        setError(null)

        // TODO: Replace with actual backend endpoint to fetch recent matches
        const response = await fetch(`/api/matches/recent?userId=${userId}&limit=5`)
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "Failed to load match data")
        if (result.data) {
          // Transform the data to match our RecentMatch interface
          const formattedMatches = result.data.map((item: any) => ({
            id: item.id,
            opponent: item.opponent,
            date: new Date(item.date).toLocaleDateString(),
            pts: item.pts,
            ast: item.ast,
            reb: item.reb,
            stl: item.stl,
            blk: item.blk,
          }))
          setMatches(formattedMatches)
        }
      } catch (error) {
        setError("Failed to load match data")
        console.error("Error fetching recent matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentMatches()
  }, [userId])

  // Sample data for demonstration
  const sampleMatches = [
    { id: "1", opponent: "Team Beta", date: "May 10, 2023", pts: 22, ast: 6, reb: 3, stl: 2, blk: 0 },
    { id: "2", opponent: "Team Gamma", date: "May 5, 2023", pts: 15, ast: 4, reb: 5, stl: 1, blk: 1 },
    { id: "3", opponent: "Team Delta", date: "April 28, 2023", pts: 19, ast: 7, reb: 4, stl: 3, blk: 0 },
    { id: "4", opponent: "Team Epsilon", date: "April 22, 2023", pts: 24, ast: 3, reb: 6, stl: 1, blk: 1 },
    { id: "5", opponent: "Team Zeta", date: "April 15, 2023", pts: 12, ast: 6, reb: 3, stl: 2, blk: 0 },
  ]

  // Use sample data if no real data is available
  const displayMatches = matches.length > 0 ? matches : sampleMatches

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opponent</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">PTS</TableHead>
              <TableHead className="text-right">AST</TableHead>
              <TableHead className="text-right">REB</TableHead>
              <TableHead className="text-right">STL</TableHead>
              <TableHead className="text-right">BLK</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">{match.opponent}</TableCell>
                <TableCell>{match.date}</TableCell>
                <TableCell className="text-right">{match.pts}</TableCell>
                <TableCell className="text-right">{match.ast}</TableCell>
                <TableCell className="text-right">{match.reb}</TableCell>
                <TableCell className="text-right">{match.stl}</TableCell>
                <TableCell className="text-right">{match.blk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t border-[#0f172a] text-center">
        <Link href="/stats" className="text-[#e11d48] text-sm hover:underline">
          View all match stats
        </Link>
      </div>
    </>
  )
} 
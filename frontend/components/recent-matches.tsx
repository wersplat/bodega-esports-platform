"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentMatches() {
      try {
        setIsLoading(true)

        const { data, error } = await supabase
          .from("player_match_stats")
          .select(`
            id,
            matches(id, date, home_team, away_team),
            points,
            assists,
            rebounds,
            steals,
            blocks
          `)
          .eq("player_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          throw error
        }

        if (data) {
          // Transform the data to match our Match interface
          const formattedMatches = data.map((item: any) => {
            const match = item.matches as any
            const isHomeTeam = match.home_team !== "Team Alpha" // Placeholder logic

            return {
              id: item.id,
              opponent: isHomeTeam ? match.away_team : match.home_team,
              date: new Date(match.date).toLocaleDateString(),
              pts: item.points,
              ast: item.assists,
              reb: item.rebounds,
              stl: item.steals,
              blk: item.blocks,
            }
          })

          setMatches(formattedMatches)
        }
      } catch (error) {
        // console.error("Error fetching recent matches:", error)
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
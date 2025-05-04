"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { supabase } from "@/lib/supabase"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PerformanceData {
  game: string
  points: number
  assists: number
  rebounds: number
}

interface PerformanceChartProps {
  userId: string
}

export function PerformanceChart({ userId }: PerformanceChartProps) {
  const [data, setData] = useState<PerformanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        setIsLoading(true)

        const { data, error } = await supabase
          .from("player_match_stats")
          .select(`
            matches(date, home_team, away_team),
            points,
            assists,
            rebounds
          `)
          .eq("player_id", userId)
          .order("created_at", { ascending: true })
          .limit(10)

        if (error) {
          throw error
        }

        if (data) {
          // Transform the data for the chart
          const chartData = data.map((item: any, index: number) => {
            const match = item.matches as any
            const opponent = match.home_team === "Team Alpha" ? match.away_team : match.home_team

            return {
              game: `Game ${index + 1}`,
              gameLabel: `vs ${opponent}`,
              points: item.points,
              assists: item.assists,
              rebounds: item.rebounds,
            }
          })

          setData(chartData)
        }
      } catch (error) {
        console.error("Error fetching performance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformanceData()
  }, [userId])

  // Sample data for demonstration
  const sampleData = [
    { game: "Game 1", gameLabel: "vs Team Beta", points: 22, assists: 6, rebounds: 3 },
    { game: "Game 2", gameLabel: "vs Team Gamma", points: 15, assists: 4, rebounds: 5 },
    { game: "Game 3", gameLabel: "vs Team Delta", points: 19, assists: 7, rebounds: 4 },
    { game: "Game 4", gameLabel: "vs Team Epsilon", points: 24, assists: 3, rebounds: 6 },
    { game: "Game 5", gameLabel: "vs Team Zeta", points: 12, assists: 6, rebounds: 3 },
    { game: "Game 6", gameLabel: "vs Team Eta", points: 18, assists: 5, rebounds: 7 },
    { game: "Game 7", gameLabel: "vs Team Theta", points: 21, assists: 4, rebounds: 5 },
    { game: "Game 8", gameLabel: "vs Team Iota", points: 17, assists: 8, rebounds: 4 },
    { game: "Game 9", gameLabel: "vs Team Kappa", points: 25, assists: 3, rebounds: 6 },
    { game: "Game 10", gameLabel: "vs Team Lambda", points: 20, assists: 5, rebounds: 5 },
  ]

  // Use sample data if no real data is available
  const displayData = data.length > 0 ? data : sampleData

  return (
    <div className="h-64">
      <ChartContainer
        config={{
          points: {
            label: "Points",
            color: "hsl(var(--chart-1))",
          },
          assists: {
            label: "Assists",
            color: "hsl(var(--chart-2))",
          },
          rebounds: {
            label: "Rebounds",
            color: "hsl(var(--chart-3))",
          },
        }}
        className="h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="game" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="points" stroke="var(--color-points)" name="Points" />
            <Line type="monotone" dataKey="assists" stroke="var(--color-assists)" name="Assists" />
            <Line type="monotone" dataKey="rebounds" stroke="var(--color-rebounds)" name="Rebounds" />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
} 
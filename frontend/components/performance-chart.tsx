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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        setIsLoading(true)
        setError(null)

        const { data: stats, error } = await supabase
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

        if (stats) {
          // Transform the data for the chart
          const chartData = stats.map((item: any, index: number) => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch performance data")
        console.error("Error fetching performance data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPerformanceData()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 rounded-lg border border-red-200">
        {error}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No performance data available
      </div>
    )
  }

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
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
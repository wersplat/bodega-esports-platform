import type { UserStats } from "@/types/user"

interface StatsDisplayProps {
  stats: UserStats
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  const statItems = [
    { label: "PTS", value: stats.points_per_game },
    { label: "AST", value: stats.assists_per_game },
    { label: "REB", value: stats.rebounds_per_game },
    { label: "STL", value: stats.steals_per_game },
    { label: "BLK", value: stats.blocks_per_game },
  ]

  return (
    <div className="mt-6 w-full">
      <h3 className="font-medium mb-2">Season Averages</h3>
      <div className="grid grid-cols-5 gap-2 text-center">
        {statItems.map(({ label, value }) => (
          <div key={label} className="bg-[#0f172a] p-2 rounded-md">
            <p className="text-lg font-bold">{value.toFixed(1)}</p>
            <p className="text-xs text-[#94a3b8]">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center">
        <p className="text-xs text-[#94a3b8]">Games Played: {stats.games_played}</p>
      </div>
    </div>
  )
} 
import type { TeamStats } from '@/types/team';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TeamStatsDisplayProps {
  stats: TeamStats
}

export function TeamStatsDisplay({ stats }: TeamStatsDisplayProps) {
  const winPercentage =
    stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : "0.0"

  // Prepare data for charts
  const chartData = [
    { name: 'Wins', value: stats.wins },
    { name: 'Losses', value: stats.losses },
    { name: 'PPG', value: stats.points_per_game },
    { name: 'APG', value: stats.assists_per_game },
    { name: 'RPG', value: stats.rebounds_per_game },
    { name: 'SPG', value: stats.steals_per_game },
    { name: 'BPG', value: stats.blocks_per_game },
  ]

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Team Statistics</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0f172a] rounded-lg p-4 text-center">
            <p className="text-[#94a3b8] text-sm">Record</p>
            <p className="text-2xl font-bold">
              {stats.wins}-{stats.losses}
            </p>
            <p className="text-[#94a3b8] text-xs">{winPercentage}% Win Rate</p>
          </div>

          <div className="bg-[#0f172a] rounded-lg p-4 text-center">
            <p className="text-[#94a3b8] text-sm">Points Per Game</p>
            <p className="text-2xl font-bold">{(stats.points_per_game ?? 0).toFixed(1)}</p>
            <div className="h-1 w-full bg-[#1e293b] mt-2">
              <div
                className="h-full bg-[#e11d48]"
                style={{ width: `${Math.min(((stats.points_per_game ?? 0) / 150) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold">{(stats.assists_per_game ?? 0).toFixed(1)}</p>
            <p className="text-xs text-[#94a3b8]">AST</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{(stats.rebounds_per_game ?? 0).toFixed(1)}</p>
            <p className="text-xs text-[#94a3b8]">REB</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{(stats.steals_per_game ?? 0).toFixed(1)}</p>
            <p className="text-xs text-[#94a3b8]">STL</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{(stats.blocks_per_game ?? 0).toFixed(1)}</p>
            <p className="text-xs text-[#94a3b8]">BLK</p>
          </div>
        </div>

        <div className="w-full h-64 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.slice(2)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0f172a', border: 'none', color: '#f8fafc' }} />
              <Legend wrapperStyle={{ color: '#f8fafc' }} />
              <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
} 
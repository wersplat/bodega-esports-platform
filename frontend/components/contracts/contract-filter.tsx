import { Label } from "@/components/ui/label"
import React from "react"

interface ContractFilterProps {
  teams: { id: string; name: string }[]
  players: { id: string; username: string }[]
  selectedTeam: string
  selectedPlayer: string
  selectedSeason: string
  selectedStatus: string
  onChange: (filters: {
    team: string
    player: string
    season: string
    status: string
  }) => void
}

export function ContractFilter({
  teams,
  players,
  selectedTeam,
  selectedPlayer,
  selectedSeason,
  selectedStatus,
  onChange,
}: ContractFilterProps) {
  // For demo, static seasons. Replace with dynamic if needed.
  const seasons = [
    { value: "2023", label: "2023 Season" },
    { value: "2022", label: "2022 Season" },
    { value: "2021", label: "2021 Season" },
  ]
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "expired", label: "Expired" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    onChange({
      team: name === "team" ? value : selectedTeam,
      player: name === "player" ? value : selectedPlayer,
      season: name === "season" ? value : selectedSeason,
      status: name === "status" ? value : selectedStatus,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Label htmlFor="team-filter" className="text-sm font-medium mb-1 block">
          Team
        </Label>
        <select
          id="team-filter"
          name="team"
          value={selectedTeam}
          onChange={handleChange}
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <Label htmlFor="player-filter" className="text-sm font-medium mb-1 block">
          Player
        </Label>
        <select
          id="player-filter"
          name="player"
          value={selectedPlayer}
          onChange={handleChange}
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          <option value="">All Players</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>{player.username}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <Label htmlFor="season-filter" className="text-sm font-medium mb-1 block">
          Season
        </Label>
        <select
          id="season-filter"
          name="season"
          value={selectedSeason}
          onChange={handleChange}
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          <option value="">All Seasons</option>
          {seasons.map((season) => (
            <option key={season.value} value={season.value}>{season.label}</option>
          ))}
        </select>
      </div>

      <div className="relative">
        <Label htmlFor="status-filter" className="text-sm font-medium mb-1 block">
          Status
        </Label>
        <select
          id="status-filter"
          name="status"
          value={selectedStatus}
          onChange={handleChange}
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

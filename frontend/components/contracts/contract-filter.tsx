import { Label } from "@/components/ui/label"

export function ContractFilter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Label htmlFor="team-filter" className="text-sm font-medium mb-1 block">
          Team
        </Label>
        <select
          id="team-filter"
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          <option value="">All Teams</option>
          <option value="team-alpha">Team Alpha</option>
          <option value="team-beta">Team Beta</option>
          <option value="team-gamma">Team Gamma</option>
          <option value="team-delta">Team Delta</option>
        </select>
      </div>

      <div className="relative">
        <Label htmlFor="player-filter" className="text-sm font-medium mb-1 block">
          Player
        </Label>
        <select
          id="player-filter"
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          <option value="">All Players</option>
          <option value="john-doe">John Doe</option>
          <option value="jane-smith">Jane Smith</option>
          <option value="mike-johnson">Mike Johnson</option>
          <option value="sarah-williams">Sarah Williams</option>
        </select>
      </div>

      <div className="relative">
        <Label htmlFor="season-filter" className="text-sm font-medium mb-1 block">
          Season
        </Label>
        <select
          id="season-filter"
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          <option value="2023">2023 Season</option>
          <option value="2022">2022 Season</option>
          <option value="2021">2021 Season</option>
        </select>
      </div>

      <div className="relative">
        <Label htmlFor="status-filter" className="text-sm font-medium mb-1 block">
          Status
        </Label>
        <select
          id="status-filter"
          className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
        </select>
      </div>
    </div>
  )
}

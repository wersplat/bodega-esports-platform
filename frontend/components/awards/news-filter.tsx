import { Search } from "lucide-react"
import { Input } from "../ui/input"

export function NewsFilter() {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#94a3b8]" />
        <Input placeholder="Search..." className="pl-8 bg-[#1e293b] border-[#0f172a] text-[#f8fafc] w-full sm:w-auto" />
      </div>

      <select className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
        <option value="">All Categories</option>
        <option value="team-news">Team News</option>
        <option value="transfers">Transfers</option>
        <option value="events">Events</option>
        <option value="league-updates">League Updates</option>
      </select>

      <select className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
        <option value="">All Time</option>
        <option value="this-week">This Week</option>
        <option value="this-month">This Month</option>
        <option value="this-year">This Year</option>
      </select>
    </div>
  )
} 
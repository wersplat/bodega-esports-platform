"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTeam } from "@/hooks/use-team"
import { useAuth } from "@/components/auth/auth-provider"
import { TeamMemberList } from "@/components/team/team-member-list"
import { TeamStatsDisplay } from "@/components/team/team-stats"
import { TeamSettings } from "@/components/team/team-settings"
import { Plus, Users } from "lucide-react"

export default function TeamManagementPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const {
    team,
    members,
    stats,
    isLoading,
    error,
    isTeamAdmin,
    addTeamMember,

    removeTeamMember,
    updateTeam,
  } = useTeam()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#e11d48] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#94a3b8]">Loading team data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Team</h2>
          <p className="text-[#94a3b8] mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-[#94a3b8]">You are not part of any team yet</p>
          </div>
        </div>

        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-[#0f172a] p-4 rounded-full mb-4">
              <Users className="h-12 w-12 text-[#94a3b8]" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Team Found</h2>
            <p className="text-[#94a3b8] mb-6 max-w-md">
              You are not currently part of any team. You can create a new team or ask a team captain to add you to their team.
            </p>
            <Button onClick={() => router.push("/teams/create")}> 
              <Plus className="mr-2 h-4 w-4" />
              Create New Team
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-[#94a3b8]">Manage your team roster and settings</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <div className="flex flex-col items-center p-6">
            <div className="relative mb-4">
              <div className="h-32 w-32 rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                {team.logo_url ? (
                  <img
                    src={team.logo_url || "/placeholder.svg"}
                    alt={team.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-4xl font-bold text-[#94a3b8]">{team.name.substring(0, 2).toUpperCase()}</div>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold">{team.name}</h2>
            <p className="text-[#94a3b8]">{team.division} Division</p>

            <div className="mt-4 w-full">
              <div className="flex justify-between py-2 border-b border-[#0f172a]">
                <span className="text-[#94a3b8]">Record</span>
                <span>
                  {stats?.wins || 0}-{stats?.losses || 0}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0f172a]">
                <span className="text-[#94a3b8]">Season</span>
                <span>2023</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0f172a]">
                <span className="text-[#94a3b8]">Players</span>
                <span>{members.filter((m) => m.role === "player").length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#0f172a]">
                <span className="text-[#94a3b8]">Home Court</span>
                <span>{team.home_court || "Not specified"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#94a3b8]">Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>

            {team.description && (
              <div className="mt-4 w-full">
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-sm text-[#94a3b8]">{team.description}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="p-6">
            <TeamMemberList
              members={members}
              isAdmin={isTeamAdmin}
              onAddMember={addTeamMember}
              onRemoveMember={removeTeamMember}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TeamStatsDisplay
          stats={
            stats || {
              team_id: '',
              team_name: '',
              matches_played: 0,
              wins: 0,
              losses: 0,
              draws: 0,
              win_rate: 0,
              points_scored: 0,
              points_conceded: 0,
              point_differential: 0,
              current_streak: 0,
              longest_streak: 0,
              home_record: { wins: 0, losses: 0, draws: 0 },
              away_record: { wins: 0, losses: 0, draws: 0 },
              last_5_matches: [],
              points_per_game: 0,
              assists_per_game: 0,
              rebounds_per_game: 0,
              steals_per_game: 0,
              blocks_per_game: 0,
            }
          }
        />

        <TeamSettings team={team} isAdmin={isTeamAdmin} onUpdateTeam={updateTeam} />
      </div>
    </div>
  )
} 
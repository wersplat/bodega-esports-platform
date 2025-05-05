"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Contract } from "@/types/contract"
import { ContractsTable } from "@/components/contracts/contracts-table"
import { ContractModal } from "@/components/contracts/contract-modal"
import { ContractFilter } from "@/components/contracts/contract-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import { useAuth } from "@/components/auth/auth-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ContractsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  // New: filter options and state
  const [teams, setTeams] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")

  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)

  const { user } = useAuth()
  const [isContractAdmin, setIsContractAdmin] = useState(false)

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)

  // Fetch teams and players for filter options
  useEffect(() => {
    async function fetchTeamsAndPlayers() {
      const { data: teamData } = await supabase.from("teams").select("id, name")
      setTeams(teamData || [])
      const { data: playerData } = await supabase.from("profiles").select("id, username")
      setPlayers(playerData || [])
    }
    fetchTeamsAndPlayers()
  }, [])

  // Fetch user role for contracts management
  useEffect(() => {
    async function fetchUserRole() {
      if (!user) return setIsContractAdmin(false)
      // Check if user is a captain, manager, or coach in any team
      const { data: memberships } = await supabase
        .from("team_members")
        .select("role")
        .eq("user_id", user.id)
      if (memberships && memberships.some((m: any) => ["captain", "manager", "coach"].includes(m.role))) {
        setIsContractAdmin(true)
      } else {
        setIsContractAdmin(false)
      }
    }
    fetchUserRole()
  }, [user])

  // Fetch contracts with filters and pagination
  const fetchContracts = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from("contracts")
      .select(`
        id,
        player:player_id (
          id,
          name,
          avatar,
          tag
        ),
        team:team_id (
          id,
          name,
          logo
        ),
        startDate,
        endDate,
        salary,
        status,
        fileUrl
      `, { count: "exact" })

    if (selectedTeam) query = query.eq("team_id", selectedTeam)
    if (selectedPlayer) query = query.eq("player_id", selectedPlayer)
    if (selectedStatus) query = query.eq("status", selectedStatus)
    if (selectedSeason) query = query.eq("season", selectedSeason)

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) {
      setContracts([])
      setTotalCount(0)
    } else {
      const fixedContracts = (data as any[]).map((contract) => ({
        ...contract,
        player: Array.isArray(contract.player) ? contract.player[0] : contract.player,
        team: Array.isArray(contract.team) ? contract.team[0] : contract.team,
      }))
      setContracts(fixedContracts as Contract[])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [selectedTeam, selectedPlayer, selectedStatus, selectedSeason, page])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  async function handleSaveContract(contractData: Partial<Contract>) {
    let result
    if (editingContract) {
      result = await supabase
        .from("contracts")
        .update(contractData)
        .eq("id", editingContract.id)
        .select()
    } else {
      result = await supabase
        .from("contracts")
        .insert([contractData])
        .select()
    }
    setIsModalOpen(false)
    setEditingContract(null)
    fetchContracts()
    return result
  }

  async function handleDeleteContract(contractId: string) {
    const contract = contracts.find((c) => c.id === contractId) || null
    setContractToDelete(contract)
    setConfirmDeleteOpen(true)
  }

  async function confirmDelete() {
    if (contractToDelete) {
      await supabase.from("contracts").delete().eq("id", contractToDelete.id)
      setContractToDelete(null)
      setConfirmDeleteOpen(false)
      fetchContracts()
    }
  }

  const handleNewContract = () => {
    setEditingContract(null)
    setIsModalOpen(true)
  }

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract)
    setIsModalOpen(true)
  }

  // New: handle filter change
  const handleFilterChange = (filters: {
    team: string
    player: string
    season: string
    status: string
  }) => {
    setSelectedTeam(filters.team)
    setSelectedPlayer(filters.player)
    setSelectedSeason(filters.season)
    setSelectedStatus(filters.status)
    setPage(1)
  }

  if (loading) return <div className="text-[#cbd5e1]">Loading contracts…</div>

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Contracts Management</h1>
          {isContractAdmin && (
            <Button onClick={handleNewContract} className="bg-[#e11d48] hover:bg-[#e11d48]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          )}
        </div>

        <div className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-[#0f172a]">
            <ContractFilter
              teams={teams}
              players={players}
              selectedTeam={selectedTeam}
              selectedPlayer={selectedPlayer}
              selectedSeason={selectedSeason}
              selectedStatus={selectedStatus}
              onChange={handleFilterChange}
            />
          </div>
          <div className="overflow-x-auto">
            <ContractsTable
              contracts={contracts}
              onEditContract={isContractAdmin ? handleEditContract : undefined}
              onDeleteContract={isContractAdmin ? handleDeleteContract : undefined}
              isContractAdmin={isContractAdmin}
            />
          </div>
          {/* Pagination Controls */}
          <div className="p-4 flex justify-end">
            <button
              className="px-3 py-1 rounded bg-[#0f172a] text-[#f8fafc] border border-[#1e293b] mr-2 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-2 text-[#94a3b8]">Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}</span>
            <button
              className="px-3 py-1 rounded bg-[#0f172a] text-[#f8fafc] border border-[#1e293b] ml-2 disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(totalCount / pageSize)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Confirmation Dialog for Terminate */}
        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Terminate Contract</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Are you sure you want to terminate this contract?
              <div className="mt-2 text-xs text-[#94a3b8]">
                {contractToDelete && (
                  <>
                    <div><b>Player:</b> {contractToDelete.player.name}</div>
                    <div><b>Team:</b> {contractToDelete.team.name}</div>
                    <div><b>Start:</b> {contractToDelete.startDate}</div>
                    <div><b>End:</b> {contractToDelete.endDate}</div>
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Terminate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ContractModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingContract(null)
          }}
          contract={editingContract}
          onSave={handleSaveContract}
          isContractAdmin={isContractAdmin}
        />
      </div>
    </div>
  )
} 
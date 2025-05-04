"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Contract } from "@/types/contract"
import { ContractsTable } from "@/components/contracts/contracts-table"
import { ContractModal } from "@/components/contracts/contract-modal"
import { ContractFilter } from "@/components/contracts/contract-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ContractsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  async function fetchContracts() {
    setLoading(true)
    const { data, error } = await supabase
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
      `)
    if (error) {
      setContracts([])
    } else {
      const fixedContracts = (data as any[]).map((contract) => ({
        ...contract,
        player: Array.isArray(contract.player) ? contract.player[0] : contract.player,
        team: Array.isArray(contract.team) ? contract.team[0] : contract.team,
      }))
      setContracts(fixedContracts as Contract[])
    }
    setLoading(false)
  }

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
    await supabase.from("contracts").delete().eq("id", contractId)
    fetchContracts()
  }

  const handleNewContract = () => {
    setEditingContract(null)
    setIsModalOpen(true)
  }

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract)
    setIsModalOpen(true)
  }

  if (loading) return <div className="text-[#cbd5e1]">Loading contracts…</div>

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Contracts Management</h1>
          <Button onClick={handleNewContract} className="bg-[#e11d48] hover:bg-[#e11d48]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>

        <div className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-[#0f172a]">
            <ContractFilter />
          </div>
          <div className="overflow-x-auto">
            <ContractsTable
              contracts={contracts}
              onEditContract={handleEditContract}
              onDeleteContract={handleDeleteContract}
            />
          </div>
        </div>

        <ContractModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingContract(null)
          }}
          contract={editingContract}
          onSave={handleSaveContract}
        />
      </div>
    </div>
  )
} 
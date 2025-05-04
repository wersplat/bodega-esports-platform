"use client"

import { useState } from "react"
import { ContractsTable } from "@/components/contracts/contracts-table"
import { ContractModal } from "@/components/contracts/contract-modal"
import { ContractFilter } from "@/components/contracts/contract-filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ContractsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<any>(null)

  const handleNewContract = () => {
    setEditingContract(null)
    setIsModalOpen(true)
  }

  const handleEditContract = (contract: any) => {
    setEditingContract(contract)
    setIsModalOpen(true)
  }

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
            <ContractsTable onEditContract={handleEditContract} />
          </div>
        </div>

        <ContractModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} contract={editingContract} />
      </div>
    </div>
  )
} 
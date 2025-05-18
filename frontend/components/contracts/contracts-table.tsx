"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, AlertTriangle, FileText } from "lucide-react"
import Image from "next/image"
import type { Contract } from "@/types/contract"


interface ContractsTableProps {
  contracts: Contract[]
  onEditContract?: (_contract: Contract) => void
  onDeleteContract?: (_contractId: string) => void
  isContractAdmin?: boolean
}

export function ContractsTable({ contracts, onEditContract, onDeleteContract, isContractAdmin, isLoading = false, error }: ContractsTableProps & { isLoading?: boolean; error?: string | null }) {
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  const getStatusColor = (status: string): string => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "expired":
        return "bg-[#94a3b8]/10 text-[#94a3b8] border-[#94a3b8]/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-[#0f172a]">
          <TableHead className="text-[#94a3b8]">Contract ID</TableHead>
          <TableHead className="text-[#94a3b8]">Player</TableHead>
          <TableHead className="text-[#94a3b8]">Team</TableHead>
          <TableHead className="text-[#94a3b8]">Start Date</TableHead>
          <TableHead className="text-[#94a3b8]">End Date</TableHead>
          <TableHead className="text-[#94a3b8]">Salary</TableHead>
          <TableHead className="text-[#94a3b8]">Status</TableHead>
          {isContractAdmin && <TableHead className="text-[#94a3b8] text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isContractAdmin ? 8 : 7} className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-4xl">📄</div>
                <div className="text-lg font-semibold text-[#94a3b8]">No contracts found</div>
                {isContractAdmin && onEditContract && (
                  <Button className="bg-[#e11d48] text-white" onClick={() => onEditContract(undefined as any)}>
                    Create new contract
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          contracts.map((contract) => (
            <TableRow key={contract.id} className="border-b border-[#0f172a]/50">
              <TableCell className="font-medium">{contract.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-[#0f172a]">
                    <Image
                      src={contract.player.avatar || "/placeholder.svg"}
                      alt={contract.player.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{contract.player.name}</div>
                    <div className="text-xs text-[#94a3b8]">@{contract.player.tag}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-[#0f172a] flex items-center justify-center">
                    <Image
                      src={contract.team.logo || "/placeholder.svg"}
                      alt={contract.team.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span>{contract.team.name}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(contract.startDate)}</TableCell>
              <TableCell>{formatDate(contract.endDate)}</TableCell>
              <TableCell>{contract.salary}</TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(contract.status)} capitalize`}>{contract.status}</Badge>
              </TableCell>
              {isContractAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onEditContract && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEditContract(contract)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
                    {onDeleteContract && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-yellow-500" onClick={() => onDeleteContract(contract.id)}>
                        <AlertTriangle className="h-4 w-4" />
                        <span className="sr-only">Terminate</span>
                      </Button>
                    )}
                    {contract.fileUrl ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#94a3b8]"
                        asChild
                      >
                        <a href={contract.fileUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Download/View Contract</span>
                        </a>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#94a3b8] opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">No Contract File</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

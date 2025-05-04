"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  contract?: any
}

export function ContractModal({ isOpen, onClose, contract }: ContractModalProps) {
  const [formData, setFormData] = useState({
    player: "",
    team: "",
    startDate: "",
    endDate: "",
    salary: "",
    file: null as File | null,
  })

  useEffect(() => {
    if (contract) {
      setFormData({
        player: contract.player.name,
        team: contract.team.name,
        startDate: contract.startDate,
        endDate: contract.endDate,
        salary: contract.salary.replace("$", ""),
        file: null,
      })
    } else {
      setFormData({
        player: "",
        team: "",
        startDate: "",
        endDate: "",
        salary: "",
        file: null,
      })
    }
  }, [contract])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1e293b] text-[#f8fafc] border-[#0f172a] max-w-md md:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{contract ? "Edit Contract" : "New Contract"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="player" className="text-sm font-medium">
              Player
            </Label>
            <select
              id="player"
              name="player"
              value={formData.player}
              onChange={handleInputChange}
              className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
              required
            >
              <option value="">Select Player</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Mike Johnson">Mike Johnson</option>
              <option value="Sarah Williams">Sarah Williams</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team" className="text-sm font-medium">
              Team
            </Label>
            <select
              id="team"
              name="team"
              value={formData.team}
              onChange={handleInputChange}
              className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
              required
            >
              <option value="">Select Team</option>
              <option value="Team Alpha">Team Alpha</option>
              <option value="Team Beta">Team Beta</option>
              <option value="Team Gamma">Team Gamma</option>
              <option value="Team Delta">Team Delta</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                className="bg-[#1e293b] border-[#0f172a] text-[#f8fafc]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                className="bg-[#1e293b] border-[#0f172a] text-[#f8fafc]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium">
              Salary (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#94a3b8]">$</span>
              <Input
                id="salary"
                name="salary"
                type="text"
                value={formData.salary}
                onChange={handleInputChange}
                className="bg-[#1e293b] border-[#0f172a] text-[#f8fafc] pl-7"
                placeholder="25,000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractFile" className="text-sm font-medium">
              Contract Document
            </Label>
            <div className="border-2 border-dashed border-[#0f172a] rounded-md p-4 text-center">
              <label htmlFor="contractFile" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 text-[#94a3b8] mb-2" />
                <span className="text-sm text-[#94a3b8]">
                  {formData.file ? formData.file.name : "Upload contract PDF or scan"}
                </span>
                <span className="text-xs text-[#94a3b8] mt-1">Click to browse or drag and drop</span>
                <Input
                  id="contractFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#0f172a] text-[#f8fafc] hover:bg-[#0f172a] hover:text-[#f8fafc]"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#e11d48] hover:bg-[#e11d48]/90 text-white">
              {contract ? "Update Contract" : "Create Contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

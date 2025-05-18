"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
// TODO: Replace Supabase logic with backend API calls
import { Camera, Loader2 } from "lucide-react"

interface TeamLogoUploadProps {
  teamId: string
  logoUrl: string | null
  onLogoChange: (_url: string | null) => void
}

export function TeamLogoUpload({ teamId, logoUrl, onLogoChange }: TeamLogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB")
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // Delete existing logo if there is one
      if (logoUrl) {
        // TODO: Replace with actual backend endpoint to delete previous team logo
        await fetch(`/api/team-logos/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: logoUrl }),
        })
      }

      // Upload new logo
      const formData = new FormData()
      formData.append("file", file)
      formData.append("teamId", teamId)
      // TODO: Replace with actual backend endpoint to upload team logo
      const res = await fetch(`/api/team-logos/upload`, {
        method: "POST",
        body: formData,
      })
      const result = await res.json()
      if (!res.ok || !result.url) {
        throw new Error(result.message || "Failed to upload image")
      }
      onLogoChange(result.url)
    } catch (err: any) {
      // console.error('Error uploading logo:', err);
      setError(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
      // Reset the input
      e.target.value = ""
    }
  }

  return (
    <div className="relative">
      <div className="h-32 w-32 rounded-full bg-[#0f172a] flex items-center justify-center text-4xl font-bold overflow-hidden">
        {logoUrl ? (
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt="Team Logo"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[#94a3b8]">LOGO</div>
        )}
      </div>

      <label
        htmlFor="logo-upload"
        className="absolute bottom-0 right-0 bg-[#e11d48] text-[#f8fafc] p-2 rounded-full cursor-pointer"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
      </label>

      <input
        id="logo-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
} 
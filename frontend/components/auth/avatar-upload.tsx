"use client"

import React, { useState } from "react"
import Image from "next/image"
import { uploadAvatar, deleteAvatar } from "@/lib/supabase-storage"
import { useAuth } from "@/components/auth/auth-provider"
import { Camera, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  avatarUrl: string | null
  onAvatarChange: (url: string | null) => void
}

export function AvatarUpload({ avatarUrl, onAvatarChange }: AvatarUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return

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

      // Delete existing avatar if there is one
      if (avatarUrl) {
        await deleteAvatar(avatarUrl)
      }

      // Upload new avatar
      const newAvatarUrl = await uploadAvatar(file, user.id)

      if (newAvatarUrl) {
        onAvatarChange(newAvatarUrl)
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (err: any) {
      console.error("Error uploading avatar:", err)
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
        {avatarUrl ? (
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt="Profile"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-[#94a3b8]">
            {user?.user_metadata?.full_name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2) || "U"}
          </div>
        )}
      </div>

      <label
        htmlFor="avatar-upload"
        className="absolute bottom-0 right-0 bg-[#e11d48] text-[#f8fafc] p-2 rounded-full cursor-pointer"
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
      </label>

      <input
        id="avatar-upload"
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
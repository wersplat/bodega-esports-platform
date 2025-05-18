"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/components/auth/auth-provider"
import { Camera, Loader2 } from "lucide-react"

interface AvatarUploadProps {
  avatarUrl: string | null
  onAvatarChange: (_url: string | null) => void
}

export function AvatarUpload({ avatarUrl, onAvatarChange }: AvatarUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || typeof user !== 'object' || !('id' in user) || typeof user.id !== 'string') return;

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload new avatar using the authApi
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const uploadResponse = await fetch('/api/upload/avatar', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload avatar');
        }
        
        const result = await uploadResponse.json();
        if (result.url) {
          onAvatarChange(result.url);
        } else {
          throw new Error('Failed to get image URL');
        }
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Failed to upload avatar');
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = "";
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
            {typeof user === "object" && user && 'email' in user && typeof user.email === "string"
              ? user.email.split("@")[0].substring(0, 2).toUpperCase()
              : "U"}
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
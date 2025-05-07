"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function ProfileIndexRedirect() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (user && user.id) {
      router.replace(`/profile/${user.id}`)
    } else {
      router.replace("/auth/login")
    }
  }, [user, isLoading, router])

  return null
} 
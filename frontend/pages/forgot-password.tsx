"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
// TODO: Replace Supabase logic with backend API/auth-service calls

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setIsLoading(true)
    try {
      // TODO: Replace with actual backend forgot-password/magic link endpoint URL
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Failed to send magic link.")
      setMessage("Check your email for a magic link to sign in or reset your password.")
    } catch (err: any) {
      setError(err.message || "Failed to send magic link.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-[#94a3b8] mt-1">Enter your email to receive a magic link.</p>
        </div>
        {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-600 text-sm">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">{error}</div>}
        <form className="space-y-4" onSubmit={handleSendMagicLink}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
      </Card>
    </div>
  )
} 
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signInWithDiscord, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Redirect if user is already logged in
    if (user) {
      router.push("/")
    }

    // Check for error in URL
    const errorMsg = searchParams.get("error")
    if (errorMsg) {
      setError(errorMsg)
    }
  }, [user, router, searchParams])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/")
    } catch (error: any) {
      setError(error.message || "An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Bodega Esports</h1>
          <p className="text-[#94a3b8] mt-1">Road to $25K</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleEmailLogin}>
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

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-[#94a3b8] bg-[#1e293b] text-[#e11d48] focus:ring-[#e11d48]"
              />
              <label htmlFor="remember" className="text-sm text-[#94a3b8]">
                Remember me
              </label>
            </div>

            <Link href="/auth/forgot-password" className="text-sm text-[#e11d48] hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#0f172a]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#1e293b] px-2 text-[#94a3b8]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => signInWithDiscord()}
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542..."
                  fill="#f8fafc"
                />
              </svg>
              <span>Discord</span>
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#94a3b8]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-[#e11d48] hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default Login;

"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, Home, Settings, Shield, Upload, Users, UserCircle, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const routes = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Player Profile",
      href: "/profile",
      icon: UserCircle,
    },
    {
      name: "Team Management",
      href: "/teams",
      icon: Users,
    },
    {
      name: "Match Scheduling",
      href: "/schedule",
      icon: Calendar,
    },
    {
      name: "Stats Submission",
      href: "/stats",
      icon: Upload,
    },
    {
      name: "Leaderboards",
      href: "/leaderboards",
      icon: BarChart3,
    },
    {
      name: "Admin Panel",
      href: "/admin",
      icon: Shield,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  // Get user's name and initials
  const userName =
    user?.user_metadata?.full_name ||
    (user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
      : user?.email?.split("@")[0] || "User")

  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const userRole = "Team Captain"

  return (
    <div
      className={cn("w-64 p-4 flex flex-col h-screen relative overflow-hidden", className)}
      style={{
        backgroundImage: "linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), url('/img/BG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      {...props}
    >
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-[#f8fafc]">Bodega Esports</h1>
        <p className="text-sm text-[#94a3b8]">Road to $25K</p>
      </div>

      <nav className="space-y-1 flex-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === route.href
                ? "bg-[#e11d48] text-[#f8fafc]"
                : "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#0f172a]",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span>{route.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#0f172a]">
        {user ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-[#e11d48] flex items-center justify-center text-[#f8fafc]">
              {userInitials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-[#94a3b8]">{userRole}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => signOut()} title="Sign Out">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-[#94a3b8]">Not logged in</span>
            <Button size="sm" className="bg-[#e11d48] text-[#f8fafc]" onClick={() => router.push('/auth/login')}>
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

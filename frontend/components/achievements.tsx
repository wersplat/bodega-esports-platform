import { Trophy } from "lucide-react"

interface Achievement {
  id: string
  title: string
  date: string
}

export function Achievements() {
  // Sample achievements data
  // In a real app, you would fetch this from Supabase
  const achievements: Achievement[] = [
    { id: "1", title: "Season MVP", date: "2022-2023" },
    { id: "2", title: "All-Star Selection", date: "2023" },
    { id: "3", title: "Player of the Week", date: "May 1-7, 2023" },
    { id: "4", title: "30+ Point Game", date: "vs Team Omega, April 10, 2023" },
  ]

  return (
    <div className="space-y-4 p-2">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#e11d48]/10 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-[#e11d48]" />
          </div>
          <div>
            <p className="font-medium">{achievement.title}</p>
            <p className="text-sm text-[#94a3b8]">{achievement.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 
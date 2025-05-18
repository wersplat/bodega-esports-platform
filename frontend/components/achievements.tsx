import { Trophy } from "lucide-react"
import { useEffect, useState } from "react"

interface Achievement {
  id: string
  title: string
  date: string
}

interface AchievementsProps {
  userId?: string;
}

export function Achievements({ userId }: AchievementsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    setError(null)
    fetch(`/api/achievements?user_id=${encodeURIComponent(userId)}`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch achievements"))
      .then((data) => {
        setAchievements(
          data.map((a: any) => ({
            id: a.id,
            title: a.title,
            date: a.date,
          }))
        )
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch achievements")
        setAchievements([])
        setLoading(false)
      })
  }, [userId])

  if (!userId) {
    return <div className="p-2 text-red-500">No user ID provided.</div>
  }

  if (loading) {
    return <div className="p-2 text-gray-500">Loading achievements...</div>
  }

  if (error) {
    return <div className="p-2 text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4 p-2">
      {achievements.length === 0 ? (
        <div className="text-gray-500">No achievements found.</div>
      ) : (
        achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#e11d48]/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-[#e11d48]" />
            </div>
            <div>
              <p className="font-medium">{achievement.title}</p>
              <p className="text-sm text-[#94a3b8]">{achievement.date}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
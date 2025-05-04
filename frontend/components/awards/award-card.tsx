import { Trophy } from "lucide-react"
import { Card, CardContent, CardFooter } from "../ui/card"
import Image from "next/image"

interface AwardCardProps {
  title: string
  recipient: string
  team: string
  season: string
  image: string
  avatar: string
}

export function AwardCard({ title, recipient, team, season, image, avatar }: AwardCardProps) {
  return (
    <Card className="bg-[#1e293b] border-[#0f172a] overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-[#e11d48] text-white text-xs font-semibold px-2 py-1 rounded flex items-center">
            <Trophy className="h-3 w-3 mr-1" />
            Award
          </span>
        </div>
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center mt-4">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-[#0f172a] mr-3">
            <Image src={avatar || "/placeholder.svg"} alt={recipient} width={40} height={40} className="object-cover" />
          </div>
          <div>
            <p className="font-medium">{recipient}</p>
            <p className="text-[#94a3b8] text-xs">{team}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-[#0f172a]/50">
        <div className="text-[#94a3b8] text-xs">{season} Season</div>
        <button className="text-[#e11d48] text-sm font-medium hover:underline">View Details</button>
      </CardFooter>
    </Card>
  )
} 
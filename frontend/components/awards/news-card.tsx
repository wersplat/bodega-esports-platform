import { CalendarDays } from "lucide-react"
import { Card, CardContent, CardFooter } from "../ui/card"
import Link from "next/link"

interface NewsCardProps {
  title: string
  excerpt: string
  date: string
  image: string
  category: string
}

export function NewsCard({ title, excerpt, date, image, category }: NewsCardProps) {
  return (
    <Card className="bg-[#1e293b] border-[#0f172a] overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-[#e11d48] text-white text-xs font-semibold px-2 py-1 rounded">{category}</span>
        </div>
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-[#94a3b8] text-sm mb-4 line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-[#0f172a]/50">
        <div className="flex items-center text-[#94a3b8] text-xs">
          <CalendarDays className="h-3 w-3 mr-1" />
          {date}
        </div>
        <Link href="#" className="text-[#e11d48] text-sm font-medium hover:underline">
          Read More
        </Link>
      </CardFooter>
    </Card>
  )
} 
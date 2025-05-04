import { AwardCard } from "./award-card"
import { NewsCard } from "./news-card"

interface NewsFeedProps {
  type: "news" | "awards"
}

export function NewsFeed({ type }: NewsFeedProps) {
  // Sample news data
  const newsItems = [
    {
      id: 1,
      title: "Team Alpha Signs New Star Player",
      excerpt: "In a blockbuster move, Team Alpha has signed three-time MVP John Doe to a multi-year contract.",
      date: "May 15, 2023",
      image: "/placeholder.svg?height=200&width=400",
      category: "Transfers",
    },
    {
      id: 2,
      title: "League Announces Expanded Playoff Format",
      excerpt: "The Bodega Esports League has announced an expanded playoff format for the upcoming season.",
      date: "May 12, 2023",
      image: "/placeholder.svg?height=200&width=400",
      category: "League Updates",
    },
    {
      id: 3,
      title: "Team Beta Unveils New Arena",
      excerpt: "Team Beta has unveiled their state-of-the-art new arena, set to open next month.",
      date: "May 10, 2023",
      image: "/placeholder.svg?height=200&width=400",
      category: "Facilities",
    },
    {
      id: 4,
      title: "Rookie Showcase Set for July",
      excerpt: "The annual Rookie Showcase will take place in July, featuring the top prospects.",
      date: "May 8, 2023",
      image: "/placeholder.svg?height=200&width=400",
      category: "Events",
    },
    {
      id: 5,
      title: "Team Gamma Announces Coaching Change",
      excerpt: "Team Gamma has parted ways with head coach Mike Johnson after three seasons.",
      date: "May 5, 2023",
      image: "/placeholder.svg?height=200&width=400",
      category: "Team News",
    },
    {
      id: 6,
      title: "League Partners with Major Sponsor",
      excerpt: "The Bodega Esports League has announced a major sponsorship deal with TechCorp.",
      date: "May 3, 2023",
      image: "/placeholder.svg?height=200&width=400",
      category: "Business",
    },
  ]

  // Sample awards data
  const awardsItems = [
    {
      id: 1,
      title: "Most Valuable Player",
      recipient: "John Doe",
      team: "Team Alpha",
      season: "2023",
      image: "/placeholder.svg?height=200&width=400",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      title: "Rookie of the Year",
      recipient: "Jane Smith",
      team: "Team Beta",
      season: "2023",
      image: "/placeholder.svg?height=200&width=400",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      title: "Defensive Player of the Year",
      recipient: "Mike Johnson",
      team: "Team Gamma",
      season: "2023",
      image: "/placeholder.svg?height=200&width=400",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      title: "Coach of the Year",
      recipient: "Sarah Williams",
      team: "Team Delta",
      season: "2023",
      image: "/placeholder.svg?height=200&width=400",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      title: "Most Improved Player",
      recipient: "David Brown",
      team: "Team Alpha",
      season: "2023",
      image: "/placeholder.svg?height=200&width=400",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      title: "Sixth Player of the Year",
      recipient: "Lisa Davis",
      team: "Team Beta",
      season: "2023",
      image: "/placeholder.svg?height=200&width=400",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {type === "news"
        ? newsItems.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              excerpt={item.excerpt}
              date={item.date}
              image={item.image}
              category={item.category}
            />
          ))
        : awardsItems.map((item) => (
            <AwardCard
              key={item.id}
              title={item.title}
              recipient={item.recipient}
              team={item.team}
              season={item.season}
              image={item.image}
              avatar={item.avatar}
            />
          ))}
    </div>
  )
} 
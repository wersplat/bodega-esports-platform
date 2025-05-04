import { NewsFeed } from "./news-feed"
import { NewsFilter } from "./news-filter"
import { SubscribeBanner } from "./subscribe-banner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

export function AwardsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Awards & News</h1>
          <p className="text-[#94a3b8]">Stay updated with the latest from Bodega Esports</p>
        </div>

        {/* Hero Carousel */}
        <div className="relative overflow-hidden rounded-lg mb-8 bg-[#1e293b] h-64 md:h-80">
          <div className="absolute inset-0 bg-gradient-to-r from-[#e11d48]/80 to-transparent z-10"></div>
          <img
            src="/placeholder.svg?height=400&width=1200"
            alt="Featured news"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-6 z-20 max-w-lg">
            <span className="inline-block bg-[#e11d48] text-white text-xs font-semibold px-2 py-1 rounded mb-2">
              BREAKING NEWS
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Team Alpha Wins Championship in Dramatic Overtime
            </h2>
            <p className="text-white/90 text-sm md:text-base mb-4">
              In a thrilling finale, Team Alpha secured the championship with a buzzer-beater shot.
            </p>
            <button className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Read Full Story
            </button>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="news" className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <TabsList className="bg-[#1e293b] mb-4 sm:mb-0">
                  <TabsTrigger value="news" className="data-[state=active]:bg-[#e11d48] data-[state=active]:text-white">
                    News
                  </TabsTrigger>
                  <TabsTrigger
                    value="awards"
                    className="data-[state=active]:bg-[#e11d48] data-[state=active]:text-white"
                  >
                    Awards
                  </TabsTrigger>
                </TabsList>

                <NewsFilter />
              </div>

              <TabsContent value="news" className="mt-0">
                <NewsFeed type="news" />
              </TabsContent>

              <TabsContent value="awards" className="mt-0">
                <NewsFeed type="awards" />
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-full md:w-1/4">
            <div className="bg-[#1e293b] rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-4 border-b border-[#0f172a] pb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["Championship", "Team Alpha", "MVP", "Playoffs", "Rookies", "Transfers", "Highlights"].map((tag) => (
                  <span key={tag} className="bg-[#0f172a] text-[#94a3b8] px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-lg p-4">
              <h3 className="font-medium mb-4 border-b border-[#0f172a] pb-2">Upcoming Events</h3>
              <div className="space-y-4">
                {[
                  { name: "Season Opener", date: "June 15, 2023" },
                  { name: "All-Star Weekend", date: "July 22-23, 2023" },
                  { name: "Playoffs Begin", date: "August 10, 2023" },
                ].map((event) => (
                  <div key={event.name} className="flex justify-between">
                    <span className="text-sm">{event.name}</span>
                    <span className="text-xs text-[#94a3b8]">{event.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SubscribeBanner />
      </div>
    </div>
  )
} 
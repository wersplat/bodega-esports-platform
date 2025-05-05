// frontend/pages/index.jsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        <h1 className="text-5xl font-extrabold mb-4 text-[#f8fafc] text-center drop-shadow-lg">Bodega Esports Platform</h1>
        <p className="mb-8 text-xl text-muted-foreground text-center max-w-xl">Compete, connect, and climb the leaderboards. Join the next generation of esports tournaments and communities.</p>
        <Button size="lg" className="px-8 py-4 text-lg font-semibold">Get Started</Button>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#1e293b]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#f8fafc] mb-10">Why Choose Bodega?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-[#334155]">
              <h3 className="text-xl font-semibold mb-2 text-[#f8fafc]">Seamless Tournaments</h3>
              <p className="text-muted-foreground">Create and join tournaments with just a few clicks. Automated brackets and real-time updates.</p>
            </Card>
            <Card className="p-6 text-center bg-[#334155]">
              <h3 className="text-xl font-semibold mb-2 text-[#f8fafc]">Community Driven</h3>
              <p className="text-muted-foreground">Engage with a passionate community of gamers. Chat, form teams, and share your highlights.</p>
            </Card>
            <Card className="p-6 text-center bg-[#334155]">
              <h3 className="text-xl font-semibold mb-2 text-[#f8fafc]">Track Your Progress</h3>
              <p className="text-muted-foreground">Personalized profiles, stats, and leaderboards to showcase your achievements.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#0f172a] text-center text-[#f8fafc] text-sm">
        © {new Date().getFullYear()} Bodega Esports Platform. All rights reserved.
      </footer>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlasmicComponent, PlasmicRootProvider } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "../plasmic-init";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [plasmicData, setPlasmicData] = useState<any>(null);

  useEffect(() => {
    PLASMIC.fetchComponentData("HomePromoBanner").then(setPlasmicData);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.7)), url('/img/BG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-extrabold mb-4 text-[#f8fafc] text-center drop-shadow-lg">
          Bodega Esports Platform
        </h1>
        <p className="mb-8 text-xl text-muted-foreground text-center max-w-xl">
          Compete, connect, and climb the leaderboards. Join the next generation of esports tournaments and communities.
        </p>
        <Link href="/auth/register" passHref legacyBehavior>
          <Button size="lg" className="px-8 py-4 text-lg font-semibold">Get Started</Button>
        </Link>
      </section>

      {/* 🔥 Plasmic editable promo section */}
      {plasmicData && (
        <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
          <PlasmicComponent component="HomePromoBanner" />
        </PlasmicRootProvider>
      )}

      {/* Features Section */}
      <section className="py-16"> ... </section>

      <footer className="py-6 text-center text-[#f8fafc] text-sm">
        © {new Date().getFullYear()} Bodega Esports Platform. All rights reserved.
      </footer>
    </div>
  );
}

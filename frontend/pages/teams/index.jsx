import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamListPage({ initialTeams, error }) {
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialTeams.map((team) => (
          <div
            key={team.id}
            className="bg-slate-800 rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              {team.logo_url && (
                <div className="relative w-12 h-12">
                  <Image
                    src={team.logo_url}
                    alt={team.name}
                    fill
                    sizes="48px"
                    className="rounded-full border object-cover"
                    priority={initialTeams.indexOf(team) < 6}
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold">{team.name}</h2>
            </div>
            <p className="text-sm text-slate-300">
              {team.description || "No description yet."}
            </p>
            <div className="mt-3 text-sm text-slate-400">
              Record: {team.wins}–{team.losses}
              <br />
              PD: {team.point_difference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("https://api.bodegacatsgc.gg/teams");
    if (!res.ok) throw new Error("Failed to fetch teams");
    const teams = await res.json();
    
    return {
      props: {
        initialTeams: teams,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err.message,
        initialTeams: [],
      },
    };
  }
}
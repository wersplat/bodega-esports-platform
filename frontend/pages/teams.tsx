import Image from "next/image";
import React from "react";

interface TeamListPageProps {
  initialTeams?: any[];
  error?: string;
}

const TeamListPage: React.FC<TeamListPageProps> = ({ initialTeams = [], error } = {}) => {
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-[#94a3b8]">Browse all registered teams</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialTeams.map((team) => (
          <div
            key={team.id}
            className="bg-[#1e293b] rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col"
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
              <h2 className="text-xl font-semibold text-[#f8fafc]">{team.name}</h2>
            </div>
            <p className="text-sm text-[#cbd5e1] mb-2">
              {team.description || "No description yet."}
            </p>
            <div className="mt-auto text-sm text-[#94a3b8]">
              Record: {team.wins}&ndash;{team.losses}
              <br />
              PD: {team.point_difference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamListPage;

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
  } catch (err: any) {
    return {
      props: {
        error: err.message,
        initialTeams: [],
      },
    };
  }
}

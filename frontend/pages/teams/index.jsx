import { useEffect, useState } from "react";

export default function TeamListPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://api.bodegacatsgc.gg/teams")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch teams");
        return res.json();
      })
      .then(setTeams)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading teams...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-slate-800 rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-2">
              {team.logo_url && (
                <img
                  src={team.logo_url}
                  alt={team.name}
                  className="w-12 h-12 rounded-full border"
                />
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
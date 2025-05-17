import React, { useEffect, useState, useCallback } from 'react';

interface League {
  id: string | number;
  name: string;
}

interface Team {
  id: string | number;
  name: string;
  wins: number;
  losses: number;
}

const LeagueTeams: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    const res = await fetch('https://api.bodegacatsgc.gg/leagues');
    const data = await res.json();
    setLeagues(data);
  };

  const fetchTeams = useCallback(async () => {
    const res = await fetch(`https://api.bodegacatsgc.gg/teams?league_id=${selectedLeague}`);
    const data = await res.json();
    setTeams(data);
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedLeague) fetchTeams();
  }, [selectedLeague, fetchTeams]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">League Teams</h1>
          <p className="text-[#94a3b8]">View teams by league</p>
        </div>
      </div>
      <select
        value={selectedLeague}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLeague(e.target.value)}
        className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48] min-w-[200px] mb-6"
      >
        <option value="">Select League</option>
        {leagues.map((l: League) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {teams.map((team: Team) => (
          <div
            key={team.id}
            className="bg-[#222b3a] text-[#f8fafc] rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
            <p className="text-sm text-[#cbd5e1]">Wins: {team.wins} | Losses: {team.losses}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueTeams;

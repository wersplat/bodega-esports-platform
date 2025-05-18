import React, { useState, useEffect, useCallback } from 'react';

interface Season {
  id: string;
  name: string;
}

interface Division {
  id: string;
  name: string;
}

interface Standing {
  name: string;
  wins: number;
  losses: number;
  winPct: string;
}

import { API_BASE } from '../../config';

const Standings: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v2/seasons`);
        const data = await response.json();
        setSeasons(data);
        if (data.length > 0) {
          setSelectedSeason(data[0].id);
        }
      } catch (error) {}
    };
    fetchSeasons();
  }, []);

  const fetchDivisions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v2/divisions?season_id=${selectedSeason}`);
      const data = await response.json();
      setDivisions(data);
      if (data.length > 0) {
        setSelectedDivision(data[0].id);
      }
    } catch (error) {}
  }, [selectedSeason]);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    try {
      const teamsResponse = await fetch(`${API_BASE}/api/v2/teams?division_id=${selectedDivision}`);
      const teams = await teamsResponse.json();

      const matchesResponse = await fetch(`${API_BASE}/api/v2/matches?season_id=${selectedSeason}`);
      const matches = await matchesResponse.json();

      const teamRecords: Record<string, { name: string; wins: number; losses: number }> = {};
      teams.forEach((team: any) => {
        teamRecords[team.id] = { name: team.name, wins: 0, losses: 0 };
      });

      matches.forEach((match: any) => {
        if (match.winner_team_id && teamRecords[match.winner_team_id]) {
          teamRecords[match.winner_team_id].wins += 1;
        }
        if (match.loser_team_id && teamRecords[match.loser_team_id]) {
          teamRecords[match.loser_team_id].losses += 1;
        }
      });

      const formattedStandings: Standing[] = Object.values(teamRecords).map((record) => ({
        ...record,
        winPct: record.wins + record.losses > 0 ? (record.wins / (record.wins + record.losses)).toFixed(3) : '0.000',
      }));

      formattedStandings.sort((a, b) => parseFloat(b.winPct) - parseFloat(a.winPct));
      setStandings(formattedStandings);
    } catch (error) {} finally {
      setLoading(false);
    }
  }, [selectedDivision, selectedSeason]);

  useEffect(() => {
    if (selectedSeason) fetchDivisions();
  }, [selectedSeason, fetchDivisions]);

  useEffect(() => {
    if (selectedDivision) fetchStandings();
  }, [selectedDivision, fetchStandings]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Standings</h1>
          <p className="text-[#94a3b8]">View standings by season and division</p>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48] min-w-[200px]"
        >
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48] min-w-[200px]"
        >
          <option value="">Select Division</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-[#94a3b8]">Loading standings...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#222b3a] bg-[#1e293b] rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Wins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Losses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#94a3b8] uppercase tracking-wider">Win %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222b3a]">
              {standings.map((team) => (
                <tr key={team.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#f8fafc]">{team.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#f8fafc]">{team.wins}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#f8fafc]">{team.losses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#f8fafc]">{team.winPct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Standings;

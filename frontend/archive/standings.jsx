import React, { useState, useEffect, useCallback } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const Standings = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/seasons`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY ?? '',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY ?? ''}`
          }
        });
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
      const response = await fetch(`${SUPABASE_URL}/rest/v1/divisions?season_id=eq.${selectedSeason}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY ?? '',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY ?? ''}`
        }
      });
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
      const teamsResponse = await fetch(`${SUPABASE_URL}/rest/v1/teams?division_id=eq.${selectedDivision}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY ?? '',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY ?? ''}`
        }
      });
      const teams = await teamsResponse.json();

      const matchesResponse = await fetch(`${SUPABASE_URL}/rest/v1/matches?season_id=eq.${selectedSeason}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY ?? '',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY ?? ''}`
        }
      });
      const matches = await matchesResponse.json();

      const teamRecords = {};
      teams.forEach((team) => {
        teamRecords[team.id] = { name: team.name, wins: 0, losses: 0 };
      });

      matches.forEach((match) => {
        if (match.winner_team_id && teamRecords[match.winner_team_id]) {
          teamRecords[match.winner_team_id].wins += 1;
        }
        if (match.loser_team_id && teamRecords[match.loser_team_id]) {
          teamRecords[match.loser_team_id].losses += 1;
        }
      });

      const formattedStandings = Object.values(teamRecords).map((record) => ({
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

// src/pages/Standings.jsx

import React, { useState, useEffect } from 'react';
// If you have these components, import them. Otherwise, keep using native elements.
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Hardcoded values for development
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function Standings() {
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
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const data = await response.json();
        setSeasons(data);
        if (data.length > 0) {
          setSelectedSeason(data[0].id); // default to most recent season
        }
      } catch (error) {
        console.error('Error fetching seasons:', error);
      }
    };

    fetchSeasons();
  }, []);

  const fetchDivisions = React.useCallback(async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/divisions?season_id=eq.${selectedSeason}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      setDivisions(data);
      if (data.length > 0) {
        setSelectedDivision(data[0].id); // default to first division
      }
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  }, [selectedSeason]);

  const fetchStandings = React.useCallback(async () => {
    setLoading(true);
    try {
      const teamsResponse = await fetch(`${SUPABASE_URL}/rest/v1/teams?division_id=eq.${selectedDivision}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const teams = await teamsResponse.json();

      const matchesResponse = await fetch(`${SUPABASE_URL}/rest/v1/matches?season_id=eq.${selectedSeason}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const matches = await matchesResponse.json();

      const teamRecords = {};
      teams.forEach(team => {
        teamRecords[team.id] = { name: team.name, wins: 0, losses: 0 };
      });

      matches.forEach(match => {
        if (match.winner_team_id && teamRecords[match.winner_team_id]) {
          teamRecords[match.winner_team_id].wins += 1;
        }
        if (match.loser_team_id && teamRecords[match.loser_team_id]) {
          teamRecords[match.loser_team_id].losses += 1;
        }
      });

      const formattedStandings = Object.values(teamRecords).map(record => ({
        ...record,
        winPct: record.wins + record.losses > 0 ? (record.wins / (record.wins + record.losses)).toFixed(3) : '0.000',
      }));

      formattedStandings.sort((a, b) => parseFloat(b.winPct) - parseFloat(a.winPct));

      setStandings(formattedStandings);
    } catch (error) {
      console.error('Error fetching standings:', error);
    } finally {
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
          <h1 className="text-2xl font-bold">🏆 Standings</h1>
          <p className="text-[#94a3b8]">View team records by season and division</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48] min-w-[200px]"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id} className="bg-[#1e293b] text-[#f8fafc]">
              {season.name}
            </option>
          ))}
        </select>
        {divisions.length > 0 && (
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48] min-w-[200px]"
          >
            {divisions.map((division) => (
              <option key={division.id} value={division.id} className="bg-[#1e293b] text-[#f8fafc]">
                {division.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-[#1e293b] rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <div className="text-center text-[#cbd5e1] py-8">Loading...</div>
        ) : standings.length === 0 ? (
          <p className="text-center text-[#cbd5e1] py-8">No teams recorded yet.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#273449] text-[#f8fafc]">
                <th className="px-6 py-3 text-left">Team</th>
                <th className="px-6 py-3 text-center">Wins</th>
                <th className="px-6 py-3 text-center">Losses</th>
                <th className="px-6 py-3 text-center">Win %</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={index} className="border-b border-[#334155]">
                  <td className="px-6 py-3 text-[#cbd5e1]">{team.name}</td>
                  <td className="px-6 py-3 text-center">{team.wins}</td>
                  <td className="px-6 py-3 text-center">{team.losses}</td>
                  <td className="px-6 py-3 text-center">{team.winPct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Standings;

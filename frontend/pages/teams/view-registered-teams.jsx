import React, { useState, useEffect } from 'react';

// Hardcoded values for development
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

function ViewRegisteredTeams() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  const fetchLeagues = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/leagues`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      setLeagues(data);
    } catch (error) {
      // Handle error (was: console.error('Error fetching leagues:', error))
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasons = async (leagueId) => {
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/seasons?league_id=eq.${leagueId}`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      setSeasons(data);
      setSelectedSeason(data[0]?.id || '');
    } catch (error) {
      // Handle error (was: console.error('Error fetching seasons:', error))
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/teams`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      // Handle error (was: console.error('Error fetching teams:', error))
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchSeasons(selectedLeague);
    } else {
      setSeasons([]);
      setSelectedSeason('');
    }
  }, [selectedLeague]);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      fetchTeams(selectedLeague, selectedSeason);
    } else {
      setTeams([]);
    }
  }, [selectedSeason, selectedLeague]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">View Registered Teams</h1>
          <p className="text-[#94a3b8] mb-4">See all teams registered for a league and season</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="form-input w-full sm:w-1/2 h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
          >
            <option value="">Select League</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="form-input w-full sm:w-1/2 h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
            disabled={!seasons.length}
          >
            <option value="">Select Season</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-[#1e293b] rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-center text-[#cbd5e1]">Loading...</p>
          ) : teams.length === 0 ? (
            <p className="text-center text-[#cbd5e1]">No teams registered for this league.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="bg-[#222b3a] text-[#f8fafc] rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col"
                >
                  <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                  <p className="text-sm text-[#cbd5e1]">{team.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewRegisteredTeams;
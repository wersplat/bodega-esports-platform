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
      console.error('Error fetching leagues:', error);
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
      console.error('Error fetching seasons:', error);
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
      console.error('Error fetching teams:', error);
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
    <div className="main-content">
      <h1 className="page-title">View Registered Teams</h1>

      <select
        value={selectedLeague}
        onChange={(e) => setSelectedLeague(e.target.value)}
        className="form-input"
        style={{ marginBottom: '20px', padding: '8px', borderRadius: '8px' }}
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
        className="form-input"
        style={{ marginBottom: '20px', padding: '8px', borderRadius: '8px' }}
        disabled={!seasons.length}
      >
        <option value="">Select Season</option>
        {seasons.map((season) => (
          <option key={season.id} value={season.id}>
            {season.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : teams.length === 0 ? (
        <p>No teams registered for this league.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {teams.map((team, index) => (
            <li
              key={index}
              style={{
                marginBottom: '20px',
                background: '#222b3a',
                color: '#f8fafc',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 0 6px rgba(0,0,0,0.18)',
              }}
            >
              <h3>{team.name}</h3>
              <p>{team.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewRegisteredTeams;
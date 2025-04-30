import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure the import path matches the file name's case

function ViewRegisteredTeams() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

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
    const fetchTeams = async () => {
      try {
        const teams = await supabase.from('teams').select('*');
        setTeams(teams.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []); // Ensure dependencies are correct

  const fetchLeagues = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('leagues').select('id, name');
    if (error) {
      console.error('Error fetching leagues:', error.message);
    } else {
      setLeagues(data);
    }
    setLoading(false);
  };

  const fetchSeasons = async (leagueId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('seasons')
      .select('id, name')
      .eq('league_id', leagueId);
    if (error) {
      console.error('Error fetching seasons:', error.message);
    } else {
      setSeasons(data);
      setSelectedSeason(data[0]?.id || '');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedSeason) {
      fetchTeams(selectedLeague, selectedSeason);
    } else {
      setTeams([]);
    }
  }, [selectedSeason, selectedLeague]);

  const fetchTeams = async (leagueId, seasonId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('registrations')
      .select('id, teams ( name, description )')
      .eq('league_id', leagueId)
      .eq('season_id', seasonId);
    if (error) {
      console.error('Error fetching teams:', error.message);
    } else {
      setTeams(data.map((registration) => registration.teams));
    }
    setLoading(false);
  };

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
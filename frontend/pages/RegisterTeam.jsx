// src/pages/RegisterTeam.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function RegisterTeam() {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [seasons, setSeasons] = useState([]);
  
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get user session, then load teams & leagues
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        fetchTeams(session.user.id);
        fetchLeagues();
      }
    };
    init();
  }, []);

  // When league changes, load its seasons
  useEffect(() => {
    if (selectedLeague) {
      fetchSeasons(selectedLeague);
    } else {
      setSeasons([]);
      setSelectedSeason('');
    }
  }, [selectedLeague]);

  const fetchTeams = async (uid) => {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name')
      .eq('owner_id', uid);
    if (error) console.error('Error fetching teams:', error.message);
    else setTeams(data);
  };

  const fetchLeagues = async () => {
    const { data, error } = await supabase
      .from('leagues')
      .select('id, name, max_teams, is_locked')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const fetchSeasons = async (leagueId) => {
    const { data, error } = await supabase
      .from('seasons')
      .select('id, name')
      .eq('league_id', leagueId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching seasons:', error.message);
      setSeasons([]);
    } else {
      setSeasons(data);
      setSelectedSeason(data[0]?.id || '');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTeam || !selectedLeague || !selectedSeason) {
      setError('Please select a team, a league, and a season.');
      return;
    }

    const leagueData = leagues.find((l) => l.id === selectedLeague);
    if (leagueData?.is_locked) {
      setError('League is locked. No more registrations allowed.');
      return;
    }

    // Prevent duplicate registration
    const { data: existing } = await supabase
      .from('registrations')
      .select('*')
      .eq('team_id', selectedTeam)
      .eq('league_id', selectedLeague)
      .eq('season_id', selectedSeason);

    if (existing?.length > 0) {
      setError('This team is already registered for that league & season.');
      return;
    }

    // Check team count for this league/season
    const { count, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('league_id', selectedLeague)
      .eq('season_id', selectedSeason);

    if (countError) {
      console.error('Error counting registrations:', countError.message);
      setError('Could not verify league capacity. Try again.');
      return;
    }

    if (count >= leagueData.max_teams) {
      // Lock league if full
      await supabase
        .from('leagues')
        .update({ is_locked: true })
        .eq('id', selectedLeague);
      setError('League is full and now locked.');
      fetchLeagues();
      return;
    }

    // Insert registration with season_id
    const { error: insertError } = await supabase
      .from('registrations')
      .insert([{
        team_id: selectedTeam,
        league_id: selectedLeague,
        season_id: selectedSeason
      }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess('Team successfully registered for that season!');
      setSelectedTeam('');
      setSelectedLeague('');
      setSelectedSeason('');
      fetchLeagues(); // refresh lock status
    }
  };

  return (
    <div style={{ paddingTop: '80px' }}>
      <h1 className="page-title">Register Team to a League & Season</h1>

      <form onSubmit={handleRegister} className="form" style={{ marginTop: '30px' }}>
        {/* Team */}
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="form-input"
        >
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {/* League */}
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="form-input"
        >
          <option value="">Select League</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} {l.is_locked ? '(Locked)' : `(Max: ${l.max_teams})`}
            </option>
          ))}
        </select>

        {/* Season */}
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="form-input"
          disabled={!seasons.length}
        >
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <button type="submit" className="form-button" style={{ backgroundColor: '#f59e0b' }}>
          Register
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      </form>
    </div>
  );
}

export default RegisterTeam;

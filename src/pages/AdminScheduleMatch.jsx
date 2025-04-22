import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminScheduleMatch() {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchTeams(selectedLeague);
    } else {
      setTeams([]);
    }
  }, [selectedLeague]);

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*');
    if (error) {
      console.error('Error fetching leagues:', error.message);
    } else {
      setLeagues(data);
    }
  };

  const fetchTeams = async (leagueId) => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('league_id', leagueId);
    if (error) {
      console.error('Error fetching teams:', error.message);
    } else {
      setTeams(data);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedLeague || !homeTeam || !awayTeam || !matchDate) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (homeTeam === awayTeam) {
      setErrorMessage('Home and away teams cannot be the same.');
      return;
    }

    const { error } = await supabase
      .from('matches')
      .insert([
        {
          league_id: selectedLeague,
          home_team_id: homeTeam,
          away_team_id: awayTeam,
          match_date: matchDate,
          status: 'Scheduled',
        },
      ]);

    if (error) {
      console.error('Error scheduling match:', error.message);
      setErrorMessage('Failed to schedule match.');
    } else {
      setSuccessMessage('Match scheduled successfully!');
      setSelectedLeague('');
      setHomeTeam('');
      setAwayTeam('');
      setMatchDate('');
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Admin: Schedule a Match</h1>

      <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select League</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>

        <select
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          className="form-input"
          required
          disabled={!selectedLeague}
        >
          <option value="">Select Home Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <select
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          className="form-input"
          required
          disabled={!selectedLeague}
        >
          <option value="">Select Away Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          className="form-input"
          required
        />

        <button type="submit" className="form-button" style={{ backgroundColor: '#3b82f6' }}>
          Schedule Match
        </button>

        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default AdminScheduleMatch;

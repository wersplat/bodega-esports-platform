import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function RegisterTeam() {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        fetchTeams(session.user.id);
        fetchLeagues();
      }
    };
    getUser();
  }, []);

  const fetchTeams = async (userId) => {
    const { data, error } = await supabase.from('teams').select('*').eq('owner_id', userId);
    if (error) console.error('Error fetching teams:', error.message);
    else setTeams(data);
  };

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTeam || !selectedLeague) {
      setError('Please select both a team and a league.');
      return;
    }

    const leagueData = leagues.find((l) => l.id === selectedLeague);

    // Check if league is locked
    if (leagueData?.is_locked) {
      setError('League is locked. No more registrations allowed.');
      return;
    }

    // Check if already registered
    const { data: existing } = await supabase
      .from('registrations')
      .select('*')
      .eq('team_id', selectedTeam)
      .eq('league_id', selectedLeague);

    if (existing.length > 0) {
      setError('Team already registered in this league.');
      return;
    }

    // Check current number of teams registered
    const { count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('league_id', selectedLeague);

    if (count >= leagueData.max_teams) {
      // Lock the league
      await supabase.from('leagues').update({ is_locked: true }).eq('id', selectedLeague);
      setError('League is now full and locked.');
      return;
    }

    const { error: insertError } = await supabase.from('registrations').insert([
      { team_id: selectedTeam, league_id: selectedLeague }
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess('Team successfully registered!');
      setSelectedTeam('');
      setSelectedLeague('');
      fetchLeagues(); // Refresh league list in case it's now full
    }
  };

  return (
    <div style={{ paddingTop: '80px' }}> 
      <h1 className="page-title">Register Team to a League</h1>

      <form onSubmit={handleRegister} className="form" style={{ marginTop: '30px' }}>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="form-input"
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="form-input"
        >
          <option value="">Select League</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name} {league.is_locked ? '(Locked)' : `(Max: ${league.max_teams})`}
            </option>
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

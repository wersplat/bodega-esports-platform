import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminAddTeam() {
  const [teamName, setTeamName] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Error fetching leagues:', error.message);
      else setLeagues(data);
    };

    const fetchSeasons = async () => {
      try {
        const res = await fetch('/api/seasons');
        if (res.ok) {
          const data = await res.json();
          setSeasons(data);
        } else {
          console.error('Failed to fetch seasons');
        }
      } catch (error) {
        console.error('Error fetching seasons:', error);
      }
    };

    fetchLeagues();
    fetchSeasons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!teamName || !selectedLeague) {
      setError('Please enter a team name and select a league.');
      return;
    }

    // Insert the new team first
    const { data: teamInsertData, error: teamInsertError } = await supabase
      .from('teams')
      .insert([
        {
          name: teamName,
          league_id: selectedLeague,
          owner_id: null, // Admin-created teams have no owner initially
        }
      ])
      .select()
      .single(); // Force returning the inserted team

    if (teamInsertError) {
      setError(teamInsertError.message);
      return;
    }

    // Register the team into registrations
    const { error: registrationError } = await supabase
      .from('registrations')
      .insert([
        {
          team_id: teamInsertData.id,
          league_id: selectedLeague,
        }
      ])
      .select()
      .single(); // Force returning the inserted registration

    if (registrationError) {
      setError(registrationError.message);
    } else {
      setSuccess('Team successfully added and registered!');
      setTeamName('');
      setSelectedLeague('');
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <button
          onClick={() => navigate('/admin')}
          className="form-button"
          style={{ marginBottom: '20px' }}
        >
          ← Back to Admin Dashboard
        </button>

        <h1 className="page-title">Admin: Add New Team</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '40px',
            background: '#1e293b',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
          }}
        >
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="form-input"
            required
          />

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
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Season</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="form-button"
          >
            Add Team
          </button>

          {error && <p style={{ color: '#f87171', marginTop: '10px' }}>{error}</p>}
          {success && <p style={{ color: '#34d399', marginTop: '10px' }}>{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default AdminAddTeam;

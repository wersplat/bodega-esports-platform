import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminAddTeam() {
  const [teamName, setTeamName] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      const { data, error } = await supabase.from('leagues').select('*').order('created_at', { ascending: false });
      if (error) console.error('Error fetching leagues:', error.message);
      else setLeagues(data);
    };
    fetchLeagues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!teamName || !selectedLeague) {
      setError('Please enter a team name and select a league.');
      return;
    }

    const { error: insertError } = await supabase.from('teams').insert([
      {
        name: teamName,
        league_id: selectedLeague,
        owner_id: null // Admin-created teams have no owner initially
      }
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess('Team successfully added!');
      setTeamName('');
      setSelectedLeague('');
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Admin: Add New Team</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
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

        <button type="submit" className="form-button" style={{ backgroundColor: '#3b82f6' }}>
          Add Team
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      </form>
    </div>
  );
}

export default AdminAddTeam;

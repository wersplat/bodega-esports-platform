import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [user, setUser] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [leagueName, setLeagueName] = useState('');
  const [maxTeams, setMaxTeams] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchLeagues();
    }
  }, [user]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    } else {
      setUser(user);
    }
  };

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*');
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const handleCreateLeague = async (e) => {
    e.preventDefault();

    if (!leagueName || !maxTeams) {
      alert('Please fill out all fields.');
      return;
    }

    const { data, error } = await supabase.from('leagues').insert([
      {
        name: leagueName,
        max_teams: parseInt(maxTeams),
        created_by: user.id,
      }
    ]);

    if (error) {
      console.error('Error creating league:', error.message);
    } else {
      alert('League created successfully!');
      setLeagueName('');
      setMaxTeams('');
      fetchLeagues(); // refresh list
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">🛡️ Admin Control Panel</h1>

      {/* Create League Form */}
      <div style={{ marginTop: '30px', marginBottom: '40px' }}>
        <h2>Create New League</h2>
        <form onSubmit={handleCreateLeague} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', gap: '10px' }}>
          <input
            type="text"
            placeholder="League Name"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            className="form-input"
          />
          <input
            type="number"
            placeholder="Max Teams"
            value={maxTeams}
            onChange={(e) => setMaxTeams(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="form-button" style={{ backgroundColor: '#16a34a' }}>
            Create League
          </button>
        </form>
      </div>

      {/* Manage Existing Leagues */}
      <div style={{ marginTop: '20px' }}>
        <h2>Manage Leagues</h2>
        {leagues.length === 0 ? (
          <p>No leagues yet.</p>
        ) : (
          <ul style={{ listStyle: 'disc inside', marginTop: '10px' }}>
            {leagues.map((league) => (
              <li key={league.id} style={{ marginBottom: '10px' }}>
                <strong>{league.name}</strong> (Max {league.max_teams} teams)
                <div style={{ marginTop: '5px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => navigate('/admin-bracket-generator')}
                    style={{ backgroundColor: '#3b82f6', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                  >
                    Generate Bracket
                  </button>
                  <button
                    onClick={() => navigate('/admin-mark-winner')}
                    style={{ backgroundColor: '#f59e0b', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                  >
                    Mark Winners
                  </button>
                  <button
                    onClick={() => navigate('/admin-advance-round')}
                    style={{ backgroundColor: '#10b981', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                  >
                    Advance Round
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Admin;

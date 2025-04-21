import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Admin() {
  const [leagues, setLeagues] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching leagues:', error.message);
    } else {
      setLeagues(data);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleCreateLeague = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('League name is required');
      return;
    }

    const { error } = await supabase.from('leagues').insert([{ name, description }]);

    if (error) {
      setError(error.message);
    } else {
      setName('');
      setDescription('');
      fetchLeagues(); // Refresh list
    }
  };

  const handleDeleteLeague = async (id) => {
    const { error } = await supabase.from('leagues').delete().eq('id', id);

    if (error) {
      alert('Failed to delete league.');
    } else {
      fetchLeagues(); // Refresh list
    }
  };

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>

      <form onSubmit={handleCreateLeague} className="form" style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="League Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="League Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-button" style={{ backgroundColor: '#10b981' }}>
          Create New League
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>

      <div style={{ marginTop: '40px' }}>
        <h2>Current Leagues</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {leagues.map((league) => (
            <li key={league.id} style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
              <h3>{league.name}</h3>
              <p>{league.description}</p>
              <button
                onClick={() => handleDeleteLeague(league.id)}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Admin;

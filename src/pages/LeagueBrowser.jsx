import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function LeagueBrowser() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching leagues:', error.message);
    } else {
      setLeagues(data);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Available Leagues</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {leagues.map((league) => (
          <li key={league.id} style={{ marginBottom: '20px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.18)' }}>
            <h3 style={{ color: '#f8fafc' }}>{league.name}</h3>
            <p style={{ color: '#cbd5e1' }}>{league.description}</p>
            <Link to={`/league/${league.id}`}>
              <button
                className="form-button"
                style={{ marginTop: '10px', backgroundColor: '#3b82f6' }}
              >
                View Registered Teams
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeagueBrowser;

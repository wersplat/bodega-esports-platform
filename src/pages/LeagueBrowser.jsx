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
    <div>
      <h1 className="page-title">Available Leagues</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {leagues.map((league) => (
          <li key={league.id} style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
            <h3>{league.name}</h3>
            <p>{league.description}</p>
            <Link to={`/league/${league.id}`}>
              <button
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
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

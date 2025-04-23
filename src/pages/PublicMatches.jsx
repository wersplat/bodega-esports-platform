import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function PublicMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        match_date,
        status,
        home_team_id,
        away_team_id,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name),
        leagues ( name )
      `)
      .order('match_date', { ascending: true });

    if (error) {
      console.error('Error fetching matches:', error.message);
    } else {
      setMatches(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: 24, color: '#cbd5e1' }}>Loading matches...</div>;
  }

  return (
    <div className="main-content">
      <h1 className="page-title">Upcoming Matches</h1>

      {matches.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No matches scheduled yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {matches.map((match) => (
            <li
              key={match.id}
              style={{
                background: '#222b3a',
                color: '#f8fafc',
                marginBottom: '20px',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 0 6px rgba(0,0,0,0.18)'
              }}
            >
              <h3 style={{ color: '#f8fafc' }}>{match.leagues?.name || 'Unknown League'}</h3>
              <p><strong>Date:</strong> {new Date(match.match_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {match.status}</p>
              <p><strong>Matchup:</strong> {match.home_team?.name || 'TBD'} vs {match.away_team?.name || 'TBD'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PublicMatches;

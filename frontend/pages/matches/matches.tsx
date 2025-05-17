import React, { useState, useEffect } from 'react';

interface Match {
  id: string | number;
  league_name?: string;
  match_date: string;
  status: string;
  home_team_name?: string;
  away_team_name?: string;
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/matches');
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 24, color: '#cbd5e1' }}>Loading matches...</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">All Matches</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.map((match) => (
          <li key={match.id} style={{
            background: '#222b3a',
            color: '#f8fafc',
            marginBottom: '20px',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 6px rgba(0,0,0,0.18)'
          }}>
            <h3 style={{ color: '#f8fafc' }}>{match.league_name || 'Unknown League'}</h3>
            <p><strong>Date:</strong> {new Date(match.match_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {match.status}</p>
            <p><strong>Matchup:</strong> {match.home_team_name || 'TBD'} vs {match.away_team_name || 'TBD'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Matches;

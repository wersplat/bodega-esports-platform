import React, { useState, useEffect } from 'react';

interface Match {
  id: string;
  league_name?: string;
  match_date: string;
  status: string;
  home_team_name?: string;
  away_team_name?: string;
}

const PublicMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMatches = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/matches/public');
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      // Optionally log or display error
    } finally {
      setLoading(false);
    }
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
            <li key={match.id} style={{
              background: '#222b3a',
              color: '#f8fafc',
              marginBottom: '20px',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 0 6px rgba(0,0,0,0.18)'
            }}>
              <h3>{match.league_name || 'Unknown League'}</h3>
              <p><strong>Date:</strong> {new Date(match.match_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {match.status}</p>
              <p><strong>Matchup:</strong> {match.home_team_name || 'TBD'} vs {match.away_team_name || 'TBD'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicMatches;

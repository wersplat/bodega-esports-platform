import React, { useState, useEffect } from 'react';

interface Match {
  id: string;
  league_id: string;
  round: number;
  team1_id: string;
  team2_id: string;
  winner_id?: string;
}

interface Team {
  id: string;
  name: string;
}

interface League {
  id: string;
  name: string;
}

const AdminMarkWinner: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const [mRes, tRes, lRes] = await Promise.all([
        fetch('https://api.bodegacatsgc.gg/matches'),
        fetch('https://api.bodegacatsgc.gg/teams'),
        fetch('https://api.bodegacatsgc.gg/leagues'),
      ]);
      const [m, t, l] = await Promise.all([mRes.json(), tRes.json(), lRes.json()]);
      setMatches(m);
      setTeams(t);
      setLeagues(l);
    } catch (err) {
      // console.error('Failed to fetch data', err);
    }
  };

  const getTeamName = (id: string): string => {
    const team = teams.find((t) => t.id === id);
    return team ? team.name : 'Unknown Team';
  };

  const getLeagueName = (id: string): string => {
    const league = leagues.find((l) => l.id === id);
    return league ? league.name : 'Unknown League';
  };

  const handleSetWinner = async (matchId: string, winnerId: string): Promise<void> => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/matches/${matchId}/winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner_id: winnerId }),
      });
      if (!res.ok) throw new Error('Failed to set winner');
      setMessage('Winner updated successfully!');
      fetchData();
    } catch (err) {
      setMessage('Error setting winner.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Admin: Mark Match Winners</h1>
      {message && <p style={{ marginTop: '10px', color: message.includes('success') ? '#34d399' : '#f87171' }}>{message}</p>}

      {matches.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No matches yet.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id} style={{ marginBottom: '20px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.18)' }}>
            <h3>{getLeagueName(match.league_id)}</h3>
            <p><strong>Round:</strong> {match.round}</p>
            <p><strong>Match:</strong> {getTeamName(match.team1_id)} vs {getTeamName(match.team2_id)}</p>
            <p><strong>Current Winner:</strong> {match.winner_id ? getTeamName(match.winner_id) : 'No winner yet'}</p>

            {match.team1_id && match.team2_id && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleSetWinner(match.id, match.team1_id)} className="form-button" style={{ backgroundColor: '#3b82f6' }}>
                  Set {getTeamName(match.team1_id)} as Winner
                </button>
                <button onClick={() => handleSetWinner(match.id, match.team2_id)} className="form-button" style={{ backgroundColor: '#10b981' }}>
                  Set {getTeamName(match.team2_id)} as Winner
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMarkWinner;

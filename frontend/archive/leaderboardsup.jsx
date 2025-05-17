import React, { useState, useEffect, useCallback } from 'react';

function LeaderboardStatic() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      fetchLeaderboard();
    }
  }, [selectedSeason, fetchLeaderboard]);

  const fetchSeasons = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/seasons');
      const data = await res.json();
      setSeasons(data);
      if (data.length > 0) setSelectedSeason(data[0].id);
    } catch (err) {
      // Error fetching seasons
    }
  };

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/leaderboard/simple?season_id=${selectedSeason}`);
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      // Error fetching leaderboard
    } finally {
      setLoading(false);
    }
  }, [selectedSeason]);

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Simple Leaderboard</h1>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 800, margin: '0 auto' }}>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="form-input"
          style={{ marginBottom: '20px' }}
        >
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {loading ? (
          <p style={{ color: '#cbd5e1' }}>Loading...</p>
        ) : players.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No players found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#1e293b', color: '#f8fafc', borderRadius: 8 }}>
            <thead>
              <tr style={{ background: '#273449' }}>
                <th style={th}>Player</th>
                <th style={th}>PTS</th>
                <th style={th}>AST</th>
                <th style={th}>REB</th>
                <th style={th}>Games</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.player_id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={td}>{p.username}</td>
                  <td style={td}>{p.points_per_game ?? '-'}</td>
                  <td style={td}>{p.assists_per_game ?? '-'}</td>
                  <td style={td}>{p.rebounds_per_game ?? '-'}</td>
                  <td style={td}>{p.games_played ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const th = { padding: '12px' };
const td = { padding: '8px', color: '#cbd5e1' };

export default LeaderboardStatic;

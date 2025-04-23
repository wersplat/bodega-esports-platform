// src/pages/Leaderboard.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Leaderboard() {
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
    const { data, error } = await supabase.from('seasons').select('id, name').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching seasons:', error.message);
    } else {
      setSeasons(data);
      if (data.length > 0) {
        setSelectedSeason(data[0].id);
      }
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('player_stats')
      .select('player_id, username, points_per_game, assists_per_game, rebounds_per_game, games_played')
      .eq('season_id', selectedSeason)
      .order('points_per_game', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard:', error.message);
    } else {
      setPlayers(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: 24, color: '#cbd5e1' }}>Loading leaderboard...</div>;
  }

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Leaderboard</h1>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 800, margin: '0 auto' }}>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="form-input"
          style={{ marginBottom: '20px' }}
        >
          <option value="">Select Season</option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>

        {players.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No players found for this season.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#1e293b', color: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
            <thead>
              <tr style={{ background: '#273449', color: '#f8fafc' }}>
                <th style={{ padding: '12px' }}>Player</th>
                <th style={{ padding: '12px' }}>Points/Game</th>
                <th style={{ padding: '12px' }}>Assists/Game</th>
                <th style={{ padding: '12px' }}>Rebounds/Game</th>
                <th style={{ padding: '12px' }}>Games Played</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.player_id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: 8, color: '#cbd5e1' }}>{player.username}</td>
                  <td style={{ padding: 8, color: '#f8fafc' }}>{player.points_per_game}</td>
                  <td style={{ padding: 8, color: '#f8fafc' }}>{player.assists_per_game}</td>
                  <td style={{ padding: 8, color: '#f8fafc' }}>{player.rebounds_per_game}</td>
                  <td style={{ padding: 8, color: '#f8fafc' }}>{player.games_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;

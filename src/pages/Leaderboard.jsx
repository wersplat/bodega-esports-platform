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
  }, [selectedSeason]);

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

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">📈 Player Leaderboard</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="form-input"
          style={{ minWidth: '200px' }}
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading...</div>
      ) : players.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No stats available yet.</p>
      ) : (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Player</th>
              <th>PPG</th>
              <th>APG</th>
              <th>RPG</th>
              <th>Games Played</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index}>
                <td>{player.username || 'Unknown'}</td>
                <td>{player.points_per_game ?? '-'}</td>
                <td>{player.assists_per_game ?? '-'}</td>
                <td>{player.rebounds_per_game ?? '-'}</td>
                <td>{player.games_played ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;

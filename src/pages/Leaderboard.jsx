import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TopScorersChart from '../components/TopScorersChart';

function Leaderboard() {
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedStat, setSelectedStat] = useState('points');

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/leaderboard', {
        params: {
          season_id: selectedSeason,
          team_id: selectedTeam || undefined,
          division_id: selectedDivision || undefined,
          stat_type: selectedStat || undefined,
        },
      });
      setPlayers(res.data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setPlayers([]);
    }
    setLoading(false);
  }, [selectedSeason, selectedTeam, selectedDivision, selectedStat]);

  useEffect(() => {
    fetchSeasons();
    fetchTeams();
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      fetchLeaderboard();
    }
  }, [fetchLeaderboard, selectedSeason]);

  const fetchSeasons = async () => {
    try {
      const { data } = await axios.get('/api/seasons');
      console.log('Seasons API Response:', data); // Debugging output
      if (Array.isArray(data)) {
        setSeasons(data);
        if (data.length > 0) setSelectedSeason(data[0].id);
      } else {
        console.error('Unexpected API response format for seasons:', data);
        setSeasons([]);
      }
    } catch (err) {
      console.error('Failed to fetch seasons:', err);
      setSeasons([]);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data } = await axios.get('/api/teams');
      setTeams(data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  };

  const fetchDivisions = async () => {
    try {
      const { data } = await axios.get('/api/divisions');
      setDivisions(data);
    } catch (err) {
      console.error('Failed to fetch divisions:', err);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Leaderboard</h1>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 1000, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="form-input">
            <option value="">Season</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="form-input">
            <option value="">Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="form-input">
            <option value="">Division</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select value={selectedStat} onChange={(e) => setSelectedStat(e.target.value)} className="form-input">
            <option value="points">Points</option>
            <option value="assists">Assists</option>
            <option value="rebounds">Rebounds</option>
            <option value="win_percentage">Win %</option>
          </select>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button onClick={() => {}} className="form-input" style={{ background: '#0ea5e9' }}>📄 Export CSV</button>
          <button onClick={() => {}} className="form-input" style={{ background: '#10b981' }}>📊 Export to Sheets</button>
        </div>

        {/* Leaderboard Table */}
        {loading ? (
          <p style={{ color: '#cbd5e1' }}>Loading leaderboard...</p>
        ) : !Array.isArray(players) || players.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No players found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#1e293b', color: '#f8fafc', borderRadius: 8 }}>
            <thead>
              <tr style={{ background: '#273449' }}>
                <th style={{ padding: '12px' }}>Player</th>
                <th style={{ padding: '12px' }}>Team</th>
                <th style={{ padding: '12px' }}>Points</th>
                <th style={{ padding: '12px' }}>Assists</th>
                <th style={{ padding: '12px' }}>Rebounds</th>
                <th style={{ padding: '12px' }}>Win %</th>
                <th style={{ padding: '12px' }}>Games</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.player_id}>
                  <td style={{ padding: 8 }}>{p.username || 'N/A'}</td>
                  <td style={{ padding: 8 }}>{p.team_name || 'N/A'}</td>
                  <td style={{ padding: 8 }}>{p.points_per_game ?? '-'}</td>
                  <td style={{ padding: 8 }}>{p.assists_per_game ?? '-'}</td>
                  <td style={{ padding: 8 }}>{p.rebounds_per_game ?? '-'}</td>
                  <td style={{ padding: 8 }}>{p.win_percentage !== undefined ? `${(p.win_percentage * 100).toFixed(1)}%` : '-'}</td>
                  <td style={{ padding: 8 }}>{p.games_played ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Optional chart */}
        <div style={{ marginTop: 40 }}>
          <TopScorersChart seasonId={selectedSeason} />
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;

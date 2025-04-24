import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchSeasons();
    fetchTeams();
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (selectedSeason) fetchLeaderboard();
  }, [selectedSeason, selectedTeam, selectedDivision, selectedStat]);

  const fetchSeasons = async () => {
    const { data } = await axios.get('/api/seasons');
    setSeasons(data);
    if (data.length > 0) setSelectedSeason(data[0].id);
  };

  const fetchTeams = async () => {
    const { data } = await axios.get('/api/teams');
    setTeams(data);
  };

  const fetchDivisions = async () => {
    const { data } = await axios.get('/api/divisions');
    setDivisions(data);
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/leaderboard', {
        params: {
          season_id: selectedSeason,
          team_id: selectedTeam || undefined,
          division_id: selectedDivision || undefined,
          stat_type: selectedStat || undefined,
        },
      });
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
    setLoading(false);
  };

  const exportCSV = async () => {
    try {
      const res = await axios.get('/api/leaderboard/export/csv', {
        params: {
          season_id: selectedSeason,
          team_id: selectedTeam || undefined,
          division_id: selectedDivision || undefined,
          stat_type: selectedStat || undefined,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leaderboard.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('CSV export error:', err);
    }
  };

  const exportSheets = async () => {
    try {
      await axios.post('/api/leaderboard/export/sheets', {
        season_id: selectedSeason,
        team_id: selectedTeam || null,
        division_id: selectedDivision || null,
        stat_type: selectedStat || 'points',
      });
      alert('Exported to Google Sheets successfully!');
    } catch (err) {
      console.error('Sheets export error:', err);
      alert('Failed to export to Google Sheets.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Leaderboard</h1>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 1000, margin: '0 auto' }}>
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

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button onClick={exportCSV} className="form-input" style={{ background: '#0ea5e9' }}>📄 Export CSV</button>
          <button onClick={exportSheets} className="form-input" style={{ background: '#10b981' }}>📊 Export to Sheets</button>
        </div>

        {loading ? (
          <p style={{ color: '#cbd5e1' }}>Loading leaderboard...</p>
        ) : players.length === 0 ? (
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
                  <td style={{ padding: 8 }}>{p.username}</td>
                  <td style={{ padding: 8 }}>{p.team_name}</td>
                  <td style={{ padding: 8 }}>{p.points_per_game}</td>
                  <td style={{ padding: 8 }}>{p.assists_per_game}</td>
                  <td style={{ padding: 8 }}>{p.rebounds_per_game}</td>
                  <td style={{ padding: 8 }}>{(p.win_percentage * 100).toFixed(1)}%</td>
                  <td style={{ padding: 8 }}>{p.games_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 40 }}>
          <TopScorersChart seasonId={selectedSeason} />
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import TopScorersChart from '../../components/TopScorersChart';
import { toast } from 'react-hot-toast';

interface Season {
  id: string;
  name: string;
}
interface Team {
  id: string;
  name: string;
}
interface Player {
  player_id: string;
  username?: string;
  team_name?: string;
  points_per_game?: number;
  assists_per_game?: number;
  rebounds_per_game?: number;
  win_percentage?: number;
  games_played?: number;
}

const API_BASE = 'https://api.bodegacatsgc.gg';

const Leaderboard: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedStat, setSelectedStat] = useState<string>('points');

  const fetchSeasons = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/seasons`);
      if (Array.isArray(data)) {
        setSeasons(data);
        if (data.length > 0) setSelectedSeason(data[0].id);
      } else {
        toast.error('Unexpected API response format for seasons');
      }
    } catch (error) {
      toast.error('Failed to fetch seasons');
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/teams`);
      if (Array.isArray(data)) {
        setTeams(data);
      } else {
        toast.error('Unexpected API response format for teams');
      }
    } catch (error) {
      toast.error('Failed to fetch teams');
    }
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/leaderboard`, {
        params: {
          season_id: selectedSeason,
          team_id: selectedTeam || undefined,
          stat_type: selectedStat || undefined,
        },
      });
      setPlayers(res.data || []);
    } catch (err) {
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSeason, selectedTeam, selectedStat]);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (selectedSeason) {
      fetchLeaderboard();
    }
  }, [fetchLeaderboard, selectedSeason]);

  return (
    <div className="main-content">
      <h1 className="page-title">3c6 Leaderboard</h1>

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

          <select value={selectedStat} onChange={(e) => setSelectedStat(e.target.value)} className="form-input">
            <option value="points">Points</option>
            <option value="assists">Assists</option>
            <option value="rebounds">Rebounds</option>
            <option value="win_percentage">Win %</option>
          </select>
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
};

export default Leaderboard;

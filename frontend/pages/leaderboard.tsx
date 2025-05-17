import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { NextPage } from 'next';
import TopScorersChart from '@/components/TopScorersChart';

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

const Leaderboard: NextPage = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedStat, setSelectedStat] = useState<string>('points');

  const fetchSeasons = useCallback(async (): Promise<void> => {
    try {
      const { data } = await axios.get<Season[]>(`${API_BASE}/api/seasons`);
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

  const fetchTeams = useCallback(async (): Promise<void> => {
    try {
      const { data } = await axios.get<Team[]>(`${API_BASE}/api/teams`);
      if (Array.isArray(data)) {
        setTeams(data);
      } else {
        toast.error('Unexpected API response format for teams');
      }
    } catch (error) {
      toast.error('Failed to fetch teams');
    }
  }, []);

  const fetchLeaderboard = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.get<Player[]>(`${API_BASE}/api/leaderboard`, {
        params: {
          season_id: selectedSeason,
          team_id: selectedTeam || undefined,
          stat_type: selectedStat || undefined,
        },
      });
      setPlayers(data || []);
    } catch (err) {
      setPlayers([]);
      toast.error('Failed to fetch leaderboard data');
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
      <h1 className="page-title">3c6 Leaderboard</h1>

      <div style={{ 
        background: '#1e293b', 
        borderRadius: 12, 
        padding: 24, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)', 
        maxWidth: 1000, 
        margin: '0 auto' 
      }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <select 
            value={selectedSeason} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSeason(e.target.value)} 
            className="form-input"
            disabled={loading}
          >
            <option value="">Select Season</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select 
            value={selectedTeam} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTeam(e.target.value)}
            className="form-input"
            disabled={loading}
          >
            <option value="">All Teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select 
            value={selectedStat} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStat(e.target.value)}
            className="form-input"
            disabled={loading}
          >
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-700">
                  <th className="p-3 text-left">Player</th>
                  <th className="p-3 text-left">Team</th>
                  <th className="p-3 text-right">Points</th>
                  <th className="p-3 text-right">Assists</th>
                  <th className="p-3 text-right">Rebounds</th>
                  <th className="p-3 text-right">Win %</th>
                  <th className="p-3 text-right">Games</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.player_id} className="border-t border-slate-600 hover:bg-slate-700">
                    <td className="p-3">{player.username || 'N/A'}</td>
                    <td className="p-3">{player.team_name || 'N/A'}</td>
                    <td className="p-3 text-right">{player.points_per_game?.toFixed(1) || '-'}</td>
                    <td className="p-3 text-right">{player.assists_per_game?.toFixed(1) || '-'}</td>
                    <td className="p-3 text-right">{player.rebounds_per_game?.toFixed(1) || '-'}</td>
                    <td className="p-3 text-right">
                      {player.win_percentage !== undefined ? `${(player.win_percentage * 100).toFixed(1)}%` : '-'}
                    </td>
                    <td className="p-3 text-right">{player.games_played || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Chart Section */}
        {selectedSeason && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Top Scorers</h2>
            <div className="bg-slate-800 p-4 rounded-lg">
              <TopScorersChart seasonId={selectedSeason} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Leaderboard() {
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [players, setPlayers] = useState([]);

  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [statType, setStatType] = useState("points_per_game");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [seasonRes, teamRes, divisionRes] = await Promise.all([
          axios.get("/api/seasons"),
          axios.get("/api/teams"),
          axios.get("/api/divisions"),
        ]);
        setSeasons(seasonRes.data);
        setTeams(teamRes.data);
        setDivisions(divisionRes.data);

        if (seasonRes.data.length > 0) {
          setSelectedSeason(seasonRes.data[0].id);
        }
      } catch (err) {
        setError("Error loading filter options.");
      }
    };
    fetchFilters();
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedSeason) return;

      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/leaderboard", {
          params: {
            season_id: selectedSeason,
            team_id: selectedTeam || undefined,
            division_id: selectedDivision || undefined,
            stat_type: statType || undefined,
          },
        });
        setPlayers(res.data);
      } catch (err) {
        setError("Failed to load leaderboard data.");
        setPlayers([]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [selectedSeason, selectedTeam, selectedDivision, statType]);

  const exportCSV = () => {
    const headers = ["Player", "Points", "Assists", "Rebounds", "Win %"];
    const rows = players.map(p => [p.username, p.points_per_game, p.assists_per_game, p.rebounds_per_game, p.win_percentage]);

    let csv = headers.join(",") + "\n" + rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "leaderboard.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSheets = async () => {
    try {
      await axios.get("/api/leaderboard/export/sheets", {
        params: { season_id: selectedSeason }
      });
      alert("Exported to Google Sheets!");
    } catch {
      alert("Failed to export to Google Sheets.");
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Leaderboard</h1>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.25)", maxWidth: 900, margin: "0 auto" }}>
        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <select className="form-input" value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
            <option value="">Select Season</option>
            {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="form-input" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
            <option value="">All Teams</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className="form-input" value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)}>
            <option value="">All Divisions</option>
            {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="form-input" value={statType} onChange={(e) => setStatType(e.target.value)}>
            <option value="points_per_game">Points</option>
            <option value="assists_per_game">Assists</option>
            <option value="rebounds_per_game">Rebounds</option>
          </select>
        </div>

        {/* Actions */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={exportCSV} className="btn-secondary" style={{ marginRight: 12 }}>📄 Download CSV</button>
          <button onClick={exportSheets} className="btn-primary">📤 Export to Sheets</button>
        </div>

        {/* Status */}
        {loading && <p style={{ color: "#cbd5e1" }}>Loading leaderboard...</p>}
        {error && <p style={{ color: "salmon" }}>{error}</p>}

        {/* Table */}
        {!loading && !error && players.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, background: "#1e293b", color: "#f8fafc", borderRadius: 8 }}>
            <thead>
              <tr style={{ background: "#273449" }}>
                <th style={{ padding: 12 }}>Player</th>
                <th style={{ padding: 12 }}>Points/Game</th>
                <th style={{ padding: 12 }}>Assists/Game</th>
                <th style={{ padding: 12 }}>Rebounds/Game</th>
                <th style={{ padding: 12 }}>Win %</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.player_id} style={{ borderBottom: "1px solid #334155" }}>
                  <td style={{ padding: 8 }}>{player.username}</td>
                  <td style={{ padding: 8 }}>{player.points_per_game}</td>
                  <td style={{ padding: 8 }}>{player.assists_per_game}</td>
                  <td style={{ padding: 8 }}>{player.rebounds_per_game}</td>
                  <td style={{ padding: 8 }}>{player.win_percentage}%</td>
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

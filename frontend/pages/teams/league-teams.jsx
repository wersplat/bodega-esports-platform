import React, { useEffect, useState, useCallback } from 'react';

function LeagueTeams() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    const res = await fetch('https://api.bodegacatsgc.gg/leagues');
    const data = await res.json();
    setLeagues(data);
  };

  const fetchTeams = useCallback(async () => {
    const res = await fetch(`https://api.bodegacatsgc.gg/teams?league_id=${selectedLeague}`);
    const data = await res.json();
    setTeams(data);
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedLeague) fetchTeams();
  }, [selectedLeague, fetchTeams]);

  return (
    <div className="main-content">
      <h1 className="page-title">League Teams</h1>

      <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="form-input" style={{ marginBottom: 20 }}>
        <option value="">Select League</option>
        {leagues.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {teams.map((team) => (
          <li key={team.id} style={{
            background: '#222b3a',
            color: '#f8fafc',
            marginBottom: '20px',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 6px rgba(0,0,0,0.18)'
          }}>
            <h3>{team.name}</h3>
            <p>Wins: {team.wins} | Losses: {team.losses}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeagueTeams;

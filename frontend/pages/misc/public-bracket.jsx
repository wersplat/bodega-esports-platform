import React, { useState, useEffect, useCallback } from 'react';

function PublicBracket() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchLeagues();
    fetchTeams();
  }, []);

  const fetchLeagues = async () => {
    const res = await fetch('https://api.bodegacatsgc.gg/leagues');
    const data = await res.json();
    setLeagues(data);
  };

  const fetchTeams = async () => {
    const res = await fetch('https://api.bodegacatsgc.gg/teams');
    const data = await res.json();
    setTeams(data);
  };

  const fetchMatches = useCallback(async () => {
    const res = await fetch(`https://api.bodegacatsgc.gg/matches/bracket?league_id=${selectedLeague}`);
    const data = await res.json();
    setMatches(data);
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedLeague) fetchMatches();
  }, [selectedLeague, fetchMatches]);

  const getTeamName = (id) => {
    if (!id) return 'BYE';
    const t = teams.find((team) => team.id === id);
    return t ? t.name : 'Unknown';
  };

  const groupByRound = () => {
    const map = {};
    matches.forEach((m) => {
      if (!map[m.round]) map[m.round] = [];
      map[m.round].push(m);
    });
    return map;
  };

  const rounds = groupByRound();

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Public Bracket</h1>

      <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="form-input" style={{ marginBottom: 16 }}>
        <option value="">Select League</option>
        {leagues.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
      </select>

      <button onClick={fetchMatches} className="form-button" style={{ marginBottom: 20 }}>
        Refresh Bracket
      </button>

      {matches.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No matches available.</p>
      ) : (
        <div style={{ display: 'flex', gap: '30px', overflowX: 'auto' }}>
          {Object.keys(rounds).sort().map((r) => (
            <div key={r} style={{ minWidth: '250px' }}>
              <h3 style={{ color: '#facc15', marginBottom: 12 }}>
                {rounds[r].length === 1 ? '🏆 Final' : `Round ${r}`}
              </h3>
              {rounds[r].map((m) => (
                <div key={m.id} style={{
                  padding: '10px',
                  background: '#fff',
                  borderRadius: 8,
                  marginBottom: 12,
                  textAlign: 'center'
                }}>
                  <strong>{getTeamName(m.team1_id)}</strong> vs <strong>{getTeamName(m.team2_id)}</strong><br />
                  {m.winner_id
                    ? <span style={{ color: 'green' }}>Winner: {getTeamName(m.winner_id)}</span>
                    : <span style={{ color: 'gray' }}>Pending</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicBracket;

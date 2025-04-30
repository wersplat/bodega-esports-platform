import React, { useEffect, useState } from 'react';

function RegisterTeam() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [msg, setMsg] = useState('');

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
    const res = await fetch('https://api.bodegacatsgc.gg/teams/mine');
    const data = await res.json();
    setTeams(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          league_id: selectedLeague,
          team_id: selectedTeam,
        }),
      });
      if (!res.ok) throw new Error('Registration failed');
      setMsg('✅ Team registered successfully!');
    } catch {
      setMsg('❌ Could not register team.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Register Your Team</h1>

      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 500 }}>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="form-input" required>
          <option value="">Select Your Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="form-input" required>
          <option value="">Select League</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <button type="submit" className="form-button">Register Team</button>
        {msg && <p style={{ marginTop: 10, color: msg.includes('✅') ? '#34d399' : '#f87171' }}>{msg}</p>}
      </form>
    </div>
  );
}

export default RegisterTeam;

import React, { useEffect, useState } from 'react';

function OwnerSendContract() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [termEnd, setTermEnd] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    const res = await fetch('https://api.bodegacatsgc.gg/profiles');
    const data = await res.json();
    setPlayers(data);
  };

  const fetchTeams = async () => {
    const res = await fetch('https://api.bodegacatsgc.gg/teams/mine');
    const data = await res.json();
    setTeams(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: selectedTeam,
          player_id: selectedPlayer,
          term_end: termEnd,
        }),
      });
      if (!res.ok) throw new Error('Failed to send contract');
      setMessage('Contract offer sent!');
    } catch {
      setMessage('Failed to send.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Send Contract Offer</h1>

      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 500, margin: '0 auto' }}>
        <select className="form-input" value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} required>
          <option value="">Select Player</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.username}</option>
          ))}
        </select>

        <select className="form-input" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} required>
          <option value="">Select Your Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <input type="date" className="form-input" value={termEnd} onChange={(e) => setTermEnd(e.target.value)} required />

        <button type="submit" className="form-button">Send Offer</button>
        {message && <p style={{ marginTop: 12, color: message.includes('sent') ? '#34d399' : '#f87171' }}>{message}</p>}
      </form>
    </div>
  );
}

export default OwnerSendContract;

import { useEffect, useState } from 'react';

export default function SubmitPlayerStats() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [stats, setStats] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchEligible();
  }, []);

  const fetchEligible = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/player/matches/eligible');
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setStats({ ...stats, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/player-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_id: selectedMatch,
          ...stats,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setMsg('✅ Stats submitted!');
      setSelectedMatch('');
      setStats({});
    } catch {
      setMsg('❌ Submission error');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Submit Player Stats</h1>

      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 500 }}>
        <select value={selectedMatch} onChange={(e) => setSelectedMatch(e.target.value)} className="form-input" required>
          <option value="">Select Match</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.home_team_name} vs {m.away_team_name}
            </option>
          ))}
        </select>

        {['points', 'assists', 'rebounds', 'steals', 'blocks', 'turnovers'].map((stat) => (
          <input
            key={stat}
            type="number"
            name={stat}
            value={stats[stat] || ''}
            onChange={handleChange}
            placeholder={stat.toUpperCase()}
            className="form-input"
          />
        ))}

        <button type="submit" className="form-button">Submit</button>
        {msg && <p style={{ marginTop: 12, color: msg.startsWith('✅') ? '#34d399' : '#f87171' }}>{msg}</p>}
      </form>
    </div>
  );
}

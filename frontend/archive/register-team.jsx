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
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">Register Your Team</h1>
          <p className="text-[#94a3b8] mb-4">Sign up your team for a league</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-lg shadow-md p-6 space-y-4">
          <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="form-input w-full" required>
            <option value="">Select Your Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="form-input w-full" required>
            <option value="">Select League</option>
            {leagues.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <button type="submit" className="form-button w-full bg-[#e11d48] text-[#f8fafc] hover:bg-[#be123c] transition-all duration-200">Register Team</button>
          {msg && <p className={`mt-2 text-center text-sm ${msg.includes('✅') ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{msg}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterTeam;

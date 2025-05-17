import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

function AdminAddTeam() {
  const [teamName, setTeamName] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchLeagues();
    fetchSeasons();
  }, []);

  const fetchLeagues = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      // console.error('Failed to fetch leagues:', err);
    }
  };

  const fetchSeasons = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/seasons');
      const data = await res.json();
      setSeasons(data);
    } catch (err) {
      // console.error('Failed to fetch seasons:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!teamName || !selectedLeague || !selectedSeason) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch('https://api.bodegacatsgc.gg/teams/admin-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          league_id: selectedLeague,
          season_id: selectedSeason,
        }),
      });

      if (!res.ok) throw new Error('Failed to add team');

      setSuccess('Team successfully added and registered!');
      setTeamName('');
      setSelectedLeague('');
      setSelectedSeason('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
          ← Back to Admin Dashboard
        </button>

        <h1 className="page-title">Admin: Add New Team</h1>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '40px',
          background: '#1e293b',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
        }}>
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="form-input"
            required
          />

          <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)} className="form-input" required>
            <option value="">Select League</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>

          <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="form-input" required>
            <option value="">Select Season</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>{season.name}</option>
            ))}
          </select>

          <button type="submit" className="form-button">Add Team</button>
          {error && <p style={{ color: '#f87171' }}>{error}</p>}
          {success && <p style={{ color: '#34d399' }}>{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default AdminAddTeam;

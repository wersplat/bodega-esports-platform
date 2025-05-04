import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function LeagueSettings() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [settings, setSettings] = useState({
    roster_lock: false,
    auto_advance: true,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeagueId) fetchSeasons();
  }, [selectedLeagueId]);

  useEffect(() => {
    if (selectedSeasonId) fetchSettings();
  }, [selectedSeasonId]);

  const fetchLeagues = async () => {
    setError('');
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      if (!res.ok) throw new Error('Failed to fetch leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      setError('Could not load leagues.');
    }
  };

  const fetchSeasons = async () => {
    setError('');
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/seasons?league_id=${selectedLeagueId}`);
      if (!res.ok) throw new Error('Failed to fetch seasons');
      const data = await res.json();
      setSeasons(data);
    } catch (err) {
      setError('Could not load seasons.');
    }
  };

  const fetchSettings = async () => {
    setError('');
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/league-settings?league_id=${selectedLeagueId}&season_id=${selectedSeasonId}`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings({
        roster_lock: !!data.roster_lock,
        auto_advance: !!data.auto_advance,
      });
    } catch (err) {
      setError('Could not load league settings.');
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setError('');
    if (!selectedLeagueId || !selectedSeasonId) {
      setError('Please select both league and season.');
      return;
    }

    try {
      const res = await fetch('https://api.bodegacatsgc.gg/league-settings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          league_id: selectedLeagueId,
          season_id: selectedSeasonId,
          ...settings,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError('Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">League Settings</h1>
      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
        ← Back to Admin Dashboard
      </button>

      <div className="form-container">
        {error && <div style={{ color: '#f87171', marginBottom: 12 }}>{error}</div>}
        <select value={selectedLeagueId} onChange={(e) => setSelectedLeagueId(e.target.value)} className="form-input">
          <option value="">-- Select League --</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        {selectedLeagueId && (
          <select value={selectedSeasonId} onChange={(e) => setSelectedSeasonId(e.target.value)} className="form-input" style={{ marginTop: '16px' }}>
            <option value="">-- Select Season --</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}

        {selectedSeasonId && (
          <div style={{ marginTop: '24px' }}>
            <label className="block mb-2">Roster Lock</label>
            <input type="checkbox" checked={settings.roster_lock} onChange={() => handleToggle('roster_lock')} />

            <label className="block mt-4 mb-2">Auto Advance</label>
            <input type="checkbox" checked={settings.auto_advance} onChange={() => handleToggle('auto_advance')} />

            <div style={{ marginTop: '24px' }}>
              <button onClick={handleSave} className="form-button">Save Settings</button>
              {saved && <p className="text-green-500 mt-2">✅ Saved</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeagueSettings;

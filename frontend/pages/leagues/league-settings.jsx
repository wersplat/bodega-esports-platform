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
    const res = await fetch('https://api.bodegacatsgc.gg/leagues');
    const data = await res.json();
    setLeagues(data);
  };

  const fetchSeasons = async () => {
    const res = await fetch(`https://api.bodegacatsgc.gg/seasons?league_id=${selectedLeagueId}`);
    const data = await res.json();
    setSeasons(data);
  };

  const fetchSettings = async () => {
    const res = await fetch(`https://api.bodegacatsgc.gg/league-settings?league_id=${selectedLeagueId}&season_id=${selectedSeasonId}`);
    if (res.ok) {
      const data = await res.json();
      setSettings({
        roster_lock: !!data.roster_lock,
        auto_advance: !!data.auto_advance,
      });
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!selectedLeagueId || !selectedSeasonId) {
      alert('Please select both league and season.');
      return;
    }

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
      alert('Failed to save settings');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">League Settings</h1>
      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
        ← Back to Admin Dashboard
      </button>

      <div className="form-container">
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

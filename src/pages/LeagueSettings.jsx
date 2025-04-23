// src/pages/LeagueSettings.jsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
}

function LeagueSettings() {
  const [loading, setLoading] = useState(true);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState(
    localStorage.getItem('selectedLeagueId') || ''
  );
  const [settings, setSettings] = useState({
    roster_lock: false,
    auto_advance: true,
  });
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  // Verify admin access
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        navigate('/');
      }
    };
    checkAdmin();
  }, [navigate]);

  // Load leagues on page load
  useEffect(() => {
    const loadLeagues = async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('id, name, start_date, end_date')
        .order('created_at', { ascending: false });

      if (!error) setLeagues(data);
      setLoading(false);
    };
    loadLeagues();
  }, []);

  // Load league settings when league is selected
  useEffect(() => {
    if (!selectedLeagueId) return;

    localStorage.setItem('selectedLeagueId', selectedLeagueId);

    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('league_settings')
        .select('*')
        .eq('league_id', selectedLeagueId)
        .single();

      if (!error && data) {
        setSettings({
          roster_lock: data.roster_lock,
          auto_advance: data.auto_advance,
        });
      } else {
        setSettings({
          roster_lock: false,
          auto_advance: true,
        });
      }
    };

    loadSettings();
  }, [selectedLeagueId]);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!selectedLeagueId) return;

    const { error } = await supabase.from('league_settings').upsert({
      league_id: selectedLeagueId,
      ...settings,
    }, { onConflict: 'league_id' });

    if (error) {
      alert('Failed to save settings.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">League Settings</h1>

      <div className="form-container">
        <label htmlFor="league" className="block font-bold mb-2">Select League</label>
        <select
          id="league"
          value={selectedLeagueId}
          onChange={(e) => setSelectedLeagueId(e.target.value)}
          className="form-input"
        >
          <option value="">-- Select a League --</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name} ({formatDate(league.start_date)} → {formatDate(league.end_date)})
            </option>
          ))}
        </select>

        {selectedLeagueId && (
          <>
            <div className="mt-4">
              <label className="block font-bold mb-2">Roster Lock</label>
              <input
                type="checkbox"
                checked={settings.roster_lock}
                onChange={() => handleToggle('roster_lock')}
              />
            </div>

            <div className="mt-4">
              <label className="block font-bold mb-2">Auto Advance</label>
              <input
                type="checkbox"
                checked={settings.auto_advance}
                onChange={() => handleToggle('auto_advance')}
              />
            </div>

            <div className="mt-6">
              <button onClick={handleSave} className="form-button">
                💾 Save Settings
              </button>
              {saved && <p className="text-green-600 mt-2">✅ Saved!</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LeagueSettings;

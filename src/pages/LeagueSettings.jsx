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
  const [selectedLeagueId, setSelectedLeagueId] = useState(''); // State for selected league
  const [settings, setSettings] = useState({
    roster_lock: false,
    auto_advance: true,
  });
  const [saved, setSaved] = useState(false);
  const [seasons, setSeasons] = useState([]); // State for seasons
  const [selectedSeasonId, setSelectedSeasonId] = useState(''); // State for selected season

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

  // Load seasons on league change
  useEffect(() => {
    if (!selectedLeagueId) {
      setSelectedSeasonId(''); // Clear selected season if no league is selected
      return;
    }

    const loadSeasons = async () => {
      const { data, error } = await supabase
        .from('seasons')
        .select('id, name, start_date, end_date')
        .eq('league_id', selectedLeagueId) // Filter seasons by selected league
        .order('created_at', { ascending: false });

      if (!error) setSeasons(data);
    };

    loadSeasons();
  }, [selectedLeagueId]);

  // Load league settings when league or season is selected
  useEffect(() => {
    if (!selectedSeasonId) return;

    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('league_settings')
        .select('*')
        .eq('league_id', selectedLeagueId)
        .eq('season_id', selectedSeasonId)
        .single();

      const { data: seasonData } = await supabase
        .from('seasons')
        .select('roster_lock_date')
        .eq('id', selectedSeasonId)
        .single();

      if (!error && data) {
        setSettings({
          roster_lock: seasonData?.roster_lock_date ? true : data.roster_lock,
          auto_advance: data.auto_advance,
        });
      } else {
        setSettings({
          roster_lock: seasonData?.roster_lock_date ? true : false,
          auto_advance: true,
        });
      }
    };

    loadSettings();
  }, [selectedSeasonId, selectedLeagueId]);

  const handleToggle = (key) => {
    if (key === 'roster_lock' && settings.roster_lock) {
      const confirmClear = window.confirm(
        'Disabling roster lock will clear the roster lock date. Are you sure?'
      );
      if (!confirmClear) return;

      supabase
        .from('seasons')
        .update({ roster_lock_date: null })
        .eq('id', selectedSeasonId); // Clear roster_lock_date when toggling off
    }

    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (settings.roster_lock && !settings.roster_lock_date) {
      supabase
        .from('seasons')
        .select('roster_lock_date')
        .eq('id', selectedSeasonId)
        .single()
        .then(({ data }) => {
          if (data?.roster_lock_date) {
            setSettings((prev) => ({
              ...prev,
              roster_lock_date: data.roster_lock_date,
            }));
          }
        });
    }
  }, [settings.roster_lock, settings.roster_lock_date, selectedSeasonId]);

  const handleSave = async () => {
    if (!selectedLeagueId || !selectedSeasonId) {
      alert('Please select a league and season before saving.');
      return;
    }

    const { error: leagueError } = await supabase.from('league_settings').upsert({
      league_id: selectedLeagueId,
      season_id: selectedSeasonId, // Include season_id for proper association
      roster_lock: settings.roster_lock,
      auto_advance: settings.auto_advance,
    }, { onConflict: ['league_id', 'season_id'] }); // Ensure conflict resolution includes season_id

    const { error: seasonError } = await supabase.from('seasons').update({
      roster_lock_date: settings.roster_lock ? settings.roster_lock_date : null, // Save or clear roster_lock_date
    }).eq('id', selectedSeasonId);

    if (leagueError || seasonError) {
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
            <label htmlFor="season" className="block font-bold mb-2 mt-4">Select Season</label>
            <select
              id="season"
              value={selectedSeasonId}
              onChange={(e) => setSelectedSeasonId(e.target.value)}
              className="form-input"
            >
              <option value="">-- Select a Season --</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name} ({formatDate(season.start_date)} → {formatDate(season.end_date)})
                </option>
              ))}
            </select>
          </>
        )}

        {selectedSeasonId && (
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

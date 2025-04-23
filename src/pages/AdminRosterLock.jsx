import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminRosterLock() {
  const [leagues, setLeagues] = useState([]); // State for leagues
  const [selectedLeagueId, setSelectedLeagueId] = useState(''); // State for selected league
  const [seasons, setSeasons] = useState([]);
  const [selected, setSelected] = useState('');
  const [lockDate, setLockDate] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const loadLeagues = async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (!error) setLeagues(data);
    };

    loadLeagues();
  }, []);

  useEffect(() => {
    if (!selectedLeagueId) {
      setSelected(''); // Clear selected season if no league is selected
      setSeasons([]); // Clear seasons list
      return;
    }

    const loadSeasons = async () => {
      const { data, error } = await supabase
        .from('seasons')
        .select('id, name, roster_lock_date')
        .eq('league_id', selectedLeagueId) // Filter seasons by selected league
        .order('created_at', { ascending: false });

      if (!error) setSeasons(data);
    };

    loadSeasons();
  }, [selectedLeagueId]);

  useEffect(() => {
    if (selected) {
      supabase
        .from('seasons')
        .select('roster_lock_date')
        .eq('id', selected)
        .single()
        .then(({ data }) => {
          if (data?.roster_lock_date) {
            setLockDate(data.roster_lock_date); // Ensure lockDate reflects the current state
          }
        });
    }
  }, [selected]);

  const applyLock = async () => {
    if (!selected || !lockDate) {
      setMsg('Select season and date');
      return;
    }

    const confirmApply = window.confirm(
      `Are you sure you want to set the roster lock date to ${lockDate} for the selected season?`
    );
    if (!confirmApply) return;

    const { error } = await supabase
      .from('seasons')
      .update({ roster_lock_date: lockDate })
      .eq('id', selected);

    if (error) {
      setMsg('Failed to save lock date.');
    } else {
      setMsg('Lock date saved ✅');
      setLockDate(lockDate); // Update local lockDate state

      // Refetch seasons to ensure UI reflects the latest state
      const { data, error: fetchError } = await supabase
        .from('seasons')
        .select('id, name, roster_lock_date')
        .eq('league_id', selectedLeagueId)
        .order('created_at', { ascending: false });

      if (!fetchError) setSeasons(data);
    }
  };

  const clearLock = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear the roster lock date for the selected season?'
    );
    if (!confirmClear) return;

    const { error } = await supabase
      .from('seasons')
      .update({ roster_lock_date: null })
      .eq('id', selected);

    if (error) {
      setMsg('Failed to clear lock date.');
    } else {
      setMsg('Lock cleared');
      setLockDate(''); // Clear local lockDate state

      // Refetch seasons to ensure UI reflects the latest state
      const { data, error: fetchError } = await supabase
        .from('seasons')
        .select('id, name, roster_lock_date')
        .eq('league_id', selectedLeagueId)
        .order('created_at', { ascending: false });

      if (!fetchError) setSeasons(data);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Roster‑Lock Manager</h1>

      <button onClick={() => nav('/admin')} className="form-button" style={{ marginBottom: 24 }}>
        ← Back
      </button>

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
              {league.name}
            </option>
          ))}
        </select>

        {selectedLeagueId && (
          <>
            <label htmlFor="season" className="block font-bold mb-2 mt-4">Select Season</label>
            <select
              id="season"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="form-input"
            >
              <option value="">-- Select a Season --</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name} (Lock Date: {season.roster_lock_date || 'None'})
                </option>
              ))}
            </select>
          </>
        )}

        {selected && (
          <>
            <div className="mt-4">
              <label htmlFor="lock-date" className="block font-bold mb-2">Set Roster Lock Date</label>
              <input
                id="lock-date"
                type="date"
                value={lockDate}
                onChange={(e) => setLockDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="mt-6">
              <button onClick={applyLock} className="form-button">
                Apply Lock Date
              </button>
              <button onClick={clearLock} className="form-button">
                Clear Lock Date
              </button>
            </div>
          </>
        )}

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
}

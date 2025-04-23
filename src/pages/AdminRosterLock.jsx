import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminRosterLock() {
  const [seasons, setSeasons] = useState([]);
  const [selected, setSelected] = useState('');
  const [lockDate, setLockDate] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('seasons')
        .select('id, name, roster_lock_date')
        .order('created_at', { ascending: false });
      setSeasons(data);
    })();
  }, []);

  const applyLock = async () => {
    if (!selected || !lockDate) {
      setMsg('Select season and date');
      return;
    }
    const { error } = await supabase
      .from('seasons')
      .update({ roster_lock_date: lockDate })
      .eq('id', selected);
    setMsg(error ? error.message : 'Lock date saved ✅');
  };

  const clearLock = async () => {
    const { error } = await supabase
      .from('seasons')
      .update({ roster_lock_date: null })
      .eq('id', selected);
    setLockDate('');
    setMsg(error ? error.message : 'Lock cleared');
  };

  const selectedSeason = seasons.find((s) => s.id === selected);

  return (
    <div className="main-content">
      <h1 className="page-title">Roster‑Lock Manager</h1>

      <button onClick={() => nav('/admin')} className="form-button" style={{ marginBottom: 24 }}>
        ← Back
      </button>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 500, margin: '0 auto' }}>
        <select
          className="form-input"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            const sd = seasons.find((s) => s.id === e.target.value);
            setLockDate(sd?.roster_lock_date ?? '');
          }}
        >
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {selected && (
          <>
            <label style={{ marginTop: 16, fontSize: 14, color: '#f8fafc' }}>Roster Lock Date</label>
            <input
              type="date"
              className="form-input"
              value={lockDate ?? ''}
              onChange={(e) => setLockDate(e.target.value)}
            />

            <div style={{ marginTop: 16 }}>
              <button onClick={applyLock} className="form-button">Save</button>
              {selectedSeason?.roster_lock_date && (
                <button onClick={clearLock} style={{ marginLeft: 12 }} className="form-button">
                  Clear
                </button>
              )}
            </div>
          </>
        )}

        {msg && <p style={{ marginTop: 16, color: msg.includes('saved') ? '#34d399' : '#f87171' }}>{msg}</p>}
      </div>
    </div>
  );
}

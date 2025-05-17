import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface League {
  id: string;
  name: string;
}
interface Season {
  id: string;
  name: string;
  roster_lock_date?: string;
}

const AdminRosterLock: React.FC = () => {
  const router = useRouter();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
  const [lockDate, setLockDate] = useState<string>('');
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeagueId) {
      fetchSeasons(selectedLeagueId);
    } else {
      setSeasons([]);
      setSelectedSeasonId('');
      setLockDate('');
    }
  }, [selectedLeagueId]);

  useEffect(() => {
    if (selectedSeasonId) {
      const season = seasons.find((s) => s.id === selectedSeasonId);
      setLockDate(season?.roster_lock_date || '');
    }
  }, [selectedSeasonId, seasons]);

  const fetchLeagues = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      // console.error('Failed to load leagues', err);
    }
  };

  const fetchSeasons = async (leagueId: string): Promise<void> => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/seasons?league_id=${leagueId}`);
      const data = await res.json();
      setSeasons(data);
    } catch (err) {
      // console.error('Failed to load seasons', err);
    }
  };

  const applyLock = async (): Promise<void> => {
    if (!selectedSeasonId || !lockDate) {
      setMsg('Select season and lock date.');
      return;
    }

    const confirmMsg = window.confirm(`Set roster lock date to ${lockDate}?`);
    if (!confirmMsg) return;

    try {
      await fetch(`https://api.bodegacatsgc.gg/seasons/${selectedSeasonId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roster_lock_date: lockDate }),
      });
      setMsg('Lock date saved ✅');
      fetchSeasons(selectedLeagueId);
    } catch {
      setMsg('Failed to save lock date.');
    }
  };

  const clearLock = async (): Promise<void> => {
    const confirmMsg = window.confirm('Clear the roster lock date for this season?');
    if (!confirmMsg) return;

    try {
      await fetch(`https://api.bodegacatsgc.gg/seasons/${selectedSeasonId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roster_lock_date: null }),
      });
      setMsg('Lock cleared');
      fetchSeasons(selectedLeagueId);
    } catch {
      setMsg('Failed to clear lock date.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Roster‑Lock Manager</h1>

      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
        ← Back to Admin Dashboard
      </button>

      <div className="form-container">
        <label className="block font-bold mb-2">Select League</label>
        <select value={selectedLeagueId} onChange={(e) => setSelectedLeagueId(e.target.value)} className="form-input">
          <option value="">-- Select a League --</option>
          {leagues.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        {selectedLeagueId && (
          <>
            <label className="block font-bold mb-2 mt-4">Select Season</label>
            <select value={selectedSeasonId} onChange={(e) => setSelectedSeasonId(e.target.value)} className="form-input">
              <option value="">-- Select a Season --</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Lock Date: {s.roster_lock_date || 'None'})
                </option>
              ))}
            </select>
          </>
        )}

        {selectedSeasonId && (
          <>
            <label className="block font-bold mb-2 mt-4">Set Roster Lock Date</label>
            <input type="date" value={lockDate} onChange={(e) => setLockDate(e.target.value)} className="form-input" />

            <div className="mt-6">
              <button onClick={applyLock} className="form-button">Apply Lock Date</button>
              <button onClick={clearLock} className="form-button">Clear Lock Date</button>
            </div>
          </>
        )}

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
};

export default AdminRosterLock;

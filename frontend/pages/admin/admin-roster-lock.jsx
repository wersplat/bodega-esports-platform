import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function AdminRosterLock() {
  const router = useRouter();
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [lockDate, setLockDate] = useState('');
  const [msg, setMsg] = useState('');

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

  const fetchLeagues = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      console.error('Failed to load leagues', err);
    }
  };

  const fetchSeasons = async (leagueId) => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/seasons?league_id=${leagueId}`);
      const data = await res.json();
      setSeasons(data);
    } catch (err) {
      console.error('Failed to load seasons', err);
    }
  };

  const applyLock = async () => {
    if (!selectedSeasonId || !lockDate) {
      setMsg('Select season and lock date.');
      return;
    }

    const confirm = window.confirm(`Set roster lock date to ${lockDate}?`);
    if (!confirm) return;

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

  const clearLock = async () => {
    const confirm = window.confirm('Clear the roster lock date for this season?');
    if (!confirm) return;

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
        <Label className="block font-bold mb-2">Select League</Label>
        <Select value={selectedLeagueId} onValueChange={(value) => setSelectedLeagueId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a League" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">-- Select a League --</SelectItem>
            {leagues.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedLeagueId && (
          <>
            <Label className="block font-bold mb-2 mt-4">Select Season</Label>
            <Select value={selectedSeasonId} onValueChange={(value) => setSelectedSeasonId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">-- Select a Season --</SelectItem>
                {seasons.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} (Lock Date: {s.roster_lock_date || 'None'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {selectedSeasonId && (
          <>
            <Label className="block font-bold mb-2 mt-4">Set Roster Lock Date</Label>
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
}

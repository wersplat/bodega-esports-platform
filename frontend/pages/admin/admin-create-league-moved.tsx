import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


interface Season {
  id: string;
  name: string;
}

const AdminCreateLeague: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [maxTeams, setMaxTeams] = useState<number>(16);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [newSeasonName, setNewSeasonName] = useState<string>('');

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/seasons');
      if (!res.ok) throw new Error('Failed to fetch seasons');
      const data = await res.json();
      setSeasons(data);
    } catch (err) {
      // Add specific error handling logic here
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          max_teams: maxTeams,
          start_date: startDate,
          end_date: endDate,
          season_id: selectedSeason,
        }),
      });

      if (!res.ok) throw new Error('Failed to create league');
      alert('League created successfully!');
      router.push('/admin');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateSeason = async (): Promise<void> => {
    if (!newSeasonName.trim()) {
      alert('Season name cannot be empty.');
      return;
    }

    try {
      const res = await fetch('https://api.bodegacatsgc.gg/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSeasonName }),
      });
      if (!res.ok) throw new Error('Failed to create season');
      const data = await res.json();
      alert('Season created successfully!');
      setSeasons((prev) => [...prev, ...data]);
      setNewSeasonName('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="main-content">
      <button
        onClick={() => router.push('/admin')}
        className="form-button"
        style={{ marginBottom: '20px' }}
      >
        ← Back to Admin Dashboard
      </button>

      <h1 className="page-title">Create New League</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '40px',
          background: '#1e293b',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          maxWidth: 500,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <input type="text" placeholder="League Name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
        <input type="number" placeholder="Max Teams" value={maxTeams} onChange={(e) => setMaxTeams(Number(e.target.value))} className="form-input" required />
        <input type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" required />
        <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" required />
        <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)} className="form-input" required>
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" placeholder="New Season Name" value={newSeasonName} onChange={(e) => setNewSeasonName(e.target.value)} className="form-input" />
          <button type="button" onClick={handleCreateSeason} className="form-button" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
            Add Season
          </button>
        </div>

        <button type="submit" className="form-button">Create League</button>
      </form>
    </div>
  );
};

export default AdminCreateLeague;

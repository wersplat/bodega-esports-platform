import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';





interface League {
  id: string;
  name: string;
}

interface Season {
  id: string;
  name: string;
}

const AdminAddTeam: React.FC = () => {
  const [teamName, setTeamName] = useState<string>('');
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchLeagues();
    fetchSeasons();
  }, []);

  const fetchLeagues = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      console.error('Failed to fetch leagues:', err);
    }
  };

  const fetchSeasons = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/seasons');
      const data = await res.json();
      setSeasons(data);
    } catch (err) {
      console.error('Failed to fetch seasons:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
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
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="main-content" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <button 
          onClick={() => router.push('/admin')} 
          className="form-button" 
          style={{ 
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Admin Dashboard
        </button>

        <h1 className="page-title" style={{ 
          fontSize: '24px', 
          marginBottom: '24px',
          color: '#f8fafc'
        }}>
          Admin: Add New Team
        </h1>

        <form 
          onSubmit={handleSubmit} 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: '40px',
            background: '#1e293b',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
          }}
        >
          <input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            required
          />

          <select 
            value={selectedLeague} 
            onChange={(e) => setSelectedLeague(e.target.value)} 
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBD5E1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '12px',
              paddingRight: '30px'
            }}
            required
          >
            <option value="">Select League</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>

          <select 
            value={selectedSeason} 
            onChange={(e) => setSelectedSeason(e.target.value)} 
            style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23CBD5E1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '12px',
              paddingRight: '30px'
            }}
            required
          >
            <option value="">Select Season</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>

          <button 
            type="submit" 
            style={{
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Add Team
          </button>
          
          {error && (
            <p style={{ 
              color: '#f87171', 
              margin: '8px 0 0',
              fontSize: '14px'
            }}>
              {error}
            </p>
          )}
          
          {success && (
            <p style={{ 
              color: '#34d399', 
              margin: '8px 0 0',
              fontSize: '14px'
            }}>
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminAddTeam;

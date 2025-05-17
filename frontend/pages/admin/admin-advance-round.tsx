import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface League {
  id: string;
  name: string;
}

const AdminAdvanceRound: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      if (!res.ok) throw new Error('Failed to fetch leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      // Add specific error handling logic here
    }
  };

  const generateNextRound = async (): Promise<void> => {
    setMessage('');
    if (!selectedLeague) {
      setMessage('Select a league first.');
      return;
    }

    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/bracket/advance-round`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ league_id: selectedLeague }),
      });
      if (!res.ok) throw new Error('Error creating next round');
      setMessage('Next round created successfully!');
    } catch (err) {
      setMessage('Error creating next round.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Admin: Advance Tournament Round</h1>

      {message && (
        <p style={{ marginTop: '10px', color: message.includes('successfully') ? '#34d399' : '#f87171' }}>
          {message}
        </p>
      )}

      <div
        style={{
          background: '#1e293b',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          maxWidth: 500,
          margin: '0 auto',
        }}
      >
        <Select
          value={selectedLeague}
          onValueChange={(value) => setSelectedLeague(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select League" />
          </SelectTrigger>
          <SelectContent>
            {leagues.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button onClick={generateNextRound} className="form-button">
          Generate Next Round
        </button>
      </div>
    </div>
  );
};

export default AdminAdvanceRound;

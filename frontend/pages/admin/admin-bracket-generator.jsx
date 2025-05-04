import React, { useState, useEffect } from 'react';

function AdminBracketGenerator() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      if (!res.ok) throw new Error('Failed to fetch leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      console.error(err);
      // Add specific error handling logic here
    }
  };

  const generateBracket = async () => {
    setMessage('');
    if (!selectedLeague) {
      setMessage('Select a league first.');
      return;
    }

    try {
      const res = await fetch('https://api.bodegacatsgc.gg/bracket/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ league_id: selectedLeague }),
      });
      if (!res.ok) throw new Error('Error generating bracket');
      setMessage('Bracket generated successfully!');
    } catch (err) {
      console.error(err);
      // Add specific error handling logic here
      setMessage('Error creating bracket.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Admin: Bracket Generator</h1>

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
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="form-input"
        >
          <option value="">Select League</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>

        <button
          onClick={generateBracket}
          className="form-button"
          style={{ marginTop: '20px' }}
        >
          Generate Bracket
        </button>

        {message && (
          <p style={{ marginTop: '20px', color: message.includes('success') ? '#34d399' : '#f87171' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminBracketGenerator;

import React, { useEffect, useState, FormEvent } from 'react';

interface Match {
  id: string;
  home_team_name: string;
  away_team_name: string;
}

const SubmitResult: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [teamAScore, setTeamAScore] = useState<string>('');
  const [teamBScore, setTeamBScore] = useState<string>('');
  const [mvp, setMvp] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/matches/my');
      if (!res.ok) throw new Error('Failed to fetch matches');
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      // Optionally log or display error
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage('');

    if (!selectedMatchId || teamAScore === '' || teamBScore === '') {
      setMessage('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/matches/${selectedMatchId}/submit-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_a_score: Number(teamAScore),
          team_b_score: Number(teamBScore),
          mvp,
          notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit result');

      setMessage('Result submitted successfully!');
      setSelectedMatchId('');
      setTeamAScore('');
      setTeamBScore('');
      setMvp('');
      setNotes('');
    } catch (err) {
      setMessage('Error submitting result.');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Submit Match Result</h1>

      <form onSubmit={handleSubmit} className="form" style={{ marginTop: '30px', background: '#1e293b', borderRadius: 12, padding: 24, maxWidth: 500, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        <select
          value={selectedMatchId}
          onChange={(e) => setSelectedMatchId(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Match</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.home_team_name} vs {m.away_team_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="form-input"
          placeholder="Team A Score"
          value={teamAScore}
          onChange={(e) => setTeamAScore(e.target.value)}
          required
        />

        <input
          type="number"
          className="form-input"
          placeholder="Team B Score"
          value={teamBScore}
          onChange={(e) => setTeamBScore(e.target.value)}
          required
        />

        <input
          type="text"
          className="form-input"
          placeholder="MVP (optional)"
          value={mvp}
          onChange={(e) => setMvp(e.target.value)}
        />

        <textarea
          className="form-input"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* You can add screenshot upload later with proper FastAPI upload route */}
        {/* <input type="file" className="form-input" /> */}

        <button type="submit" className="form-button" style={{ marginTop: '20px', backgroundColor: '#10b981' }}>
          Submit Result
        </button>

        {message && (
          <p style={{ marginTop: 10, color: message.includes('successfully') ? '#34d399' : '#f87171' }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default SubmitResult;

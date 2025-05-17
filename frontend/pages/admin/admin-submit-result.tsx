import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { NextPage } from 'next';

interface Match {
  id: string;
  team_a_name: string;
  team_b_name: string;
}

const AdminSubmitResult: NextPage = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [teamAScore, setTeamAScore] = useState<string>('');
  const [teamBScore, setTeamBScore] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/matches/pending');
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      // console.error('Failed to load matches', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!selectedMatch || teamAScore === '' || teamBScore === '') {
      setMessage('Please fill out all required fields.');
      return;
    }

    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/matches/${selectedMatch}/submit-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_a_score: Number(teamAScore),
          team_b_score: Number(teamBScore),
          notes,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit match result');
      setMessage('Match result submitted successfully!');
      setSelectedMatch('');
      setTeamAScore('');
      setTeamBScore('');
      setNotes('');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Admin: Submit Match Result</h1>
      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
         Back to Admin Dashboard
      </button>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '30px',
        background: '#1e293b',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Select value={selectedMatch} onValueChange={(value) => setSelectedMatch(value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select Match" />
          </SelectTrigger>
          <SelectContent>
            {matches.map((match) => (
              <SelectItem key={match.id} value={match.id}>
                {match.team_a_name} vs {match.team_b_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input type="number" placeholder="Team A Score" value={teamAScore} onChange={(e) => setTeamAScore(e.target.value)} className="form-input" required />
        <input type="number" placeholder="Team B Score" value={teamBScore} onChange={(e) => setTeamBScore(e.target.value)} className="form-input" required />
        <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="form-input" />

        <button type="submit" className="form-button">Submit Result</button>
        {message && <p style={{ marginTop: '10px', color: message.includes('success') ? '#34d399' : '#f87171' }}>{message}</p>}
      </form>
    </div>
  );
};

export default AdminSubmitResult;

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AdminAdvanceRound() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*');
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const generateNextRound = async () => {
    setMessage('');

    if (!selectedLeague) {
      setMessage('Select a league first.');
      return;
    }

    // 1. Fetch all winners from current highest round
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .eq('league_id', selectedLeague);

    if (error) {
      console.error('Error fetching matches:', error.message);
      setMessage('Error fetching matches.');
      return;
    }

    if (!matches || matches.length === 0) {
      setMessage('No matches found.');
      return;
    }

    // Find highest round number
    const highestRound = Math.max(...matches.map((m) => m.round));
    const currentRoundMatches = matches.filter((m) => m.round === highestRound);

    // Collect winners
    const winners = currentRoundMatches
      .filter((m) => m.winner_id !== null)
      .map((m) => m.winner_id);

    if (winners.length < 2) {
      setMessage('Not enough winners to create next round.');
      return;
    }

    // Random shuffle winners
    for (let i = winners.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [winners[i], winners[j]] = [winners[j], winners[i]];
    }

    // Pair winners
    const nextRoundMatches = [];
    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        nextRoundMatches.push({
          league_id: selectedLeague,
          team1_id: winners[i],
          team2_id: winners[i + 1],
          round: highestRound + 1,
        });
      } else {
        // BYE if odd number of winners
        nextRoundMatches.push({
          league_id: selectedLeague,
          team1_id: winners[i],
          team2_id: null,
          round: highestRound + 1,
        });
      }
    }

    const { error: insertError } = await supabase.from('matches').insert(nextRoundMatches);

    if (insertError) {
      console.error('Error inserting next round matches:', insertError.message);
      setMessage('Error creating next round.');
    } else {
      setMessage('Next round created successfully!');
    }
  };

  return (
    <div>
      <h1 className="page-title">🏆 Admin: Advance Tournament Round</h1>

      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}

      <select
        value={selectedLeague}
        onChange={(e) => setSelectedLeague(e.target.value)}
        className="form-input"
        style={{ marginBottom: '20px' }}
      >
        <option value="">Select League</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>

      <button
        onClick={generateNextRound}
        className="form-button"
        style={{ backgroundColor: '#6366f1' }}
      >
        Generate Next Round
      </button>
    </div>
  );
}

export default AdminAdvanceRound;

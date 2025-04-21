import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AdminBracketGenerator() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const generateBracket = async () => {
    if (!selectedLeague) {
      setMessage('Select a league first.');
      return;
    }

    // Fetch registered teams
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('team_id')
      .eq('league_id', selectedLeague);

    if (regError) {
      console.error('Error fetching registrations:', regError.message);
      setMessage('Error fetching teams.');
      return;
    }

    if (registrations.length < 2) {
      setMessage('Not enough teams to generate a bracket.');
      return;
    }

    let teamIds = registrations.map((r) => r.team_id);

    // Random shuffle
    for (let i = teamIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teamIds[i], teamIds[j]] = [teamIds[j], teamIds[i]];
    }

    // Pair teams
    const matchPairs = [];
    for (let i = 0; i < teamIds.length; i += 2) {
      if (i + 1 < teamIds.length) {
        matchPairs.push({
          league_id: selectedLeague,
          team1_id: teamIds[i],
          team2_id: teamIds[i + 1],
          round: 1
        });
      } else {
        // Odd team out (bye)
        matchPairs.push({
          league_id: selectedLeague,
          team1_id: teamIds[i],
          team2_id: null,
          round: 1
        });
      }
    }

    const { error: matchError } = await supabase.from('matches').insert(matchPairs);

    if (matchError) {
      console.error('Error inserting matches:', matchError.message);
      setMessage('Error creating bracket.');
    } else {
      setMessage('Bracket generated successfully!');
    }
  };

  return (
    <div>
      <h1 className="page-title">Admin: Bracket Generator</h1>

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
        style={{ marginTop: '20px', backgroundColor: '#10b981' }}
      >
        Generate Bracket
      </button>

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}

export default AdminBracketGenerator;

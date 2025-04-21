import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Champion() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [teams, setTeams] = useState([]);
  const [championTeamId, setChampionTeamId] = useState(null);

  useEffect(() => {
    fetchLeagues();
    fetchTeams();
  }, []);

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*');
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*');
    if (error) console.error('Error fetching teams:', error.message);
    else setTeams(data);
  };

  const detectChampion = async () => {
    if (!selectedLeague) return;

    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .eq('league_id', selectedLeague);

    if (error) {
      console.error('Error fetching matches:', error.message);
      return;
    }

    if (!matches || matches.length === 0) {
      return;
    }

    // Find highest round matches
    const highestRound = Math.max(...matches.map((m) => m.round));
    const finalRoundMatches = matches.filter((m) => m.round === highestRound);

    if (finalRoundMatches.length === 1 && finalRoundMatches[0].winner_id) {
      setChampionTeamId(finalRoundMatches[0].winner_id);
    } else {
      setChampionTeamId(null); // Tournament still running
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  return (
    <div style={{ paddingTop: '80px' }}> 
      <h1 className="page-title">🏆 Tournament Champion</h1>

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
        onClick={detectChampion}
        className="form-button"
        style={{ backgroundColor: '#16a34a', marginBottom: '20px' }}
      >
        Show Champion
      </button>

      {championTeamId ? (
        <div style={{ marginTop: '20px', padding: '30px', backgroundColor: '#fef3c7', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2rem' }}>🎉 {getTeamName(championTeamId)} 🎉</h2>
          <p style={{ marginTop: '10px', fontSize: '1.2rem' }}>Congratulations, Champion!</p>
        </div>
      ) : (
        <p style={{ marginTop: '20px' }}>No champion yet — tournament still ongoing.</p>
      )}
    </div>
  );
}

export default Champion;

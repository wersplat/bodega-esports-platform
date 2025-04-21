import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AdminMarkWinner() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchLeagues();
  }, []);

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('matches').select('*').order('round', { ascending: true });
    if (error) console.error('Error fetching matches:', error.message);
    else setMatches(data);
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('id, name');
    if (error) console.error('Error fetching teams:', error.message);
    else setTeams(data);
  };

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('id, name');
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const getTeamName = (teamId) => {
    if (!teamId) return 'BYE';
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getLeagueName = (leagueId) => {
    const league = leagues.find((l) => l.id === leagueId);
    return league ? league.name : 'Unknown League';
  };

  const handleSetWinner = async (matchId, winnerId) => {
    const { error } = await supabase
      .from('matches')
      .update({ winner_id: winnerId })
      .eq('id', matchId);

    if (error) {
      console.error('Error setting winner:', error.message);
      setMessage('Error setting winner.');
    } else {
      setMessage('Winner updated successfully!');
      fetchMatches(); // Refresh after update
    }
  };

  return (
    <div>
      <h1 className="page-title">🏆 Admin: Mark Match Winners</h1>

      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}

      {matches.length === 0 ? (
        <p>No matches yet.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id} style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
            <h3>{getLeagueName(match.league_id)}</h3>
            <p><strong>Round:</strong> {match.round}</p>
            <p><strong>Match:</strong> {getTeamName(match.team1_id)} vs {getTeamName(match.team2_id)}</p>
            <p><strong>Current Winner:</strong> {match.winner_id ? getTeamName(match.winner_id) : 'No winner yet'}</p>

            {/* Only show buttons if both teams exist */}
            {match.team1_id && match.team2_id && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleSetWinner(match.id, match.team1_id)}
                  style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Set {getTeamName(match.team1_id)} as Winner
                </button>

                <button
                  onClick={() => handleSetWinner(match.id, match.team2_id)}
                  style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Set {getTeamName(match.team2_id)} as Winner
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminMarkWinner;

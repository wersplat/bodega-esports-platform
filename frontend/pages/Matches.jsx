import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Matches() {
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchMatches();
    fetchLeagues();
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    const { data, error } = await supabase.from('matches').select('*').order('round', { ascending: true });
    if (error) console.error('Error fetching matches:', error.message);
    else setMatches(data);
  };

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('id, name');
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('id, name');
    if (error) console.error('Error fetching teams:', error.message);
    else setTeams(data);
  };

  const getTeamName = (teamId) => {
    if (!teamId) return 'BYE'; // If no opponent (bye)
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const getLeagueName = (leagueId) => {
    const league = leagues.find((l) => l.id === leagueId);
    return league ? league.name : 'Unknown League';
  };

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Current Matches</h1>

      {matches.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No matches yet.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id} style={{ marginBottom: '20px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.18)' }}>
            <h3 style={{ color: '#f8fafc' }}>{getLeagueName(match.league_id)}</h3>
            <p><strong>Round:</strong> {match.round}</p>
            <p><strong>Match:</strong> {getTeamName(match.team1_id)} vs {getTeamName(match.team2_id)}</p>
            {match.winner_id ? (
              <p><strong>Winner:</strong> {getTeamName(match.winner_id)}</p>
            ) : (
              <p><strong>Winner:</strong> Match not played yet</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Matches;

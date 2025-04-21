import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function PublicBracket() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchLeagues();
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchMatches();
    }
  }, [selectedLeague]);

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

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('league_id', selectedLeague)
      .order('round', { ascending: true });

    if (error) console.error('Error fetching matches:', error.message);
    else setMatches(data);
  };

  const getTeamName = (teamId) => {
    if (!teamId) return 'BYE';
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const groupMatchesByRound = () => {
    const grouped = {};
    matches.forEach((match) => {
      if (!grouped[match.round]) {
        grouped[match.round] = [];
      }
      grouped[match.round].push(match);
    });
    return grouped;
  };

  const rounds = groupMatchesByRound();

  return (
    <div>
      <h1 className="page-title">🏆 Public Tournament Bracket</h1>

      <select
        value={selectedLeague}
        onChange={(e) => setSelectedLeague(e.target.value)}
        className="form-input"
        style={{ marginBottom: '10px' }}
      >
        <option value="">Select League</option>
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>

      {/* Refresh Button */}
      <button
        onClick={fetchMatches}
        className="form-button"
        style={{
          marginBottom: '20px',
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
      >
        Refresh Bracket
      </button>

      {matches.length === 0 ? (
        <p>No matches yet.</p>
      ) : (
        <div style={{ display: 'flex', gap: '30px', overflowX: 'auto' }}>
          {Object.keys(rounds)
            .sort((a, b) => a - b)
            .map((roundNumber) => (
              <div key={roundNumber} style={{ minWidth: '250px' }}>
                <h2 style={{ marginBottom: '10px' }}>Round {roundNumber}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {rounds[roundNumber].map((match) => (
                    <div
                      key={match.id}
                      style={{
                        padding: '10px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 0 6px rgba(0,0,0,0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <strong>{getTeamName(match.team1_id)}</strong> vs <strong>{getTeamName(match.team2_id)}</strong>
                      <br />
                      {match.winner_id ? (
                        <span style={{ color: 'green' }}>
                          Winner: {getTeamName(match.winner_id)}
                        </span>
                      ) : (
                        <span style={{ color: 'gray' }}>
                          Match pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default PublicBracket;

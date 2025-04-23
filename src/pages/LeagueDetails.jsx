import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

function LeagueDetails() {
  const { id } = useParams(); // League ID from URL
  const [league, setLeague] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchLeague();
    fetchRegisteredTeams();
  }, [id]);

  const fetchLeague = async () => {
    const { data, error } = await supabase.from('leagues').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching league:', error.message);
    } else {
      setLeague(data);
    }
  };

  const fetchRegisteredTeams = async () => {
    const { data, error } = await supabase
      .from('registrations')
      .select('id, teams ( id, name, description, players ( id, name, gamertag ) )')
      .eq('league_id', id);

    if (error) {
      console.error('Error fetching registered teams:', error.message);
    } else {
      setRegistrations(data);
    }
  };

  if (!league) return <div>Loading league...</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">{league.name}</h1>
      <p style={{ color: '#cbd5e1' }}>{league.description}</p>

      <h2 style={{ marginTop: '30px', color: '#f8fafc' }}>Registered Teams</h2>

      {registrations.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No teams registered yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {registrations.map((registration) => (
            <li key={registration.id} style={{ marginBottom: '30px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.25)' }}>
              <h3 style={{ color: '#f8fafc' }}>{registration.teams.name}</h3>
              <p style={{ color: '#cbd5e1' }}>{registration.teams.description}</p>

              {registration.teams.players.length === 0 ? (
                <p style={{ marginTop: '10px', color: '#cbd5e1' }}>No players added yet.</p>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <h4 style={{ color: '#f8fafc' }}>Roster</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {registration.teams.players.map((player) => (
                      <li key={player.id} style={{ color: '#f8fafc' }}>
                        {player.name} {player.gamertag && `(${player.gamertag})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeagueDetails;

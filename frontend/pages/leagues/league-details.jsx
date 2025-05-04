import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function LeagueDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [league, setLeague] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchLeague();
        await fetchRegistrations();
      } catch (err) {
        // Handle error (was: console.error('Error fetching data:', err))
      }
    };
    fetchData();
  }, [fetchLeague, fetchRegistrations]);

  const fetchLeague = async () => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/leagues/${id}`);
      const data = await res.json();
      setLeague(data);
    } catch (err) {
      // Handle error (was: console.error('Error fetching league:', err))
      // Consider retrying the request or showing a user-friendly error message
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/registrations?league_id=${id}`);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      // Handle error (was: console.error('Error fetching registrations:', err))
      // Consider retrying the request or showing a user-friendly error message
    }
  };

  if (!league) return <div className="main-content">Loading league...</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">{league.name}</h1>
      <p style={{ color: '#cbd5e1' }}>{league.description}</p>

      <h2 style={{ marginTop: '30px', color: '#f8fafc' }}>Registered Teams</h2>

      {registrations.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No teams registered yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {registrations.map((reg) => (
            <li key={reg.id} style={{ marginBottom: '30px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.25)' }}>
              <h3>{reg.team_name}</h3>
              <p style={{ color: '#cbd5e1' }}>{reg.description}</p>
              {reg.players?.length > 0 ? (
                <div style={{ marginTop: '10px' }}>
                  <h4>Roster</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {reg.players.map((player) => (
                      <li key={player.id} style={{ color: '#f8fafc' }}>
                        {player.name} {player.gamertag && `(${player.gamertag})`}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={{ marginTop: '10px', color: '#cbd5e1' }}>No players added yet.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeagueDetails;

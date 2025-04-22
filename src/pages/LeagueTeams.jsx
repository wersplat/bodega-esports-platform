import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function LeagueTeams() {
  const { id } = useParams(); // league ID from URL
  const [teams, setTeams] = useState([]);
  const [leagueName, setLeagueName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, [id]);

  const fetchTeams = async () => {
    setLoading(true);

    // Fetch league name
    const { data: leagueData, error: leagueError } = await supabase
      .from('leagues')
      .select('name')
      .eq('id', id)
      .single();

    if (leagueError) {
      console.error('Error fetching league:', leagueError.message);
    } else {
      setLeagueName(leagueData.name);
    }

    // Fetch registered teams (fixed explicit join)
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id,
        team_id,
        teams!registrations_team_id_fkey (
          name,
          logo_url
        )
      `)
      .eq('league_id', id);

    console.log("Registrations response:", data); // ✅ Debugging output

    if (error) {
      console.error('Error fetching teams:', error.message);
    } else {
      setTeams(data);
    }

    setLoading(false);
  };

  if (loading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div style={{ paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">{leagueName} - Registered Teams</h1>

      {teams.length === 0 ? (
        <p>No teams registered yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {teams.map((registration) => (
            <li
              key={registration.id}
              style={{
                marginBottom: '20px',
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 0 6px rgba(0,0,0,0.1)'
              }}
            >
              <h3>{registration.teams?.name || 'Unknown Team'}</h3>
              {registration.teams?.logo_url && (
                <img
                  src={registration.teams.logo_url}
                  alt="Team Logo"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'contain',
                    marginTop: '10px'
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LeagueTeams;

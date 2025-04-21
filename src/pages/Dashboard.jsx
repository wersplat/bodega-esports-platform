import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      fetchTeams(session.user.id);
    }
  };

  const fetchTeams = async (userId) => {
    const { data, error } = await supabase.from('teams').select('*').eq('owner_id', userId);
    if (error) {
      console.error('Error fetching teams:', error.message);
    } else {
      setTeams(data);
      fetchPlayers(data.map((team) => team.id));
      fetchRegistrations(data.map((team) => team.id));
    }
  };

  const fetchPlayers = async (teamIds) => {
    if (teamIds.length === 0) return;
    const { data, error } = await supabase.from('players').select('*').in('team_id', teamIds);
    if (error) {
      console.error('Error fetching players:', error.message);
    } else {
      setPlayers(data);
    }
  };

  const fetchRegistrations = async (teamIds) => {
    if (teamIds.length === 0) return;
    const { data, error } = await supabase
      .from('registrations')
      .select('id, team_id, league_id, leagues ( id, name )')
      .in('team_id', teamIds);
    if (error) {
      console.error('Error fetching registrations:', error.message);
    } else {
      setRegistrations(data);
    }
  };

  const getTeamRoster = (teamId) => {
    return players.filter((player) => player.team_id === teamId);
  };

  const getLeagueName = (leagueId) => {
    const reg = registrations.find((r) => r.league_id === leagueId);
    return reg?.leagues?.name || 'Unknown League';
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      window.location.href = '/'; // Redirect to login page
    }
  };

  return (
    <div>
      <h1 className="page-title">🏠 Dashboard</h1>

      {user && (
        <div style={{ marginBottom: '40px' }}>
          <h2>👤 Profile</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username (ID):</strong> {user.id.slice(0, 8)}...</p>

          <button
            onClick={handleLogout}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      )}

      <div style={{ marginBottom: '40px' }}>
        <h2>🏆 My Teams</h2>
        {teams.length === 0 ? (
          <p>No teams created yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {teams.map((team) => (
              <li key={team.id} style={{ marginBottom: '20px' }}>
                <h3>{team.name}</h3>
                <p>{team.description}</p>

                <div style={{ marginLeft: '20px' }}>
                  <h4>Roster:</h4>
                  <ul>
                    {getTeamRoster(team.id).length === 0 ? (
                      <li>No players yet.</li>
                    ) : (
                      getTeamRoster(team.id).map((player) => (
                        <li key={player.id}>
                          {player.name} {player.gamertag && `(${player.gamertag})`}
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <h4>Leagues:</h4>
                  <ul>
                    {registrations
                      .filter((reg) => reg.team_id === team.id)
                      .map((reg) => (
                        <li key={reg.id}>
                          {reg.leagues?.name || 'Unknown League'}
                        </li>
                      ))}
                  </ul>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

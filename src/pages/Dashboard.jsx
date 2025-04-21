import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTeams();
      fetchLeagues();
    }
  }, [user]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
    } else {
      setUser(user);
    }
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('owner_id', user.id);

    if (error) {
      console.error('Error fetching teams:', error.message);
    } else {
      setTeams(data);
    }
  };

  const fetchLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*');
    if (error) console.error('Error fetching leagues:', error.message);
    else setLeagues(data);
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">🏠 Dashboard</h1>

      {user && <h2 style={{ marginTop: '10px' }}>Welcome, {user.email}!</h2>}

      <div style={{ marginTop: '30px' }}>
        <h3>🛡️ Your Teams</h3>
        {teams.length === 0 ? (
          <p>You have no teams yet.</p>
        ) : (
          <ul>
            {teams.map((team) => (
              <li key={team.id}>{team.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>🏆 Active Leagues</h3>
        {leagues.length === 0 ? (
          <p>No active leagues yet.</p>
        ) : (
          <ul>
            {leagues.map((league) => (
              <li key={league.id}>{league.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

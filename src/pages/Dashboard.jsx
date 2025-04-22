import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTeams();
      fetchLeagues();
      fetchMyMatches();
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

  const fetchMyMatches = async () => {
    setLoadingMatches(true);

    const { data: userTeams, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('owner_id', user.id);

    if (teamError) {
      console.error('Error fetching user teams:', teamError.message);
      setLoadingMatches(false);
      return;
    }

    const teamIds = userTeams.map((team) => team.id);

    if (teamIds.length === 0) {
      setMatches([]);
      setLoadingMatches(false);
      return;
    }

    const { data: matchesData, error: matchesError } = await supabase
      .from('matches')
      .select(`
        id,
        match_date,
        status,
        home_team_id,
        away_team_id,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_home_team_id_fkey(name),
        leagues ( name )
      `)
      .or(`home_team_id.in.(${teamIds.join(',')}),away_team_id.in.(${teamIds.join(',')})`)
      .gte('match_date', new Date().toISOString())
      .order('match_date', { ascending: true });

    if (matchesError) {
      console.error('Error fetching matches:', matchesError.message);
    } else {
      setMatches(matchesData || []);
    }

    setLoadingMatches(false);
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

      <div style={{ marginTop: '40px' }}>
        <h3>📅 My Upcoming Matches</h3>
        {loadingMatches ? (
          <p>Loading your matches...</p>
        ) : matches.length === 0 ? (
          <p>No scheduled matches yet.</p>
        ) : (
          <ul>
            {matches.map((match) => (
              <li key={match.id} style={{ marginBottom: '20px' }}>
                <strong>{match.leagues?.name || 'Unknown League'}:</strong> {new Date(match.match_date).toLocaleString()} — 
                {` ${match.home_team?.name || 'TBD'} vs ${match.away_team?.name || 'TBD'}`} 
                ({match.status})
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

export default Dashboard;

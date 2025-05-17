import React, { useEffect, useState, useCallback } from 'react';

interface User {
  id: string;
  email: string;
}

interface Team {
  id: string;
  name: string;
  season?: Season;
}

interface League {
  id: string;
  name: string;
}

interface Match {
  id: string;
  league_name?: string;
  match_date: string;
  home_team_name: string;
  away_team_name: string;
  status: string;
}

interface Season {
  roster_lock_date?: string;
}

const card: React.CSSProperties = {
  marginTop: 30,
  background: '#222b3a',
  borderRadius: 8,
  padding: 20,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  color: '#f8fafc',
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [userSeason, setUserSeason] = useState<Season | null>(null);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true);

  // 1. Fetch current user
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/auth/me');
      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      setUser(data);
    } catch {
      window.location.href = '/login';
    }
  }, []);

  // 2. Fetch teams (only if user.id exists)
  const fetchTeams = useCallback(async () => {
    if (!user?.id) return;
    const res = await fetch(`https://api.bodegacatsgc.gg/teams?owner_id=${user.id}`);
    const data = await res.json();
    setTeams(data);
    const season = data.find((t: Team) => t.season)?.season;
    setUserSeason(season);
  }, [user?.id]);

  // 3. Fetch leagues (no user dependency)
  const fetchLeagues = useCallback(async () => {
    const res = await fetch('https://api.bodegacatsgc.gg/leagues');
    const data = await res.json();
    setLeagues(data);
  }, []);

  // 4. Fetch matches (no user dependency)
  const fetchMatches = useCallback(async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/matches/my');
      const data = await res.json();
      setMatches(data);
    } catch {
      // ignore for now
    } finally {
      setLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user?.id) {
      fetchTeams();
      fetchLeagues();
      fetchMatches();
    }
  }, [user?.id, fetchTeams, fetchLeagues, fetchMatches]);

  const daysLeft = userSeason?.roster_lock_date
    ? Math.ceil((new Date(userSeason.roster_lock_date).getTime() - new Date().getTime()) / 86400000)
    : null;

  return (
    <div className="main-content">
      <h1 className="page-title">🏠 Dashboard</h1>
      {user && <h2 style={{ color: '#f8fafc' }}>Welcome, {user.email}</h2>}

      {daysLeft !== null && daysLeft >= 0 && (
        <div
          style={{
            marginTop: 20,
            background: '#334155',
            color: '#f8fafc',
            padding: '10px 16px',
            borderRadius: 6,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          Roster locks in{' '}
          <span style={{ color: '#facc15' }}>{daysLeft}</span> day
          {daysLeft !== 1 && 's'} ({userSeason?.roster_lock_date})
        </div>
      )}

      <section style={card}>
        <h3>📝 Your Teams</h3>
        {teams.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No teams yet.</p>
        ) : (
          <ul>{teams.map((t) => <li key={t.id}>{t.name}</li>)}</ul>
        )}
      </section>

      <section style={card}>
        <h3>🏆 Active Leagues</h3>
        {leagues.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>None yet.</p>
        ) : (
          <ul>{leagues.map((l) => <li key={l.id}>{l.name}</li>)}</ul>
        )}
      </section>

      <section style={card}>
        <h3>⚕️ My Upcoming Matches</h3>
        {loadingMatches ? (
          <p style={{ color: '#cbd5e1' }}>Loading…</p>
        ) : matches.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No matches scheduled.</p>
        ) : (
          <ul>
            {matches.map((m) => (
              <li key={m.id} style={{ marginBottom: 10 }}>
                <strong>{m.league_name || 'League'}:</strong>{' '}
                {new Date(m.match_date).toLocaleString()} — {m.home_team_name} vs{' '}
                {m.away_team_name} ({m.status})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;

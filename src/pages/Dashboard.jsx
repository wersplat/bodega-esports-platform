// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser]               = useState(null);
  const [teams, setTeams]             = useState([]);
  const [leagues, setLeagues]         = useState([]);
  const [matches, setMatches]         = useState([]);
  const [loadingMatches, setLoading]  = useState(true);
  const [userSeason, setUserSeason]   = useState(null);   // ← NEW

  const nav = useNavigate();

  /* ───────────────────────  Auth  ─────────────────────── */
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) nav('/');
      else setUser(user);
    })();
  }, []);

  /* ──────────────────  Load data after auth  ──────────── */
  useEffect(() => {
    if (!user) return;
    loadTeams();
    loadLeagues();
    loadMatches();
  }, [user]);

  /* ───────────────  Helpers  ─────────────── */
  const loadTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*, seasons ( id, name, roster_lock_date )') // join season
      .eq('owner_id', user.id);

    if (error) console.error(error);
    else {
      setTeams(data);
      // pick the first team’s season for countdown (adjust if multi‑season)
      const season = data.find((t) => t.seasons)?.seasons;
      setUserSeason(season);
    }
  };

  const loadLeagues = async () => {
    const { data, error } = await supabase.from('leagues').select('*');
    if (error) console.error(error); else setLeagues(data);
  };

  const loadMatches = async () => {
    setLoading(true);
    const { data: teamIds } = await supabase
      .from('teams')
      .select('id')
      .eq('owner_id', user.id);
    if (!teamIds?.length) { setMatches([]); setLoading(false); return; }

    const ids = teamIds.map((t) => t.id);

    const { data, error } = await supabase
      .from('matches')
      .select(`
        id, match_date, status,
        home_team_id, away_team_id,
        home_team:teams!matches_home_team_id_fkey(name),
        away_team:teams!matches_away_team_id_fkey(name),
        leagues ( name )
      `)
      .or(`home_team_id.in.(${ids}),away_team_id.in.(${ids})`)
      .gte('match_date', new Date().toISOString())
      .order('match_date');

    if (error) console.error(error); else setMatches(data);
    setLoading(false);
  };

  /* ───────────────  Banner helper  ─────────────── */
  const daysLeft = userSeason?.roster_lock_date
    ? Math.ceil(
        (new Date(userSeason.roster_lock_date) - new Date()) / 86400000
      )
    : null;

  return (
    <div className="main-content">
      <h1 className="page-title">🏠 Dashboard</h1>
      {user && <h2 style={{ marginTop: 10, color: '#f8fafc' }}>Welcome, {user.email}!</h2>}

      {/* 🔒  Roster‑lock countdown banner */}
      {daysLeft !== null && daysLeft >= 0 && (
        <div
          style={{
            marginTop: 20,
            background: '#334155', // dark blue-gray
            color: '#f8fafc',
            padding: '10px 16px',
            borderRadius: 6,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
          }}
        >
          Roster locks in&nbsp;
          <span style={{ color: '#facc15' }}>{daysLeft}</span> day
          {daysLeft !== 1 && 's'} ({userSeason.roster_lock_date})
        </div>
      )}

      {/* ────────── Teams ────────── */}
      <div style={{ marginTop: 30, background: '#222b3a', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <h3 style={{ color: '#f8fafc' }}>🛡️ Your Teams</h3>
        {teams.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>You have no teams yet.</p>
        ) : (
          <ul>
            {teams.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* ────────── Leagues ────────── */}
      <div style={{ marginTop: 30, background: '#222b3a', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <h3 style={{ color: '#f8fafc' }}>🏆 Active Leagues</h3>
        {leagues.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No active leagues yet.</p>
        ) : (
          <ul>
            {leagues.map((l) => (
              <li key={l.id}>{l.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* ────────── Matches ────────── */}
      <div style={{ marginTop: 40, background: '#222b3a', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <h3 style={{ color: '#f8fafc' }}>📅 My Upcoming Matches</h3>
        {loadingMatches ? (
          <p style={{ color: '#cbd5e1' }}>Loading your matches…</p>
        ) : matches.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No scheduled matches yet.</p>
        ) : (
          <ul>
            {matches.map((m) => (
              <li key={m.id} style={{ marginBottom: 14 }}>
                <strong>{m.leagues?.name || 'Unknown League'}:</strong>{' '}
                {new Date(m.match_date).toLocaleString()} —{' '}
                {`${m.home_team?.name || 'TBD'} vs ${m.away_team?.name || 'TBD'}`}
                {' '}({m.status})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

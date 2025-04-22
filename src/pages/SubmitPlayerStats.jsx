// src/pages/SubmitPlayerStats.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function SubmitPlayerStats() {
  const [profile, setProfile] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [stats, setStats] = useState({
    points: '', assists: '', rebounds: '', steals: '', blocks: '', turnovers: '',
    fg_made: '', fg_attempted: '', three_made: '', three_attempted: '', ft_made: '', ft_attempted: ''
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // 1️⃣ Load user → profile → roster → team → matches
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // get auth user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not logged in');
        setLoading(false);
        return;
      }

      // fetch profile
      let { data: prof } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      setProfile(prof);

      // fetch roster entry for that profile
      const { data: roster } = await supabase
        .from('rosters')
        .select('team_id')
        .eq('player_id', prof.id)
        .single();
      if (!roster?.team_id) {
        setError('You are not on any team');
        setLoading(false);
        return;
      }
      setTeamId(roster.team_id);

      // fetch completed matches for that team
      // exclude those already in player_stats for this player
      // first, get match_ids already submitted
      let { data: submitted } = await supabase
        .from('player_stats')
        .select('match_id')
        .eq('player_id', prof.id);
      const doneIds = submitted.map(r => r.match_id);

      // now fetch matches
      let { data: m } = await supabase
        .from('matches')
        .select('id, team_a_id, team_b_id, scheduled_date, season_id')
        .eq('match_status', 'Completed')
        .or(`team_a_id.eq.${roster.team_id},team_b_id.eq.${roster.team_id}`)
        .order('scheduled_date', { ascending: false });

      // filter out done
      const open = m.filter(x => !doneIds.includes(x.id));
      setMatches(open);

      setLoading(false);
    };
    init();
  }, []);

  // handle form field changes
  const handleChange = (e) => {
    setStats({ ...stats, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!selectedMatch) {
      setError('Select a match');
      return;
    }

    // basic validation: require at least points
    if (stats.points === '') {
      setError('Enter at least points');
      return;
    }

    // gather season_id from selected match
    const match = matches.find(m => m.id === selectedMatch);

    // insert into player_stats
    const { error: inErr } = await supabase
      .from('player_stats')
      .insert([{
        player_id: profile.id,
        team_id:    teamId,
        match_id:   selectedMatch,
        season_id:  match.season_id,
        points:     Number(stats.points),
        assists:    Number(stats.assists),
        rebounds:   Number(stats.rebounds),
        steals:     Number(stats.steals),
        blocks:     Number(stats.blocks),
        turnovers:  Number(stats.turnovers),
        fg_made:        Number(stats.fg_made),
        fg_attempted:   Number(stats.fg_attempted),
        three_made:     Number(stats.three_made),
        three_attempted:Number(stats.three_attempted),
        ft_made:        Number(stats.ft_made),
        ft_attempted:   Number(stats.ft_attempted)
      }]);

    if (inErr) {
      setError(inErr.message);
    } else {
      setSuccess('Stats submitted! 🎉');
      // remove that match from the list
      setMatches(matches.filter(m => m.id !== selectedMatch));
      setSelectedMatch('');
      setStats({
        points: '', assists: '', rebounds: '', steals: '', blocks: '', turnovers: '',
        fg_made: '', fg_attempted: '', three_made: '', three_attempted: '', ft_made: '', ft_attempted: ''
      });
    }
  };

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Submit Your Game Stats</h1>

      {error   && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {matches.length === 0 ? (
        <p>No completed games awaiting your stats.</p>
      ) : (
        <form onSubmit={handleSubmit} className="form" style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Match selector */}
          <select
            className="form-input"
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            required
          >
            <option value="">Select Match</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {new Date(m.scheduled_date).toLocaleDateString()} vs. {m.team_a_id === teamId ? m.team_b_id : m.team_a_id}
              </option>
            ))}
          </select>

          {/* Stat fields */}
          {[
            ['points','Points'],
            ['assists','Assists'],
            ['rebounds','Rebounds'],
            ['steals','Steals'],
            ['blocks','Blocks'],
            ['turnovers','Turnovers'],
            ['fg_made','FG Made'],
            ['fg_attempted','FG Attempted'],
            ['three_made','3PT Made'],
            ['three_attempted','3PT Attempted'],
            ['ft_made','FT Made'],
            ['ft_attempted','FT Attempted'],
          ].map(([key,label])=>(
            <input
              key={key}
              type="number"
              name={key}
              min="0"
              placeholder={label}
              value={stats[key]}
              onChange={handleChange}
              className="form-input"
            />
          ))}

          <button type="submit" className="form-button" style={{ marginTop: '20px' }}>
            Submit Stats
          </button>
        </form>
      )}
    </div>
  );
}

export default SubmitPlayerStats;

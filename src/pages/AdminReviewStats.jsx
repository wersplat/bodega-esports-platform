import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AdminReviewStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({});

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('player_stats')
      .select(`
        id,
        player_id,
        team_id,
        match_id,
        season_id,
        points,
        assists,
        rebounds,
        steals,
        blocks,
        turnovers,
        fg_made,
        fg_attempted,
        three_made,
        three_attempted,
        ft_made,
        ft_attempted,
        profiles(display_name),
        teams(name),
        matches(scheduled_date)
      `)
      .eq('is_approved', false)
      .order('created_at', { ascending: true });

    if (error) console.error(error);
    else setStats(data);
    setLoading(false);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEdited({
      points:       row.points,
      assists:      row.assists,
      rebounds:     row.rebounds,
      steals:       row.steals,
      blocks:       row.blocks,
      turnovers:    row.turnovers,
      fg_made:      row.fg_made,
      fg_attempted: row.fg_attempted,
      three_made:   row.three_made,
      three_attempted: row.three_attempted,
      ft_made:      row.ft_made,
      ft_attempted: row.ft_attempted,
    });
  };

  const saveEdit = async (id) => {
    const { error } = await supabase
      .from('player_stats')
      .update(edited)
      .eq('id', id);
    if (error) console.error(error);
    else {
      setEditingId(null);
      fetchPending();
    }
  };

  const approve = async (id) => {
    const { error } = await supabase
      .from('player_stats')
      .update({ is_approved: true })
      .eq('id', id);
    if (error) console.error(error);
    else setStats(stats.filter((r) => r.id !== id));
  };

  if (loading) return <div style={{ padding: 24, color: '#cbd5e1' }}>Loading pending stats…</div>;
  if (!stats.length) return <div style={{ padding: 24, color: '#cbd5e1' }}>No stats awaiting review.</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">Admin: Review Player Stats</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, background: '#1e293b', color: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        <thead>
          <tr style={{ background: '#273449', color: '#f8fafc' }}>
            <th style={{ padding: '12px' }}>Player</th>
            <th style={{ padding: '12px' }}>Team</th>
            <th style={{ padding: '12px' }}>Match Date</th>
            <th style={{ padding: '12px' }}>PTS</th>
            <th style={{ padding: '12px' }}>AST</th>
            <th style={{ padding: '12px' }}>REB</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #334155' }}>
              <td style={{ padding: 8, color: '#cbd5e1' }}>{row.profiles.display_name}</td>
              <td style={{ padding: 8, color: '#f8fafc' }}>{row.teams.name}</td>
              <td style={{ padding: 8, color: '#f8fafc' }}>
                {new Date(row.matches.scheduled_date).toLocaleDateString()}
              </td>

              {editingId === row.id ? (
                <>
                  <td>
                    <input
                      type="number" value={edited.points}
                      onChange={(e) => setEdited({ ...edited, points: +e.target.value })}
                      style={{ width: 60, background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: 4 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number" value={edited.assists}
                      onChange={(e) => setEdited({ ...edited, assists: +e.target.value })}
                      style={{ width: 60, background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: 4 }}
                    />
                  </td>
                  <td>
                    <input
                      type="number" value={edited.rebounds}
                      onChange={(e) => setEdited({ ...edited, rebounds: +e.target.value })}
                      style={{ width: 60, background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: 4 }}
                    />
                  </td>
                  <td>
                    <button onClick={() => saveEdit(row.id)} className="form-button">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} style={{ marginLeft: 8 }} className="form-button">
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: 8, color: '#f8fafc' }}>{row.points}</td>
                  <td style={{ padding: 8, color: '#f8fafc' }}>{row.assists}</td>
                  <td style={{ padding: 8, color: '#f8fafc' }}>{row.rebounds}</td>
                  <td style={{ padding: 8 }}>
                    <button onClick={() => startEdit(row)} className="form-button">
                      Edit
                    </button>
                    <button
                      onClick={() => approve(row.id)}
                      style={{ marginLeft: 8, background: '#10b981' }}
                      className="form-button"
                    >
                      Approve
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReviewStats;

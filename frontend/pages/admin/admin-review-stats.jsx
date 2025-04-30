import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function AdminReviewStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [edited, setEdited] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://api.bodegacatsgc.gg/player-stats/pending');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEdited({
      points: row.points,
      assists: row.assists,
      rebounds: row.rebounds,
      steals: row.steals,
      blocks: row.blocks,
      turnovers: row.turnovers,
      fg_made: row.fg_made,
      fg_attempted: row.fg_attempted,
      three_made: row.three_made,
      three_attempted: row.three_attempted,
      ft_made: row.ft_made,
      ft_attempted: row.ft_attempted,
    });
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`https://api.bodegacatsgc.gg/player-stats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edited),
      });
      setEditingId(null);
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  const approve = async (id) => {
    try {
      await fetch(`https://api.bodegacatsgc.gg/player-stats/${id}/approve`, {
        method: 'POST',
      });
      setStats((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: 24, color: '#cbd5e1' }}>Loading pending stats…</div>;
  if (!stats.length) return <div style={{ padding: 24, color: '#cbd5e1' }}>No stats awaiting review.</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">Admin: Review Player Stats</h1>

      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
        ← Back to Admin Dashboard
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16, background: '#1e293b', color: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        <thead>
          <tr style={{ background: '#273449' }}>
            <th style={th}>Player</th>
            <th style={th}>Team</th>
            <th style={th}>Match Date</th>
            <th style={th}>PTS</th>
            <th style={th}>AST</th>
            <th style={th}>REB</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #334155' }}>
              <td style={td}>{row.display_name}</td>
              <td style={td}>{row.team_name}</td>
              <td style={td}>{new Date(row.scheduled_date).toLocaleDateString()}</td>
              {editingId === row.id ? (
                <>
                  <td><input type="number" value={edited.points} onChange={(e) => setEdited({ ...edited, points: +e.target.value })} style={input} /></td>
                  <td><input type="number" value={edited.assists} onChange={(e) => setEdited({ ...edited, assists: +e.target.value })} style={input} /></td>
                  <td><input type="number" value={edited.rebounds} onChange={(e) => setEdited({ ...edited, rebounds: +e.target.value })} style={input} /></td>
                  <td>
                    <button onClick={() => saveEdit(row.id)} className="form-button">Save</button>
                    <button onClick={() => setEditingId(null)} className="form-button" style={{ marginLeft: 8 }}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td style={td}>{row.points}</td>
                  <td style={td}>{row.assists}</td>
                  <td style={td}>{row.rebounds}</td>
                  <td>
                    <button onClick={() => startEdit(row)} className="form-button">Edit</button>
                    <button onClick={() => approve(row.id)} className="form-button" style={{ marginLeft: 8, background: '#10b981' }}>
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

const th = { padding: '12px' };
const td = { padding: '8px', color: '#cbd5e1' };
const input = {
  width: 60,
  background: '#273449',
  color: '#f8fafc',
  border: '1px solid #334155',
  borderRadius: 4,
};

export default AdminReviewStats;

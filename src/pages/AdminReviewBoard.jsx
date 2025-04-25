import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminReviewBoard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // 1️⃣ Fetch all submissions with status = 'pending'
  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('match_submissions')
      .select(`
        id,
        match_id,
        home_score,
        away_score,
        submitted_at,
        status,
        matches!match_submissions_match_id_fkey (
          id,
          match_date,
          home_team_id,
          away_team_id,
          leagues ( name )
        ),
        home_team:teams!match_submissions_home_team_id_fkey ( name ),
        away_team:teams!match_submissions_away_team_id_fkey ( name )
      `)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage('Failed to load submissions.');
    } else {
      setSubmissions(data);
    }
    setLoading(false);
  };

  // 2️⃣ Approve or deny
  const handleUpdateStatus = async (id, newStatus) => {
    setErrorMessage('');
    const { error } = await supabase
      .from('match_submissions')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error(error);
      setErrorMessage('Failed to update status.');
    } else {
      fetchSubmissions();
    }
  };

  if (loading) return <p style={{ padding: 20, color: '#cbd5e1' }}>Loading submissions…</p>;

  return (
    <div className="main-content">
      <button
        onClick={() => navigate('/admin')}
        className="form-button"
        style={{ marginBottom: '20px' }}
      >
        ← Back to Admin Dashboard
      </button>

      <h1 className="page-title">🛠️ Admin Review Board</h1>

      {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}

      {submissions.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No pending submissions.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#1e293b', color: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
          <thead>
            <tr>
              <th style={{ background: '#273449', color: '#f8fafc', padding: '12px' }}>Date</th>
              <th style={{ background: '#273449', color: '#f8fafc', padding: '12px' }}>Match</th>
              <th style={{ background: '#273449', color: '#f8fafc', padding: '12px' }}>Scores</th>
              <th style={{ background: '#273449', color: '#f8fafc', padding: '12px' }}>Status</th>
              <th style={{ background: '#273449', color: '#f8fafc', padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '8px', color: '#cbd5e1' }}>
                  {new Date(sub.submitted_at).toLocaleString()}
                </td>
                <td style={{ padding: '8px', color: '#f8fafc' }}>
                  [{sub.matches.leagues.name}] {sub.home_team.name} vs {sub.away_team.name}
                </td>
                <td style={{ padding: '8px', color: '#f8fafc' }}>
                  {sub.home_score} – {sub.away_score}
                </td>
                <td style={{ padding: '8px', textTransform: 'capitalize', color: '#f8fafc' }}>
                  {sub.status}
                </td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => handleUpdateStatus(sub.id, 'approved')}
                    className="form-button"
                    style={{ marginRight: 8, backgroundColor: '#4ade80' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(sub.id, 'denied')}
                    className="form-button"
                    style={{ backgroundColor: '#f87171' }}
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminReviewBoard;

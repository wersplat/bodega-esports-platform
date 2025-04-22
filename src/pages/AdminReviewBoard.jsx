import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function AdminReviewBoard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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

  if (loading) return <p style={{ padding: 20 }}>Loading submissions…</p>;

  return (
    <div style={{ padding: '100px 24px 24px' }}>
      <h1 className="page-title">🛠️ Admin Review Board</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Match</th>
              <th>Scores</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>
                  {new Date(sub.submitted_at).toLocaleString()}
                </td>
                <td style={{ padding: '8px' }}>
                  [{sub.matches.leagues.name}] {sub.home_team.name} vs {sub.away_team.name}
                </td>
                <td style={{ padding: '8px' }}>
                  {sub.home_score} – {sub.away_score}
                </td>
                <td style={{ padding: '8px', textTransform: 'capitalize' }}>
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

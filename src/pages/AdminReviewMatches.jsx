import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminReviewMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('matches')
      .select('id, team_a_name, team_b_name, team_a_score, team_b_score')
      .eq('is_approved', false);

    if (error) {
      console.error('Error fetching matches:', error.message);
    } else {
      setMatches(data);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    const { error } = await supabase
      .from('matches')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) {
      console.error('Error approving match:', error.message);
    } else {
      fetchMatches(); // Refresh
    }
  };

  const handleReject = async (id) => {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error rejecting match:', error.message);
    } else {
      fetchMatches(); // Refresh
    }
  };

  if (loading) {
    return <div style={{ paddingTop: '100px' }}>Loading matches...</div>;
  }

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Admin: Review Match Results</h1>

      {matches.length === 0 ? (
        <p>No pending match results.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {matches.map((match) => (
            <li key={match.id} style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
              <h3>{match.team_a_name} ({match.team_a_score}) vs {match.team_b_name} ({match.team_b_score})</h3>

              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button
                  className="form-button"
                  style={{ backgroundColor: '#22c55e' }}
                  onClick={() => handleApprove(match.id)}
                >
                  Approve
                </button>

                <button
                  className="form-button"
                  style={{ backgroundColor: '#ef4444' }}
                  onClick={() => handleReject(match.id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminReviewMatches;

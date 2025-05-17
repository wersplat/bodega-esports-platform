import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Match {
  id: string;
  team_a_name: string;
  team_a_score: number;
  team_b_name: string;
  team_b_score: number;
}

const AdminReviewMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch('https://api.bodegacatsgc.gg/matches/pending');
      if (!res.ok) throw new Error('Failed to fetch matches');
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string): Promise<void> => {
    try {
      await fetch(`https://api.bodegacatsgc.gg/matches/${id}/approve`, {
        method: 'POST',
      });
      fetchMatches();
    } catch (err) {
      // console.error(err);
    }
  };

  const handleReject = async (id: string): Promise<void> => {
    try {
      await fetch(`https://api.bodegacatsgc.gg/matches/${id}`, {
        method: 'DELETE',
      });
      fetchMatches();
    } catch (err) {
      // console.error(err);
    }
  };

  if (loading) return <div style={{ paddingTop: '100px', color: '#cbd5e1' }}>Loading matches...</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">Admin: Review Match Results</h1>
      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
        ← Back to Admin Dashboard
      </button>

      {matches.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No pending match results.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {matches.map((match) => (
            <li key={match.id} style={{ marginBottom: '20px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.18)' }}>
              <h3>{match.team_a_name} ({match.team_a_score}) vs {match.team_b_name} ({match.team_b_score})</h3>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button className="form-button" style={{ backgroundColor: '#22c55e' }} onClick={() => handleApprove(match.id)}>
                  Approve
                </button>
                <button className="form-button" style={{ backgroundColor: '#ef4444' }} onClick={() => handleReject(match.id)}>
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReviewMatches;

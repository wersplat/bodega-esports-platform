import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Submission {
  id: string;
  submitted_at: string;
  league_name: string;
  home_team_name: string;
  away_team_name: string;
  home_score: number;
  away_score: number;
  status: string;
}

const th = {
  background: '#273449',
  color: '#f8fafc',
  padding: '12px',
  textAlign: 'left' as const
};

const td = {
  padding: '8px',
  color: '#cbd5e1',
  textAlign: 'left' as const
};

const AdminReviewBoard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/match-submissions?status=pending');
      if (!res.ok) throw new Error('Failed to load submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string): Promise<void> => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/match-submissions/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update submission status');
      fetchSubmissions();
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  if (loading) return <p style={{ padding: 20, color: '#cbd5e1' }}>Loading submissions…</p>;

  return (
    <div className="main-content">
      <button
        onClick={() => router.push('/admin')}
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
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: 20,
          background: '#1e293b',
          color: '#f8fafc',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
        }}>
          <thead>
            <tr>
              <th style={th}>Date</th>
              <th style={th}>Match</th>
              <th style={th}>Scores</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.id} style={{ borderBottom: '1px solid #334155' }}>
                <td style={td}>{new Date(sub.submitted_at).toLocaleString()}</td>
                <td style={td}>
                  [{sub.league_name}] {sub.home_team_name} vs {sub.away_team_name}
                </td>
                <td style={td}>{sub.home_score} – {sub.away_score}</td>
                <td style={td}>{sub.status}</td>
                <td style={td}>
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
};

export default AdminReviewBoard;

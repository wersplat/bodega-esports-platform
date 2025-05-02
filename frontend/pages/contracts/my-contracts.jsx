import { useEffect, useState } from 'react';

function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/contracts/my');
      if (!res.ok) throw new Error('Failed to load contracts');
      const data = await res.json();
      setContracts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const act = async (id, newStatus) => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/contracts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update contract status');
      setContracts(contracts.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="main-content" style={{ color: '#cbd5e1' }}>Loading…</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">My Contract Offers</h1>
      {contracts.length === 0 ? (
        <p style={{ color: '#cbd5e1' }}>No offers.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#1e293b', color: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
          <thead>
            <tr style={{ background: '#273449', color: '#f8fafc' }}>
              <th style={th}>Team</th>
              <th style={th}>End</th>
              <th style={th}>Status</th>
              <th style={th}>Buyout</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id} style={{ textAlign: 'center', borderBottom: '1px solid #334155' }}>
                <td style={td}>{c.team_name}</td>
                <td style={td}>{c.term_end}</td>
                <td style={td}>{c.status}</td>
                <td style={td}>{c.buyout_amount ?? '-'}</td>
                <td style={td}>
                  {c.status === 'Pending' && (
                    <>
                      <button onClick={() => act(c.id, 'Accepted')} className="form-button" style={{ backgroundColor: '#4ade80' }}>
                        Accept
                      </button>
                      <button onClick={() => act(c.id, 'Rejected')} className="form-button" style={{ marginLeft: 8, backgroundColor: '#f87171' }}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = { padding: '12px' };
const td = { padding: '8px', color: '#cbd5e1' };

export default MyContracts;

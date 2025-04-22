// src/pages/MyContracts.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('contracts')
        .select(`
          id, term_start, term_end, buyout_amount, status,
          teams ( name )
        `)
        .order('created_at', { ascending: false });
      setContracts(data);
      setLoading(false);
    };
    load();
  }, []);

  const act = async (id, newStatus) => {
    await supabase.from('contracts').update({ status: newStatus }).eq('id', id);
    setContracts(contracts.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  if (loading) return <div className="main-content">Loading…</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">My Contract Offers</h1>
      {contracts.length === 0 ? (
        <p>No offers.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Team</th><th>End</th><th>Status</th><th>Buyout</th><th>Action</th></tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id} style={{ textAlign: 'center' }}>
                <td>{c.teams.name}</td>
                <td>{c.term_end}</td>
                <td>{c.status}</td>
                <td>{c.buyout_amount ?? '-'}</td>
                <td>
                  {c.status === 'Pending' && (
                    <>
                      <button onClick={() => act(c.id, 'Accepted')}>Accept</button>
                      <button onClick={() => act(c.id, 'Rejected')} style={{ marginLeft: 8 }}>
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

export default MyContracts;

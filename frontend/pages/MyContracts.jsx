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
              <th style={{ padding: '12px' }}>Team</th>
              <th style={{ padding: '12px' }}>End</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Buyout</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.id} style={{ textAlign: 'center', borderBottom: '1px solid #334155' }}>
                <td style={{ padding: 8, color: '#cbd5e1' }}>{c.teams.name}</td>
                <td style={{ padding: 8, color: '#f8fafc' }}>{c.term_end}</td>
                <td style={{ padding: 8, color: '#f8fafc' }}>{c.status}</td>
                <td style={{ padding: 8, color: '#f8fafc' }}>{c.buyout_amount ?? '-'}</td>
                <td style={{ padding: 8 }}>
                  {c.status === 'Pending' && (
                    <>
                      <button onClick={() => act(c.id, 'Accepted')} className="form-button" style={{ backgroundColor: '#4ade80' }}>Accept</button>
                      <button onClick={() => act(c.id, 'Rejected')} className="form-button" style={{ marginLeft: 8, backgroundColor: '#f87171' }}>Reject</button>
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

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AdminManageWebhooks() {
  const [user, setUser] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load user
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    })();
  }, []);

  // Fetch webhooks
  useEffect(() => {
    if (!user) return;
    fetchWebhooks();
  }, [user]);

  const fetchWebhooks = async () => {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setWebhooks(data || []);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');

    if (!newName || !newUrl) {
      setError('Name & URL required.');
      return;
    }
    const { error } = await supabase.from('webhooks').insert([
      { name: newName, url: newUrl, category: 'announcements', created_by: user.id }
    ]);
    if (error) setError(error.message);
    else {
      setSuccess('Webhook added!');
      setNewName(''); setNewUrl('');
      fetchWebhooks();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('webhooks').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchWebhooks();
  };

  if (!user) return <div className="main-content">Loading user…</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">🛠 Manage Webhooks</h1>
      <form onSubmit={handleAdd} className="form" style={{ maxWidth: 500, margin: 'auto', background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        <input
          type="text"
          placeholder="Webhook Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="url"
          placeholder="Webhook URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="form-button">
          Add
        </button>
        {success && <p style={{ color: '#34d399' }}>{success}</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}
      </form>

      <h2 style={{ textAlign: 'center', marginTop: 40, color: '#f8fafc' }}>Your Webhooks</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {webhooks.map((hook) => (
          <li key={hook.id} style={{ margin: '20px 0', padding: 20, background: '#222b3a', color: '#f8fafc', borderRadius: 8, boxShadow: '0 0 6px rgba(0,0,0,0.18)' }}>
            <strong>{hook.name}</strong><br />
            <span style={{ fontSize: 12, wordBreak: 'break-all', color: '#cbd5e1' }}>{hook.url}</span><br />
            <button
              onClick={() => handleDelete(hook.id)}
              className="form-button"
              style={{ backgroundColor: '#ef4444', marginTop: 8 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminManageWebhooks;

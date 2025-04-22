import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminManageWebhooks() {
  const [user, setUser] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // 1) load current user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // 2) fetch own webhooks
  useEffect(() => {
    if (!user) return;
    supabase
      .from('webhooks')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setWebhooks(data);
      });
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    if (!newName || !newUrl) {
      setError('Name & URL required.');
      return;
    }
    const { error } = await supabase
      .from('webhooks')
      .insert([{
        name: newName,
        url: newUrl,
        category: 'announcements',
        created_by: user.id
      }]);
    if (error) setError(error.message);
    else {
      setSuccess('Webhook added!');
      setNewName(''); setNewUrl('');
      // refresh
      const { data } = await supabase
        .from('webhooks')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      setWebhooks(data);
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('webhooks').delete().eq('id', id);
    setWebhooks(w => w.filter(w => w.id !== id));
  };

  return (
    <div style={{ padding: 80, maxWidth: 600, margin: 'auto' }}>
      <h1 className="page-title">Manage Webhooks</h1>

      <form onSubmit={handleAdd} className="form">
        <input
          className="form-input"
          placeholder="Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          className="form-input"
          placeholder="https://discord.com/api/…"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
        />
        <button className="form-button">Add</button>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error   && <p style={{ color: 'red'  }}>{error}</p>}
      </form>

      <h2>Your Webhooks</h2>
      <ul>
        {webhooks.map(h => (
          <li key={h.id}>
            <strong>{h.name}</strong><br/>
            <small style={{ wordBreak: 'break-all' }}>{h.url}</small><br/>
            <button onClick={()=>handleDelete(h.id)} style={{ marginTop:4 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

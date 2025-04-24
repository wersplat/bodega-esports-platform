import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SendAnnouncement() {
  const [user, setUser] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [selected, setSelected] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState({ success: '', error: '' });

  // load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // load only announcements webhooks
  useEffect(() => {
    if (!user) return;
    supabase
      .from('webhooks')
      .select('*')
      .eq('category', 'announcements')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setWebhooks(data);
      });
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    setMsg({ success: '', error: '' });
    if (!selected || !title || !desc) {
      setMsg((m) => ({ ...m, error: 'All fields required.' }));
      return;
    }
    try {
      const res = await fetch('/api/discord/announce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhook_url: selected,
          title,
          description: desc,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg((m) => ({ ...m, success: 'Sent to Discord!' }));
      setTitle('');
      setDesc('');
      setSelected('');
    } catch (err) {
      console.error(err);
      setMsg((m) => ({ ...m, error: 'Failed to send.' }));
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Discord Announcement</h1>
      <form onSubmit={handleSend} className="form" style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 500, margin: '0 auto' }}>
        <select
          className="form-input"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          required
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        >
          <option value="">Select Webhook</option>
          {webhooks.map(w => (
            <option key={w.id} value={w.url} style={{ background: '#1e293b', color: '#f8fafc' }}>{w.name}</option>
          ))}
        </select>
        <input
          className="form-input"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        />
        <textarea
          className="form-input"
          placeholder="Description"
          rows={4}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          required
          style={{ background: '#273449', color: '#f8fafc', border: '1px solid #334155', borderRadius: '8px', padding: '8px' }}
        />
        <button className="form-button" style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', marginTop: '20px' }}>Send</button>
        {msg.success && <p style={{ color: '#34d399', marginTop: '10px' }}>{msg.success}</p>}
        {msg.error && <p style={{ color: '#f87171', marginTop: '10px' }}>{msg.error}</p>}
      </form>
    </div>
  );
}

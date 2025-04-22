import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SendAnnouncement() {
  const [user, setUser] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [selected, setSelected] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState({ success:'', error:'' });

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
    setMsg({ success:'', error:'' });
    if (!selected || !title|| !desc) {
      setMsg(m => ({ ...m, error: 'All fields required.' }));
      return;
    }
    try {
      const res = await fetch(selected, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          embeds:[{ title, description: desc, color: 5814783 }]
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg(m=>({ ...m, success:'Sent to Discord!' }));
      setTitle(''); setDesc(''); setSelected('');
    } catch(err) {
      console.error(err);
      setMsg(m=>({ ...m, error:'Failed to send.' }));
    }
  };

  return (
    <div style={{ padding: 80, maxWidth: 600, margin: 'auto' }}>
      <h1 className="page-title">Discord Announcement</h1>
      <form onSubmit={handleSend} className="form">
        <select
          className="form-input"
          value={selected}
          onChange={e=>setSelected(e.target.value)}
          required
        >
          <option value="">Select Webhook</option>
          {webhooks.map(w=>(
            <option key={w.id} value={w.url}>{w.name}</option>
          ))}
        </select>
        <input
          className="form-input"
          placeholder="Title"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-input"
          placeholder="Description"
          rows={4}
          value={desc}
          onChange={e=>setDesc(e.target.value)}
          required
        />
        <button className="form-button">Send</button>
        {msg.success && <p style={{color:'green'}}>{msg.success}</p>}
        {msg.error   && <p style={{color:'red'}}>{msg.error}</p>}
      </form>
    </div>
  );
}

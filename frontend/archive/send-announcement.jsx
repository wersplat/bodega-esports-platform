import React, { useState, useEffect } from 'react';

function SendAnnouncement() {
  const [webhooks, setWebhooks] = useState([]);
  const [selected, setSelected] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState({ success: '', error: '' });

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/webhooks?category=announcements');
      if (!res.ok) throw new Error('Failed to load webhooks');
      const data = await res.json();
      setWebhooks(data);
    } catch (err) {
      // Handle error (was: console.error(err))
      setMsg({ success: '', error: 'Failed to load webhooks' });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setMsg({ success: '', error: '' });

    if (!selected || !title || !desc) {
      setMsg({ error: 'All fields are required.', success: '' });
      return;
    }

    try {
      const res = await fetch('https://api.bodegacatsgc.gg/discord/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_id: selected, title, description: desc }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMsg({ success: 'Sent to Discord!', error: '' });
      setTitle('');
      setDesc('');
      setSelected('');
    } catch (err) {
      // Handle error (was: console.error(err))
      setMsg({ success: '', error: 'Failed to send.' });
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Send Discord Announcement</h1>

      <form onSubmit={handleSend} className="form" style={{
        background: '#1e293b',
        borderRadius: 12,
        padding: 24,
        maxWidth: 500,
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
      }}>
        <select className="form-input" value={selected} onChange={(e) => setSelected(e.target.value)} required>
          <option value="">Select Webhook</option>
          {webhooks.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>

        <input className="form-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="form-input" placeholder="Description" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} required />

        <button type="submit" className="form-button" style={{ backgroundColor: '#3b82f6', marginTop: 12 }}>
          Send
        </button>

        {msg.success && <p style={{ color: '#34d399', marginTop: 10 }}>{msg.success}</p>}
        {msg.error && <p style={{ color: '#f87171', marginTop: 10 }}>{msg.error}</p>}
      </form>
    </div>
  );
}

export default SendAnnouncement;

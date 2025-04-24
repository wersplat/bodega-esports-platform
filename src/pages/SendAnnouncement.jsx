import React, { useState } from 'react';

export default function SendAnnouncement() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState({ success: '', error: '' });

  const sendAnnouncement = async () => {
    try {
      const res = await fetch('/api/discord/announce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: desc,
        }),
      });

      if (res.ok) {
        setMsg({ success: 'Announcement sent successfully!', error: '' });
      } else {
        const errorData = await res.json();
        setMsg({ success: '', error: errorData.message || 'Failed to send announcement.' });
      }
    } catch {
      setMsg({ success: '', error: 'An error occurred while sending the announcement.' });
    }
  };

  return (
    <div>
      <h1>Send Announcement</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button onClick={sendAnnouncement}>Send</button>
      {msg.success && <p style={{ color: 'green' }}>{msg.success}</p>}
      {msg.error && <p style={{ color: 'red' }}>{msg.error}</p>}
    </div>
  );
}

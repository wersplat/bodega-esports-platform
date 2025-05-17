import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Webhook {
  id: string;
  name: string;
  url: string;
}

const AdminManageWebhooks: React.FC = () => {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newName, setNewName] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/webhooks');
      if (!res.ok) throw new Error('Failed to fetch webhooks');
      const data = await res.json();
      setWebhooks(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdd = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!newName || !newUrl) {
      setError('Name & URL required.');
      return;
    }

    try {
      const res = await fetch('https://api.bodegacatsgc.gg/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          url: newUrl,
          category: 'announcements',
        }),
      });
      if (!res.ok) throw new Error('Failed to add webhook');
      setSuccess('Webhook added!');
      setNewName('');
      setNewUrl('');
      fetchWebhooks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/webhooks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete webhook');
      fetchWebhooks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="main-content">
      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
        ← Back to Admin Dashboard
      </button>

      <h1 className="page-title">🛠 Manage Webhooks</h1>

      <form
        onSubmit={handleAdd}
        className="form"
        style={{
          maxWidth: 500,
          margin: 'auto',
          background: '#1e293b',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        <input type="text" placeholder="Webhook Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="form-input" required />
        <input type="url" placeholder="Webhook URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="form-input" required />
        <button type="submit" className="form-button">Add</button>
        {success && <p style={{ color: '#34d399' }}>{success}</p>}
        {error && <p style={{ color: '#f87171' }}>{error}</p>}
      </form>

      <h2 style={{ textAlign: 'center', marginTop: 40, color: '#f8fafc' }}>Your Webhooks</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {webhooks.map((hook) => (
          <li
            key={hook.id}
            style={{
              margin: '20px 0',
              padding: 20,
              background: '#222b3a',
              color: '#f8fafc',
              borderRadius: 8,
              boxShadow: '0 0 6px rgba(0,0,0,0.18)',
            }}
          >
            <strong>{hook.name}</strong>
            <br />
            <span style={{ fontSize: 12, wordBreak: 'break-all', color: '#cbd5e1' }}>{hook.url}</span>
            <br />
            <button onClick={() => handleDelete(hook.id)} className="form-button" style={{ backgroundColor: '#ef4444', marginTop: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminManageWebhooks;

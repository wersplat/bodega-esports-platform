import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AdminManageWebhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('announcements');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    const { data, error } = await supabase.from('webhooks').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching webhooks:', error.message);
    else setWebhooks(data || []);
  };

  const handleAddWebhook = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newName || !newUrl || !newCategory) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    const { error } = await supabase.from('webhooks').insert([
      { name: newName, url: newUrl, category: newCategory }
    ]);

    if (error) {
      console.error(error);
      setErrorMessage('Failed to add webhook.');
    } else {
      setSuccessMessage('Webhook added!');
      setNewName('');
      setNewUrl('');
      setNewCategory('announcements');
      fetchWebhooks();
    }
  };

  const handleDeleteWebhook = async (id) => {
    const { error } = await supabase.from('webhooks').delete().eq('id', id);

    if (error) {
      console.error(error);
      alert('Failed to delete webhook.');
    } else {
      fetchWebhooks();
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Manage Webhooks</h1>

      <form onSubmit={handleAddWebhook} className="form" style={{ marginBottom: '30px', maxWidth: '500px', marginInline: 'auto' }}>
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
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="form-input"
          required
        >
          <option value="announcements">Announcements</option>
          <option value="scores">Score Reports</option>
          <option value="emergencies">Emergencies</option>
        </select>
        <button type="submit" className="form-button" style={{ backgroundColor: '#3b82f6' }}>
          Add Webhook
        </button>
        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      </form>

      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Saved Webhooks</h2>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {webhooks.map((hook) => (
          <li key={hook.id} style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
            <h3>{hook.name}</h3>
            <p><strong>Category:</strong> {hook.category}</p>
            <p style={{ wordBreak: 'break-all' }}>{hook.url}</p>
            <button onClick={() => handleDeleteWebhook(hook.id)} className="form-button" style={{ backgroundColor: '#f87171' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminManageWebhooks;

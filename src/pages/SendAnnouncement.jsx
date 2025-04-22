import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function SendAnnouncement() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('65280');
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhookId, setSelectedWebhookId] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookName, setNewWebhookName] = useState('');

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    const { data, error } = await supabase.from('webhooks').select('*');
    if (error) {
      console.error('Failed to load webhooks:', error.message);
    } else {
      setWebhooks(data || []);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!selectedWebhookId) {
      alert('Please select a webhook.');
      return;
    }

    const webhook = webhooks.find((w) => w.id === selectedWebhookId);
    if (!webhook) {
      alert('Invalid webhook selection.');
      return;
    }

    const payload = {
      embeds: [
        {
          title: title,
          description: description,
          color: parseInt(color),
        },
      ],
    };

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      alert('Announcement sent successfully!');
    } catch (error) {
      console.error('Error sending announcement:', error.message);
      alert('Failed to send announcement.');
    }
  };

  const handleAddWebhook = async () => {
    if (!newWebhookUrl || !newWebhookName) {
      alert('Please enter both a webhook name and URL.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('webhooks').insert([
      {
        name: newWebhookName,
        url: newWebhookUrl,
        created_by: user.id,
      }
    ]);

    if (error) {
      console.error('Failed to add webhook:', error.message);
      alert('Failed to add webhook.');
    } else {
      alert('Webhook added!');
      setNewWebhookUrl('');
      setNewWebhookName('');
      fetchWebhooks(); // Refresh the list
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Send Discord Announcement</h1>

      <form onSubmit={handleSend} className="form" style={{ marginTop: '30px' }}>
        <select
          value={selectedWebhookId}
          onChange={(e) => setSelectedWebhookId(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Webhook</option>
          {webhooks.map((webhook) => (
            <option key={webhook.id} value={webhook.id}>
              {webhook.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          required
        />
        <textarea
          placeholder="Announcement Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="text"
          placeholder="Color (default 65280)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="form-input"
        />

        <button type="submit" className="form-button" style={{ backgroundColor: '#3b82f6' }}>
          Send Announcement
        </button>
      </form>

      <div style={{ marginTop: '50px' }}>
        <h2>Add New Webhook</h2>
        <input
          type="text"
          placeholder="Webhook Name"
          value={newWebhookName}
          onChange={(e) => setNewWebhookName(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Webhook URL"
          value={newWebhookUrl}
          onChange={(e) => setNewWebhookUrl(e.target.value)}
          className="form-input"
        />
        <button type="button" onClick={handleAddWebhook} className="form-button" style={{ backgroundColor: '#10b981' }}>
          Add Webhook
        </button>
      </div>
    </div>
  );
}

export default SendAnnouncement;

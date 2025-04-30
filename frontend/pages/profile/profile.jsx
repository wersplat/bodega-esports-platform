import { useEffect, useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/profile/me');
      const data = await res.json();
      setProfile(data);
      setForm(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to update');
      setMsg('✅ Profile updated!');
    } catch (err) {
      setMsg('❌ Update failed');
    }
  };

  if (loading) return <div className="main-content">Loading profile...</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 500, marginTop: 30 }}>
        {['display_name', 'platform', 'gamer_tag', 'positions', 'avatar_url', 'career_history'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field] || ''}
            onChange={handleChange}
            placeholder={field.replace('_', ' ').toUpperCase()}
            className="form-input"
          />
        ))}

        <button type="submit" className="form-button" style={{ marginTop: '20px' }}>Save</button>
        {msg && <p style={{ marginTop: 12, color: msg.startsWith('✅') ? '#34d399' : '#f87171' }}>{msg}</p>}
      </form>
    </div>
  );
}

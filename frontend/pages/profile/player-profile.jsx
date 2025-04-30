import { useEffect, useState } from 'react';

export default function PlayerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/profile/me');
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="main-content">Loading profile...</div>;

  return (
    <div className="main-content">
      <h1 className="page-title">Player Profile</h1>

      {profile ? (
        <div style={{ marginTop: 20, background: '#1e293b', borderRadius: 12, padding: 24, color: '#f8fafc' }}>
          <p><strong>Display Name:</strong> {profile.display_name}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Platform:</strong> {profile.platform}</p>
          <p><strong>Gamertag:</strong> {profile.gamer_tag}</p>
          <p><strong>Position:</strong> {profile.positions}</p>
          <p><strong>Career History:</strong> {profile.career_history || 'N/A'}</p>
        </div>
      ) : (
        <p style={{ color: '#cbd5e1' }}>Profile not found.</p>
      )}
    </div>
  );
}

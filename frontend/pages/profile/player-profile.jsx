import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Player Profile</h1>
        {profile ? (
          <div className="space-y-2 text-foreground">
            <p><strong>Display Name:</strong> {profile.display_name}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Platform:</strong> {profile.platform}</p>
            <p><strong>Gamertag:</strong> {profile.gamer_tag}</p>
            <p><strong>Position:</strong> {profile.positions}</p>
            <p><strong>Career History:</strong> {profile.career_history || 'N/A'}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Profile not found.</p>
        )}
      </Card>
    </div>
  );
}

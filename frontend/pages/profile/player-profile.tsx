import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import React from 'react';

interface PlayerProfileData {
  display_name?: string;
  username?: string;
  platform?: string;
  gamer_tag?: string;
  positions?: string;
  career_history?: string;
}

export default function PlayerProfile() {
  const [profile, setProfile] = useState<PlayerProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/auth/me');
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      // Handle error (removed console statement)
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#94a3b8] bg-[#0f172a]">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <Card className="p-8 w-full max-w-lg bg-[#1e293b] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-[#f8fafc]">Player Profile</h1>
        {profile ? (
          <div className="space-y-2 text-[#f8fafc]">
            <p><strong>Display Name:</strong> {profile.display_name}</p>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Platform:</strong> {profile.platform}</p>
            <p><strong>Gamertag:</strong> {profile.gamer_tag}</p>
            <p><strong>Position:</strong> {profile.positions}</p>
            <p><strong>Career History:</strong> {profile.career_history || 'N/A'}</p>
          </div>
        ) : (
          <p className="text-[#94a3b8]">Profile not found.</p>
        )}
      </Card>
    </div>
  );
}

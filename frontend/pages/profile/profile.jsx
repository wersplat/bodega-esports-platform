import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Profile() {
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
      setForm(data);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading profile...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {['display_name', 'platform', 'gamer_tag', 'positions', 'avatar_url', 'career_history'].map((field) => (
            <Input
              key={field}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              placeholder={field.replace('_', ' ').toUpperCase()}
              className="w-full"
            />
          ))}
          <Button type="submit" className="w-full mt-2">Save</Button>
          {msg && <p className={`mt-2 text-center ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
        </form>
      </Card>
    </div>
  );
}

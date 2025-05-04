import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SubmitPlayerStats() {
  const [form, setForm] = useState({ player: '', match: '', points: '', assists: '', rebounds: '', steals: '', blocks: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      // Replace with your API endpoint
      const res = await fetch('https://api.bodegacatsgc.gg/player-stats/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit stats');
      setMsg('✅ Stats submitted!');
      setForm({ player: '', match: '', points: '', assists: '', rebounds: '', steals: '', blocks: '' });
    } catch (err) {
      setMsg('❌ Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Submit Player Stats</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="player" value={form.player} onChange={handleChange} placeholder="Player Name or ID" required />
          <Input name="match" value={form.match} onChange={handleChange} placeholder="Match ID" required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="points" value={form.points} onChange={handleChange} placeholder="Points" type="number" min="0" />
            <Input name="assists" value={form.assists} onChange={handleChange} placeholder="Assists" type="number" min="0" />
            <Input name="rebounds" value={form.rebounds} onChange={handleChange} placeholder="Rebounds" type="number" min="0" />
            <Input name="steals" value={form.steals} onChange={handleChange} placeholder="Steals" type="number" min="0" />
            <Input name="blocks" value={form.blocks} onChange={handleChange} placeholder="Blocks" type="number" min="0" />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={loading}>{loading ? 'Submitting...' : 'Submit Stats'}</Button>
          {msg && <p className={`mt-2 text-center ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
        </form>
      </Card>
    </div>
  );
}

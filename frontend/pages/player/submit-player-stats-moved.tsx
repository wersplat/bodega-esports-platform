import { useState, ChangeEvent, FormEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PlayerStatsForm {
  player: string;
  match: string;
  points: string;
  assists: string;
  rebounds: string;
  steals: string;
  blocks: string;
}

const initialForm: PlayerStatsForm = {
  player: '',
  match: '',
  points: '',
  assists: '',
  rebounds: '',
  steals: '',
  blocks: '',
};

const SubmitPlayerStats: React.FC = () => {
  const [form, setForm] = useState<PlayerStatsForm>(initialForm);
  const [msg, setMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/player-stats/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit stats');
      setMsg('✅ Stats submitted!');
      setForm(initialForm);
    } catch (err) {
      setMsg('❌ Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <Card className="p-8 w-full max-w-lg bg-[#1e293b] rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-[#f8fafc]">Submit Player Stats</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="player" value={form.player} onChange={handleChange} placeholder="Player Name or ID" required className="bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]" />
          <Input name="match" value={form.match} onChange={handleChange} placeholder="Match ID" required className="bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="points" value={form.points} onChange={handleChange} placeholder="Points" type="number" min="0" className="bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]" />
            <Input name="assists" value={form.assists} onChange={handleChange} placeholder="Assists" type="number" min="0" className="bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]" />
            <Input name="rebounds" value={form.rebounds} onChange={handleChange} placeholder="Rebounds" type="number" min="0" className="bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]" />
            <Input name="steals" value={form.steals} onChange={handleChange} placeholder="Steals" type="number" min="0" className="bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]" />
            <Input name="blocks" value={form.blocks} onChange={handleChange} placeholder="Blocks" type="number" min="0" className="bg-[#273449] border border-[#334155] text-[#f8fafc] placeholder-[#94a3b8]" />
          </div>
          <Button type="submit" className="w-full mt-2 bg-[#e11d48] text-[#f8fafc] hover:bg-[#be123c] transition-all duration-200" disabled={loading}>{loading ? 'Submitting...' : 'Submit Stats'}</Button>
          {msg && <p className={`mt-2 text-center text-sm ${msg.startsWith('✅') ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{msg}</p>}
        </form>
      </Card>
    </div>
  );
};

export default SubmitPlayerStats;

import React, { useState, FormEvent, ChangeEvent } from 'react';

interface TeamForm {
  name: string;
  division: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
}

const initialForm: TeamForm = {
  name: '',
  division: '',
  description: '',
  logoUrl: '',
  bannerUrl: '',
};

const TeamCreation: React.FC = () => {
  const [form, setForm] = useState<TeamForm>(initialForm);
  const [msg, setMsg] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          division: form.division,
          description: form.description,
          logo_url: form.logoUrl,
          banner_url: form.bannerUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed to create team');
      setMsg('✅ Team created!');
      setForm(initialForm);
    } catch {
      setMsg('❌ Failed to create team');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">Create a Team</h1>
          <p className="text-[#94a3b8] mb-4">Start your journey by creating a new team</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-lg shadow-md p-6 space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Team Name" className="form-input w-full" required />
          <input name="division" value={form.division} onChange={handleChange} placeholder="Division" className="form-input w-full" />
          <input name="logoUrl" value={form.logoUrl} onChange={handleChange} placeholder="Logo URL" className="form-input w-full" />
          <input name="bannerUrl" value={form.bannerUrl} onChange={handleChange} placeholder="Banner URL" className="form-input w-full" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Team Description" className="form-input w-full" />

          <button type="submit" className="form-button w-full bg-[#e11d48] text-[#f8fafc] hover:bg-[#be123c] transition-all duration-200">Create Team</button>
          {msg && <p className={`mt-2 text-center text-sm ${msg.includes('✅') ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{msg}</p>}
        </form>
      </div>
    </div>
  );
};

export default TeamCreation;

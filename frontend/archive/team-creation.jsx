import React, { useState } from 'react';

function TeamCreation() {
  const [name, setName] = useState('');
  const [division, setDivision] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          division,
          description,
          logo_url: logoUrl,
          banner_url: bannerUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed to create team');
      setMsg('✅ Team created!');
      setName('');
      setDivision('');
      setDescription('');
      setLogoUrl('');
      setBannerUrl('');
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
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Name" className="form-input w-full" required />
          <input value={division} onChange={(e) => setDivision(e.target.value)} placeholder="Division" className="form-input w-full" />
          <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" className="form-input w-full" />
          <input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="Banner URL" className="form-input w-full" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Team Description" className="form-input w-full" />

          <button type="submit" className="form-button w-full bg-[#e11d48] text-[#f8fafc] hover:bg-[#be123c] transition-all duration-200">Create Team</button>
          {msg && <p className={`mt-2 text-center text-sm ${msg.includes('✅') ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{msg}</p>}
        </form>
      </div>
    </div>
  );
}

export default TeamCreation;

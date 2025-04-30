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
    <div className="main-content">
      <h1 className="page-title">Create a Team</h1>

      <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 500 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team Name" className="form-input" required />
        <input value={division} onChange={(e) => setDivision(e.target.value)} placeholder="Division" className="form-input" />
        <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" className="form-input" />
        <input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="Banner URL" className="form-input" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Team Description" className="form-input" />

        <button type="submit" className="form-button">Create Team</button>
        {msg && <p style={{ marginTop: 10, color: msg.includes('✅') ? '#34d399' : '#f87171' }}>{msg}</p>}
      </form>
    </div>
  );
}

export default TeamCreation;

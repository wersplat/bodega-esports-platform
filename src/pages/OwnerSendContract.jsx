// src/pages/OwnerSendContract.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function OwnerSendContract() {
  const [players, setPlayers] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedTeam, setSelectedTeam]   = useState('');
  const [termEnd, setTermEnd]             = useState('');
  const [buyout, setBuyout]               = useState('');
  const [msg, setMsg]                     = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        nav('/');
        return;
      }

      const { data: teams } = await supabase
        .from('teams')
        .select('id,name')
        .eq('owner_id', user.id);
      setMyTeams(teams);

      const { data: freeAgents } = await supabase
        .rpc('get_free_agents');    // optional SQL function
      // fallback – just list all profiles for now
      setPlayers(freeAgents ?? []);
    };
    load();
  }, []);

  const sendOffer = async (e) => {
    e.preventDefault();
    if (!selectedPlayer || !selectedTeam || !termEnd) {
      setMsg('Fill all required fields');
      return;
    }
    const { error } = await supabase.from('contracts').insert([{
      player_id: selectedPlayer,
      team_id:   selectedTeam,
      term_end:  termEnd,
      buyout_amount: buyout ? Number(buyout) : null
    }]);
    if (error) setMsg(error.message);
    else {
      setMsg('Offer sent! 🎉');
      setSelectedPlayer('');
      setSelectedTeam('');
      setTermEnd('');
      setBuyout('');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Send Contract Offer</h1>

      {msg && <p>{msg}</p>}

      <form onSubmit={sendOffer} className="form" style={{ maxWidth: 400 }}>
        <select
          className="form-input"
          value={selectedPlayer}
          onChange={e => setSelectedPlayer(e.target.value)}
          required
        >
          <option value="">Select Player</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.display_name || p.username}</option>
          ))}
        </select>

        <select
          className="form-input"
          value={selectedTeam}
          onChange={e => setSelectedTeam(e.target.value)}
          required
        >
          <option value="">Select Your Team</option>
          {myTeams.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <label style={{ fontSize: 14 }}>Contract End Date*</label>
        <input
          type="date"
          className="form-input"
          value={termEnd}
          onChange={e => setTermEnd(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Buyout Amount (optional)"
          className="form-input"
          value={buyout}
          onChange={e => setBuyout(e.target.value)}
          min="0"
          step="0.01"
        />

        <button className="form-button" style={{ marginTop: 16 }}>
          Send Offer
        </button>
      </form>
    </div>
  );
}

export default OwnerSendContract;

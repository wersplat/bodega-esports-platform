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
  }, [nav]);

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
      setMsg('Contract offer sent successfully!');
      setSelectedPlayer('');
      setSelectedTeam('');
      setTermEnd('');
      setBuyout('');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Send Contract Offer</h1>

      <form
        onSubmit={sendOffer}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '30px',
          background: '#1e293b',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          maxWidth: 500,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Player</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Team</option>
          {myTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={termEnd}
          onChange={(e) => setTermEnd(e.target.value)}
          className="form-input"
          required
        />

        <input
          type="number"
          placeholder="Buyout Amount (optional)"
          value={buyout}
          onChange={(e) => setBuyout(e.target.value)}
          className="form-input"
        />

        <button type="submit" className="form-button">
          Send Offer
        </button>

        {msg && <p style={{ marginTop: '10px', color: msg.includes('successfully') ? '#34d399' : '#f87171' }}>{msg}</p>}
      </form>
    </div>
  );
}

export default OwnerSendContract;

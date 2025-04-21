import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const MAX_ROSTER_SIZE = 6; // Max players per team

function TeamCreation() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teams, setTeams] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [playerGamertag, setPlayerGamertag] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTeams();
    }
  }, [userId]);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*').eq('owner_id', userId);
    if (error) {
      console.error('Error fetching teams:', error.message);
    } else {
      setTeams(data);
    }
  };

  const fetchPlayers = async (teamId) => {
    const { data, error } = await supabase.from('players').select('*').eq('team_id', teamId);
    if (error) {
      console.error('Error fetching players:', error.message);
    } else {
      setPlayers(data);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Team name is required');
      return;
    }

    const { error } = await supabase.from('teams').insert([{ name, description, owner_id: userId }]);

    if (error) {
      setError(error.message);
    } else {
      setName('');
      setDescription('');
      fetchTeams(); // Refresh list
      setSuccess('Team created successfully!');
    }
  };

  const handleSelectTeam = (teamId) => {
    setSelectedTeam(teamId);
    fetchPlayers(teamId);
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!playerName.trim()) {
      setError('Player name is required');
      return;
    }

    if (players.length >= MAX_ROSTER_SIZE) {
      setError(`Roster is full. Maximum ${MAX_ROSTER_SIZE} players allowed.`);
      return;
    }

    const { error } = await supabase.from('players').insert([{ 
      team_id: selectedTeam, 
      name: playerName, 
      gamertag: playerGamertag 
    }]);

    if (error) {
      setError(error.message);
    } else {
      setPlayerName('');
      setPlayerGamertag('');
      fetchPlayers(selectedTeam);
      setSuccess('Player added successfully!');
    }
  };

  const handleDeletePlayer = async (playerId) => {
    const { error } = await supabase.from('players').delete().eq('id', playerId);

    if (error) {
      setError('Failed to remove player.');
    } else {
      fetchPlayers(selectedTeam); // Refresh list
      setSuccess('Player removed successfully!');
    }
  };

  return (
    <div style={{ paddingTop: '80px' }}> 
      <h1 className="page-title">Manage Your Teams</h1>

      <form onSubmit={handleCreateTeam} className="form" style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Team Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-button" style={{ backgroundColor: '#0ea5e9' }}>
          Create Team
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      </form>

      <div style={{ marginTop: '40px' }}>
        <h2>My Teams</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {teams.map((team) => (
            <li key={team.id} style={{ marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}>
              <h3>{team.name}</h3>
              <p>{team.description}</p>
              <button 
                onClick={() => handleSelectTeam(team.id)}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Manage Roster
              </button>

              {selectedTeam === team.id && (
                <div style={{ marginTop: '20px' }}>
                  <form onSubmit={handleAddPlayer} className="form">
                    <input
                      type="text"
                      placeholder="Player Name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="GamerTag (optional)"
                      value={playerGamertag}
                      onChange={(e) => setPlayerGamertag(e.target.value)}
                      className="form-input"
                    />
                    <button type="submit" className="form-button" style={{ backgroundColor: '#10b981' }}>
                      Add Player
                    </button>
                  </form>

                  {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                  {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

                  <h4 style={{ marginTop: '20px' }}>Roster</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {players.map((player) => (
                      <li key={player.id} style={{ marginBottom: '10px' }}>
                        {player.name} {player.gamertag && `(${player.gamertag})`}
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          style={{
                            marginLeft: '10px',
                            padding: '4px 8px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TeamCreation;

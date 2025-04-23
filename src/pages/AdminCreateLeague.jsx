import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminCreateLeague() {
  const [name, setName] = useState('');
  const [maxTeams, setMaxTeams] = useState(16);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [newSeasonName, setNewSeasonName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeasons = async () => {
      const { data, error } = await supabase.from('seasons').select('id, name');
      if (error) {
        console.error('Error fetching seasons:', error);
      } else {
        setSeasons(data);
      }
    };

    fetchSeasons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('leagues').insert([
      {
        name,
        max_teams: maxTeams,
        start_date: startDate,
        end_date: endDate,
        season_id: selectedSeason
      }
    ]);

    if (error) {
      alert('Failed to create league.');
      console.error(error);
    } else {
      alert('League created successfully!');
      navigate('/admin');
    }
  };

  const handleCreateSeason = async () => {
    if (!newSeasonName.trim()) {
      alert('Season name cannot be empty.');
      return;
    }

    const { data, error } = await supabase.from('seasons').insert([{ name: newSeasonName }]).select();

    if (error) {
      alert('Failed to create season.');
      console.error(error);
    } else {
      alert('Season created successfully!');
      setSeasons((prevSeasons) => [...prevSeasons, ...data]);
      setNewSeasonName('');
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Create New League</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px', background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
        <input
          type="text"
          placeholder="League Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="number"
          placeholder="Max Teams"
          value={maxTeams}
          onChange={(e) => setMaxTeams(Number(e.target.value))}
          className="form-input"
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-input"
          required
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-input"
          required
        />
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Season</option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>{season.name}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="New Season Name"
            value={newSeasonName}
            onChange={(e) => setNewSeasonName(e.target.value)}
            className="form-input"
          />
          <button type="button" onClick={handleCreateSeason} className="form-button" style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
            Add Season
          </button>
        </div>

        <button type="submit" className="form-button">Create League</button>
      </form>
    </div>
  );
}

export default AdminCreateLeague;

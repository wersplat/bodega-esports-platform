import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminCreateLeague() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxTeams, setMaxTeams] = useState(16);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('leagues').insert([
      {
        name,
        description,
        max_teams: maxTeams,
        start_date: startDate,
        end_date: endDate
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

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">Create New League</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
        <input
          type="text"
          placeholder="League Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

        <button type="submit" className="form-button">Create League</button>
      </form>
    </div>
  );
}

export default AdminCreateLeague;

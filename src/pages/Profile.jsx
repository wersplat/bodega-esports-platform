import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    platform: '',
    gamer_tag: '',
    avatar_url: '',
    positions: '',
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMessage('User not found.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('Error loading profile.');
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-capitalize gamer tag
    if (name === 'gamer_tag') {
      setProfile((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMessage('No user logged in.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        display_name: profile.display_name,
        platform: profile.platform,
        gamer_tag: profile.gamer_tag,
        avatar_url: profile.avatar_url,
        positions: profile.positions,
      })
      .eq('id', user.id);

    if (error) {
      setErrorMessage('Failed to update profile.');
      console.error(error);
    } else {
      setSuccessMessage('Profile updated successfully!');
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  const defaultAvatar = 'https://via.placeholder.com/120?text=Avatar'; // Can replace later

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">My Profile</h1>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img
          src={profile.avatar_url || defaultAvatar}
          alt="Avatar"
          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }}
        />
      </div>

      <form onSubmit={handleSave} className="form" style={{ marginTop: '20px' }}>
        <input
          className="form-input"
          name="username"
          placeholder="Username"
          value={profile.username || ''}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          name="display_name"
          placeholder="Display Name"
          value={profile.display_name || ''}
          onChange={handleChange}
          required
        />
        <select
          className="form-input"
          name="platform"
          value={profile.platform || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Platform</option>
          <option value="Xbox">Xbox</option>
          <option value="PlayStation">PlayStation</option>
        </select>
        <input
          className="form-input"
          name="gamer_tag"
          placeholder="Gamer Tag"
          value={profile.gamer_tag || ''}
          onChange={handleChange}
          required
        />
        <select
          className="form-input"
          name="positions"
          value={profile.positions || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Position</option>
          <option value="PG">Point Guard (PG)</option>
          <option value="SG">Shooting Guard (SG)</option>
          <option value="SF">Small Forward (SF)</option>
          <option value="PF">Power Forward (PF)</option>
          <option value="C">Center (C)</option>
        </select>
        <input
          className="form-input"
          name="avatar_url"
          placeholder="Avatar Image URL"
          value={profile.avatar_url || ''}
          onChange={handleChange}
        />

        <button type="submit" className="form-button" style={{ backgroundColor: '#4ade80', marginTop: '20px' }}>
          Save Profile
        </button>

        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default Profile;

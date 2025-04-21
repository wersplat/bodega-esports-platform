import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      navigate('/'); // Redirect to Login
    }
  };

  return (
    <nav style={{ backgroundColor: '#1f2937', padding: '10px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        Home
      </Link>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
        Dashboard
      </Link>
      <Link to="/leagues" style={{ color: 'white', textDecoration: 'none' }}>
        Leagues
      </Link>
      <Link to="/teams" style={{ color: 'white', textDecoration: 'none' }}>
        Teams
      </Link>
      <Link to="/register-team" style={{ color: 'white', textDecoration: 'none' }}>
        Register Team
      </Link>
      <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>
        Admin
      </Link>
      <button
        onClick={handleLogout}
        style={{
          marginLeft: 'auto',
          padding: '8px 16px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;

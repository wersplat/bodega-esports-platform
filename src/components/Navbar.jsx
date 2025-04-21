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
      navigate('/');
    }
  };

  return (
    <nav
      style={{
        backgroundColor: '#1f2937',
        padding: '12px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      {/* Left side links */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        flexGrow: 1,
        minWidth: '0', // allow shrinking
      }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/leagues" style={{ color: 'white', textDecoration: 'none' }}>Leagues</Link>
        <Link to="/public-bracket" style={{ color: 'white', textDecoration: 'none' }}>Bracket</Link>
        <Link to="/champion" style={{ color: 'white', textDecoration: 'none' }}>Champion</Link>
        <Link to="/matches" style={{ color: 'white', textDecoration: 'none' }}>Matches</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
      </div>

      {/* Right side logout */}
      <div style={{
        marginTop: '8px',
        flexShrink: 0,
      }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

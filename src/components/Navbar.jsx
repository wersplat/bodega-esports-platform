import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsBell from './NotificationsBell';
import { supabase } from '../supabaseClient';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#1f2937', color: '#fff' }}>
      {/* Branding/Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/vite.svg" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Bodega Esports</h1>
      </div>

      {/* Hamburger Menu for Mobile */}
      <button
        onClick={toggleMenu}
        style={{
          display: 'block', // Ensure the hamburger menu is visible
          backgroundColor: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '24px',
          cursor: 'pointer',
        }}
        className="hamburger-menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <div
        style={{
          display: isMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center', // Center the menu items
          gap: '10px',
          position: 'absolute',
          top: '50px',
          left: '50%', // Center horizontally
          transform: 'translateX(-50%)', // Adjust for centering
          backgroundColor: '#1f2937',
          padding: '15px', // Add padding for better spacing
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
        className="nav-links"
      >
        <Link to="/dashboard" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Dashboard</Link>
        <Link to="/leagues" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Leagues</Link>
        <Link to="/matches" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Matches</Link>
        <Link to="/public-bracket" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Bracket</Link>
        <Link to="/champion" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Champion</Link>
        <Link to="/public-matches" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Public Matches</Link>
        <Link to="/submit-stats" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Submit My Stats</Link>
        <Link to="/contracts" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Contracts</Link>
        <Link to="/admin" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Admin Dashboard</Link>
      </div>

      {/* Notifications and Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <NotificationsBell />
        <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;

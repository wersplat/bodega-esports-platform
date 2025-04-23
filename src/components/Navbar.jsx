import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationsBell from './NotificationsBell';
import { supabase } from '../supabaseClient';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#1f2937', color: '#fff' }}>
      {/* Branding/Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/vite.svg" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Bodega Esports</h1>
      </div>

      {/* Hamburger Menu and Notifications Bell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', flex: 1 }}>
        <button
          onClick={toggleMenu}
          style={{
            display: 'block',
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
        <NotificationsBell />
      </div>

      {/* Navigation Links */}
      <div
        style={{
          display: isMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          position: 'absolute',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1f2937',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
        className="nav-links"
      >
        <Link to="/dashboard" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Dashboard</Link>
        <Link to="/profile" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Profile</Link>
        <Link to="/leagues" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Leagues</Link>
        <Link to="/matches" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Matches</Link>
        <Link to="/public-bracket" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Bracket</Link>
        <Link to="/champion" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Champion</Link>
        <Link to="/public-matches" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Public Matches</Link>
        <Link to="/submit-stats" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Submit My Stats</Link>
        <Link to="/contracts" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Contracts</Link>
        <Link to="/admin" className="nav-link" style={{ color: '#fff', textDecoration: 'none', fontSize: '16px', padding: '5px 10px' }}>Admin Dashboard</Link>
        {user && (
          <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

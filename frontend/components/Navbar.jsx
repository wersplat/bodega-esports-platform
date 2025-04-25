import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NotificationsBell from './NotificationsBell';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const logo = "https://drive.google.com/uc?export=view&id=1KcnUumzzRDfmjtgAjttZPPIAFG_vRQLh";

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => setIsMenuOpen(false), [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profile' },
    { label: 'Leagues', path: '/leagues' },
    { label: 'Matches', path: '/matches' },
    { label: 'Bracket', path: '/public-bracket' },
    { label: 'Champion', path: '/champion' },
    { label: 'Public Matches', path: '/public-matches' },
    { label: 'Submit Stats', path: '/submit-stats' },
    { label: 'Contracts', path: '/contracts' },
    { label: 'Admin', path: '/admin' },
  ];

  return (
    <nav className="upa-navbar">
      <div className="upa-navbar-container">
        <Link to="/" className="upa-logo">
          <img src={logo} alt="Logo" />
        </Link>

        <div className="upa-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</div>

        <div className="upa-nav-links">
          {navLinks.map(({ label, path }) => (
            <Link key={label} to={path} className={`upa-nav-link ${location.pathname === path ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
        </div>

        <div className="upa-nav-actions">
          <NotificationsBell />
          {user ? (
            <button onClick={handleLogout} className="upa-logout">Logout</button>
          ) : (
            <Link to="/get-started" className="upa-cta">Get Started</Link>
          )}
        </div>

        {/* Slide-out menu */}
        <div ref={menuRef} className={`upa-slide-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="upa-close" onClick={() => setIsMenuOpen(false)}>×</button>
          {navLinks.map(({ label, path }) => (
            <Link key={label} to={path} className={`upa-nav-link ${location.pathname === path ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="upa-logout">Logout</button>
          ) : (
            <Link to="/get-started" className="upa-cta">Get Started</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

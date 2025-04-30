import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const logo = "hhttps://i0.wp.com/bodegacatsgc.gg/wp-content/uploads/2024/06/CIRCULAR-LOGO-1000-e1717667152868.png?fit=80%2C80&ssl=1";

  // Hardcoded values for development
  const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
  const SUPABASE_ANON_KEY = 'your-anon-key';

  // Updated fetch calls to use hardcoded values
  const fetchUser = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const user = await response.json();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
          {/* <NotificationsBell /> */}
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

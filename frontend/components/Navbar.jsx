/* eslint-env browser */
/* global process */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logError } from '../../utils/logger';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const logo = "https://i0.wp.com/bodegacatsgc.gg/wp-content/uploads/2024/06/CIRCULAR-LOGO-1000-e1717667152868.png?fit=80%2C80&ssl=1";

  // Only use CRA and Next.js env variable prefixes
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchUser = useCallback(async () => {
    try {
      if (
        !API_BASE_URL ||
        (!process.env.REACT_APP_API_KEY && !process.env.NEXT_PUBLIC_API_KEY)
      ) {
        throw new Error('API_BASE_URL or API_KEY is not defined in environment variables.');
      }
      const API_KEY = process.env.REACT_APP_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
      const response = await fetch(`${API_BASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': API_KEY,
          'Authorization': `Bearer ${API_KEY}`, // Replace with a dynamic user token in production
        },
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      logError('Error fetching user:', error);
    }
  }, [API_BASE_URL]);

  const handleLogout = useCallback(async () => {
    try {
      if (
        !API_BASE_URL ||
        (!process.env.REACT_APP_API_KEY && !process.env.NEXT_PUBLIC_API_KEY)
      ) {
        throw new Error('API_BASE_URL or API_KEY is not defined in environment variables.');
      }
      const API_KEY = process.env.REACT_APP_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
      await fetch(`${API_BASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': API_KEY,
          'Authorization': `Bearer ${API_KEY}`, // Replace with a dynamic user token in production
        },
      });
      navigate('/');
    } catch (error) {
      logError('Error logging out:', error);
    }
  }, [API_BASE_URL, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
          {user ? (
            <button onClick={handleLogout} className="upa-logout">Logout</button>
          ) : (
            <Link to="/get-started" className="upa-cta">Get Started</Link>
          )}
        </div>

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
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            Bodega Esports
          </Link>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0 }}>
          <li>
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
          </li>
          <li>
            <Link to="/leagues" style={{ color: '#fff', textDecoration: 'none' }}>Leagues</Link>
          </li>
          <li>
            <Link to="/matches" style={{ color: '#fff', textDecoration: 'none' }}>Matches</Link>
          </li>
          <li>
            <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
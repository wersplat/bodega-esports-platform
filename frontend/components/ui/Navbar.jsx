import React from 'react';
import Link from 'next/link';

function Navbar() {
  return (
    <header style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            Bodega Esports
          </Link>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0 }}>
          <li>
            <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</Link>
          </li>
          <li>
            <Link href="/leagues" style={{ color: '#fff', textDecoration: 'none' }}>Leagues</Link>
          </li>
          <li>
            <Link href="/matches" style={{ color: '#fff', textDecoration: 'none' }}>Matches</Link>
          </li>
          <li>
            <Link href="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface League {
  id: string | number;
  name: string;
  description?: string;
}

const LeagueBrowser: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Available Leagues</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {leagues.map((league) => (
          <li key={league.id} style={{ marginBottom: '20px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.18)' }}>
            <h3>{league.name}</h3>
            <p style={{ color: '#cbd5e1' }}>{league.description}</p>
            <Link href={`/league/${league.id}`} legacyBehavior>
              <button className="form-button" style={{ marginTop: '10px', backgroundColor: '#3b82f6' }}>
                View Registered Teams
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeagueBrowser;

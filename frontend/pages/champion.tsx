import React, { useState, useEffect } from 'react';

interface League {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

const Champion: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [championTeamId, setChampionTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeagues();
    fetchTeams();
  }, []);

  const fetchLeagues = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      // Optionally log or display error
    }
  };

  const fetchTeams = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/teams');
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      // Optionally log or display error
    }
  };

  const detectChampion = async (): Promise<void> => {
    if (!selectedLeague) return;

    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/matches/final-round?league_id=${selectedLeague}`);
      const match = await res.json();

      if (match?.winner_id) {
        setChampionTeamId(match.winner_id);
      } else {
        setChampionTeamId(null);
      }
    } catch (err) {
      // Optionally log or display error
    }
  };

  const getTeamName = (teamId: string): string => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  return (
    <div className="main-content">
      <h1 className="page-title">🏆 Tournament Champion</h1>

      <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', maxWidth: 500, margin: '0 auto' }}>
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="form-input"
          style={{ marginBottom: '20px' }}
        >
          <option value="">Select League</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>

        <button
          onClick={detectChampion}
          className="form-button"
          style={{ backgroundColor: '#16a34a', marginBottom: '20px' }}
        >
          Show Champion
        </button>

        {championTeamId ? (
          <div style={{ marginTop: '20px', padding: '30px', background: '#222b3a', color: '#f8fafc', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.18)' }}>
            <h2 style={{ fontSize: '2rem', color: '#f8fafc' }}>🎉 {getTeamName(championTeamId)} 🎉</h2>
            <p style={{ marginTop: '10px', fontSize: '1.2rem', color: '#cbd5e1' }}>Congratulations, Champion!</p>
          </div>
        ) : (
          <p style={{ marginTop: '20px', color: '#cbd5e1' }}>No champion yet — tournament still ongoing.</p>
        )}
      </div>
    </div>
  );
};

export default Champion;

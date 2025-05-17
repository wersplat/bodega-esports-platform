import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';


import type { NextPage } from 'next';

interface League {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

const AdminScheduleMatch: NextPage = () => {
  const router = useRouter();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [matchDate, setMatchDate] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetchTeams(selectedLeague);
    } else {
      setTeams([]);
    }
  }, [selectedLeague]);

  const fetchLeagues = async (): Promise<void> => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leagues');
      const data = await res.json();
      setLeagues(data);
    } catch (err) {
      // console.error(err);
    }
  };

  const fetchTeams = async (leagueId: string): Promise<void> => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/teams?league_id=${leagueId}`);
      const data = await res.json();
      setTeams(data);
    } catch (err) {
      // console.error(err);
    }
  };

  const handleSchedule = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedLeague || !homeTeam || !awayTeam || !matchDate) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (homeTeam === awayTeam) {
      setErrorMessage('Home and away teams cannot be the same.');
      return;
    }

    try {
      const res = await fetch('https://api.bodegacatsgc.gg/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          league_id: selectedLeague,
          home_team_id: homeTeam,
          away_team_id: awayTeam,
          match_date: matchDate,
          status: 'Scheduled',
        }),
      });

      if (!res.ok) throw new Error('Failed to schedule match');

      setSuccessMessage('Match scheduled successfully!');
      setSelectedLeague('');
      setHomeTeam('');
      setAwayTeam('');
      setMatchDate('');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Admin: Schedule a Match</h1>
      <button onClick={() => router.push('/admin')} className="form-button" style={{ marginBottom: '20px' }}>
         Back to Admin Dashboard
      </button>

      <form onSubmit={handleSchedule} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '30px',
        background: '#1e293b',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Select value={selectedLeague} onValueChange={(value) => setSelectedLeague(value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select League" />
          </SelectTrigger>
          <SelectContent>
            {leagues.map((league) => (
              <SelectItem key={league.id} value={league.id}>{league.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={homeTeam} onValueChange={(value) => setHomeTeam(value)} required disabled={!selectedLeague}>
          <SelectTrigger>
            <SelectValue placeholder="Select Home Team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={awayTeam} onValueChange={(value) => setAwayTeam(value)} required disabled={!selectedLeague}>
          <SelectTrigger>
            <SelectValue placeholder="Select Away Team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="form-input" required />

        <button type="submit" className="form-button">Schedule Match</button>

        {successMessage && <p style={{ color: '#34d399' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: '#f87171' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default AdminScheduleMatch;

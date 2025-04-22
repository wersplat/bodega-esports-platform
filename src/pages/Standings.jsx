// src/pages/Standings.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Standings() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      fetchDivisions();
    }
  }, [selectedSeason]);

  useEffect(() => {
    if (selectedDivision) {
      fetchStandings();
    }
  }, [selectedDivision]);

  const fetchSeasons = async () => {
    const { data, error } = await supabase.from('seasons').select('id, name').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching seasons:', error.message);
    } else {
      setSeasons(data);
      if (data.length > 0) {
        setSelectedSeason(data[0].id); // default to most recent season
      }
    }
  };

  const fetchDivisions = async () => {
    const { data, error } = await supabase
      .from('divisions')
      .select('id, name')
      .eq('season_id', selectedSeason);

    if (error) {
      console.error('Error fetching divisions:', error.message);
    } else {
      setDivisions(data);
      if (data.length > 0) {
        setSelectedDivision(data[0].id); // default to first division
      }
    }
  };

  const fetchStandings = async () => {
    setLoading(true);

    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('division_id', selectedDivision);

    if (teamsError) {
      console.error('Error fetching teams:', teamsError.message);
      setLoading(false);
      return;
    }

    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('winner_team_id, loser_team_id, season_id')
      .eq('season_id', selectedSeason);

    if (matchesError) {
      console.error('Error fetching matches:', matchesError.message);
      setLoading(false);
      return;
    }

    const teamRecords = {};

    teams.forEach(team => {
      teamRecords[team.id] = { name: team.name, wins: 0, losses: 0 };
    });

    matches.forEach(match => {
      if (match.winner_team_id && teamRecords[match.winner_team_id]) {
        teamRecords[match.winner_team_id].wins += 1;
      }
      if (match.loser_team_id && teamRecords[match.loser_team_id]) {
        teamRecords[match.loser_team_id].losses += 1;
      }
    });

    const formattedStandings = Object.values(teamRecords).map(record => ({
      ...record,
      winPct: record.wins + record.losses > 0 ? (record.wins / (record.wins + record.losses)).toFixed(3) : '0.000',
    }));

    formattedStandings.sort((a, b) => parseFloat(b.winPct) - parseFloat(a.winPct));

    setStandings(formattedStandings);
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
      <h1 className="page-title">🏆 Standings</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="form-input"
          style={{ minWidth: '200px' }}
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>

        {divisions.length > 0 && (
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="form-input"
            style={{ minWidth: '200px' }}
          >
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading...</div>
      ) : standings.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No teams recorded yet.</p>
      ) : (
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Team</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Win %</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={index}>
                <td>{team.name}</td>
                <td>{team.wins}</td>
                <td>{team.losses}</td>
                <td>{team.winPct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Standings;

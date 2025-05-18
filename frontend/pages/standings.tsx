import React, { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';

interface Season {
  id: string;
  name: string;
}

interface Division {
  id: string;
  name: string;
}

interface Standing {
  name: string;
  wins: number;
  losses: number;
  winPct: string;
}

import { API_BASE } from '../config';

const Standings: NextPage = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [standings, setStandings] = useState<Record<string, Standing[]>>({});
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasons = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/api/v2/seasons`);
      if (!response.ok) {
        throw new Error('Failed to fetch seasons');
      }
      const data = await response.json();
      setSeasons(data);
      if (data.length > 0 && !selectedSeason) {
        setSelectedSeason(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching seasons:', err);
      setError('Failed to load seasons');
    }
  }, [selectedSeason]);

  const fetchDivisions = useCallback(async (): Promise<void> => {
    if (!selectedSeason) return;
    try {
      const response = await fetch(`${API_BASE}/api/v2/divisions?season_id=${selectedSeason}`);
      if (!response.ok) {
        throw new Error('Failed to fetch divisions');
      }
      const data = await response.json();
      setDivisions(data);
      if (data.length > 0 && !selectedDivision) {
        setSelectedDivision(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching divisions:', err);
      setError('Failed to load divisions');
    }
  }, [selectedSeason, selectedDivision]);

  const fetchStandings = useCallback(async (): Promise<void> => {
    if (!selectedSeason || !selectedDivision) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/v2/standings?season_id=${selectedSeason}&division_id=${selectedDivision}`);
      if (!response.ok) {
        throw new Error('Failed to fetch standings');
      }
      const data = await response.json();
      // Transform data to match the expected format
      const formattedStandings = data.map((team: any) => ({
        name: team.team_name,
        wins: team.wins || 0,
        losses: team.losses || 0,
        winPct: ((team.wins || 0) / ((team.wins || 0) + (team.losses || 1)) * 100).toFixed(1) + '%',
      }));
      setStandings(prev => ({
        ...prev,
        [selectedDivision]: formattedStandings,
      }));
    } catch (err) {
      console.error('Error fetching standings:', err);
      setError('Failed to load standings');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSeason, selectedDivision]);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  useEffect(() => {
    if (selectedSeason) {
      fetchDivisions();
    }
  }, [selectedSeason, fetchDivisions]);

  useEffect(() => {
    if (selectedSeason && selectedDivision) {
      fetchStandings();
    }
  }, [selectedSeason, selectedDivision, fetchStandings]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedSeason(e.target.value);
    setSelectedDivision('');
    setStandings({});
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedDivision(e.target.value);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const currentStandings = selectedDivision ? standings[selectedDivision] || [] : [];
  const selectedDivisionName = divisions.find(d => d.id === selectedDivision)?.name || 'Division';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">League Standings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <select
              id="season"
              value={selectedSeason}
              onChange={handleSeasonChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="">Select a season</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/2">
            <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
              Division
            </label>
            <select
              id="division"
              value={selectedDivision}
              onChange={handleDivisionChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isLoading || !selectedSeason}
            >
              <option value="">Select a division</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : currentStandings.length > 0 ? (
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">{selectedDivisionName} Standings</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    W
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    L
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStandings.map((team, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {team.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.wins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.losses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.winPct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : selectedDivision ? (
          <div className="text-center py-8 text-gray-500">
            No standings data available for the selected division.
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select a season and division to view standings.
          </div>
        )}
      </div>
    </div>
  );
};

export default Standings;

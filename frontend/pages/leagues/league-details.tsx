import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import type { League, Registration } from '@/types/league';

function LeagueDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [league, setLeague] = useState<League | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeague = useCallback(async () => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/leagues/${id}`);
      if (!res.ok) throw new Error('Failed to fetch league');
      const data = await res.json();
      setLeague(data);
    } catch (err) {

      toast.error('Failed to fetch league details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch(`https://api.bodegacatsgc.gg/registrations?league_id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch registrations');
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      setError('Failed to fetch registrations');
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchLeague(), fetchRegistrations()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch league data');
        toast.error('Failed to fetch league data');
      }
    };

    fetchData();
  }, [fetchLeague, fetchRegistrations, id]);

  if (loading) {
    return (
      <div className="main-content">
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1em' }}>{error}</div>}
        Loading...
      </div>
    );
  }

  return (
    <div className="main-content">
      {league ? (
        <>
          <h1 className="page-title">{league.name}</h1>
          <p style={{ color: '#cbd5e1' }}>{league.description}</p>

          <h2 style={{ marginTop: '30px', color: '#f8fafc' }}>Registered Teams</h2>

          {registrations.length === 0 ? (
            <p style={{ color: '#cbd5e1' }}>No teams registered yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {registrations.map((reg) => (
                <li key={reg.id} style={{ marginBottom: '30px', background: '#222b3a', color: '#f8fafc', padding: '20px', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.25)' }}>
                  <h3>{reg.team.name}</h3>
{/* Description and players removed: not present in Registration type */}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="main-content">Loading league...</div>
      )}
    </div>
  );
}

export default LeagueDetails;

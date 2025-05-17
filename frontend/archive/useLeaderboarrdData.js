// Archived original JS hook. See useLeaderboarrdData.ts for the TypeScript version.

import { useState, useEffect } from 'react';

export default function useLeaderboarrdData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/leaderboard');
      const json = await res.json();
      setData(json);
    } catch (e) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return { data, loading };
}

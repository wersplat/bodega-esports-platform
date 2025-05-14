import { useState, useEffect } from "react";
import axios from "axios";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const API_BASE = publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL;  // 🛠 Updated to use Next.js runtime config

export default function useLeaderboardData(seasonId = 1, sort = "ppg", minGames = 5) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seasonId) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/api/v2/stats/leaderboard`, {
        params: { season_id: seasonId, sort_by: sort, min_games: minGames }
      })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [seasonId, sort, minGames]); // 🛠 Removed API_BASE from dependencies

  return { data, loading };
}

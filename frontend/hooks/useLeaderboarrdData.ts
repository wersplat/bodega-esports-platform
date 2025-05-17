import { useState, useEffect } from "react";
import axios from "axios";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const API_BASE: string | undefined = publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL;

interface LeaderboardEntry {
  // Define properties based on expected API response
  [key: string]: any;
}

export default function useLeaderboardData(
  seasonId: number = 1,
  sort: string = "ppg",
  minGames: number = 5
): { data: LeaderboardEntry[]; loading: boolean } {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!seasonId) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/api/v2/stats/leaderboard`, {
        params: { season_id: seasonId, sort_by: sort, min_games: minGames }
      })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [seasonId, sort, minGames]);

  return { data, loading };
}

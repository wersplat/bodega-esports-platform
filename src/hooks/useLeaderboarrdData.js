import { useState, useEffect } from "react";
import axios from "axios";

export default function useLeaderboardData(seasonId = 1, sort = "ppg", minGames = 5) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seasonId) return;

    setLoading(true);
    axios
      .get(`/api/leaderboard`, {
        params: { season_id: seasonId, sort_by: sort, min_games: minGames }
      })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [seasonId, sort, minGames]);

  return { data, loading };
}

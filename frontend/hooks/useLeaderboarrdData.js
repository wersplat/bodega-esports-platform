import { useState, useEffect } from "react";
import axios from "axios";

export default function useLeaderboardData(seasonId = 1, sort = "ppg", minGames = 5) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;  // 🛠 Add this line

  useEffect(() => {
    if (!seasonId) return;

    setLoading(true);
    axios
      .get(`${API_BASE}/api/leaderboard`, {    // 🛠 Fix here
        params: { season_id: seasonId, sort_by: sort, min_games: minGames }
      })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [seasonId, sort, minGames]);

  return { data, loading };
}

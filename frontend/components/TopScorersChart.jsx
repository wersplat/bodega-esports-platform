import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TopScorersChart({ seasonId }) {
  const [chartData, setChartData] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;  // 🛠 Add base url

  useEffect(() => {
    if (!seasonId) return;
    axios
      .get(`${API_BASE}/api/stats/top-scorers?season_id=${seasonId}`)  // 🛠 Fix here
      .then((res) => {
        const labels = res.data.map((p) => p.username);
        const data = res.data.map((p) => p.avg_points);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Avg Points',
              data,
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
          ]
        });
      })
      .catch((err) => console.error('Chart fetch error:', err));
  }, [seasonId]);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Top Scorers'
            }
          }
        }}
      />
    </div>
  );
}

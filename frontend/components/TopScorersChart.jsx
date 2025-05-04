/* eslint-env node */
/* eslint-env browser */
/* global process */

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { logError } from '../../utils/logger';

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
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ''; // Use process.env for Next.js public environment variables

  useEffect(() => {
    if (!seasonId) return;
    axios
      .get(`${API_BASE}/api/stats/top-scorers?season_id=${seasonId}`) // 🛠 Fix here
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
      .catch((err) => logError('Chart fetch error:', err));
  }, [seasonId, API_BASE]); // Include API_BASE in the dependency array

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

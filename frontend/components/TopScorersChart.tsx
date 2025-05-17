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
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopScorer {
  username: string;
  avg_points: number;
}

interface TopScorersChartProps {
  seasonId: string;
}

const TopScorersChart: React.FC<TopScorersChartProps> = ({ seasonId }) => {
  const [chartData, setChartData] = useState<ChartData<'bar'> | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  useEffect(() => {
    if (!seasonId) return;
    axios
      .get(`${API_BASE}/api/stats/top-scorers?season_id=${seasonId}`)
      .then((res) => {
        const labels = res.data.map((p: TopScorer) => p.username);
        const data = res.data.map((p: TopScorer) => p.avg_points);

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
      });
      // Add additional error handling logic here if needed
  }, [seasonId, API_BASE]);

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
};

export default TopScorersChart;

import { getLeaderboard } from '@/lib/api';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function LeaderboardPage() {
  const leaderboardData = await getLeaderboard();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      <LeaderboardTable data={leaderboardData} />
    </div>
  );
}

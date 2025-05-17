import type { Player } from '@/lib/api/types';

interface PlayerProfileProps {
  player: Player;
}

interface StatCardProps {
  label: string;
  value: string;
}

export function PlayerProfile({ player }: PlayerProfileProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-32 w-32 rounded-full mx-auto md:mx-0 md:mr-6"
            src={`/img/avatars/${player.id}.jpg`}
            alt={player.name}
          />
        </div>
        <div className="mt-4 md:mt-0 md:ml-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {player.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{player.teamName}</p>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rank</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                #{player.rank}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Points
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {player.points.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Record
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {player.wins}-{player.losses} ({player.winRate}%)
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {player.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="KDA" value={player.stats.kda.toFixed(2)} />
          <StatCard label="Kills" value={player.stats.kills.toLocaleString()} />
          <StatCard label="Deaths" value={player.stats.deaths.toLocaleString()} />
          <StatCard
            label="Assists"
            value={player.stats.assists.toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

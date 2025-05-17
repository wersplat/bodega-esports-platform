import React from 'react';

interface MvpCardProps {
  name: string;
  team: string;
  statLine: string;
}

export default function MvpCard({ name, team, statLine }: MvpCardProps) {
  return (
    <div className="bg-[#1e293b] text-[#f8fafc] p-4 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-sm text-[#94a3b8]">Team: {team}</p>
      <p className="mt-2 text-lg">{statLine}</p>
    </div>
  );
}

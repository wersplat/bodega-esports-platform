import fetch from 'node-fetch';

export async function fetchRoster(teamName: string) {
  const res = await fetch(`${process.env.API_URL}/teams/${encodeURIComponent(teamName)}/roster`);
  if (!res.ok) throw new Error('Team not found');
  return res.json();
}

import { useEffect, useState, FormEvent } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Player {
  id: string;
  username: string;
}
interface Team {
  id: string;
  name: string;
}

const OwnerSendContract: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [termEnd, setTermEnd] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async (): Promise<void> => {
    const res = await fetch('https://api.bodegacatsgc.gg/profiles');
    const data = await res.json();
    setPlayers(data);
  };

  const fetchTeams = async (): Promise<void> => {
    const res = await fetch('https://api.bodegacatsgc.gg/teams/mine');
    const data = await res.json();
    setTeams(data);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.bodegacatsgc.gg/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: selectedTeam,
          player_id: selectedPlayer,
          term_end: termEnd,
        }),
      });
      if (!res.ok) throw new Error('Failed to send contract');
      setMessage('Contract offer sent!');
    } catch {
      setMessage('Failed to send.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#f8fafc] mb-2">Send Contract Offer</h1>
          <p className="text-[#94a3b8] mb-4">Invite a player to your team</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label htmlFor="player" className="block text-sm font-medium text-[#f8fafc] mb-1">Player</label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer} required>
              <SelectTrigger id="player" className="w-full">
                <SelectValue placeholder="Select Player" />
              </SelectTrigger>
              <SelectContent>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-[#f8fafc] mb-1">Your Team</label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam} required>
              <SelectTrigger id="team" className="w-full">
                <SelectValue placeholder="Select Your Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="termEnd" className="block text-sm font-medium text-[#f8fafc] mb-1">Contract End Date</label>
            <Input id="termEnd" type="date" value={termEnd} onChange={e => setTermEnd(e.target.value)} required className="w-full" />
          </div>
          <Button type="submit" className="w-full bg-[#e11d48] text-[#f8fafc] hover:bg-[#be123c] transition-all duration-200">Send Offer</Button>
          {message && <p className={`mt-2 text-center text-sm ${message.includes('sent') ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default OwnerSendContract;

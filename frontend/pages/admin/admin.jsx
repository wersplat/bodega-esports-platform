
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from '../../components/card';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/table';
import { Check, Save, Settings, X } from 'lucide-react';

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://api.bodegacatsgc.gg/profile/me");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        if (!data.is_admin) throw new Error("Access denied");
        setIsAdmin(true);
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="main-content" style={{ color: '#f8fafc', background: 'transparent' }}>
      <h1 className="page-title">Admin Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-[#0f172a] rounded-full p-3 mb-4">
              <Settings className="h-6 w-6 text-[#e11d48]" />
            </div>
            <h3 className="font-medium">Teams</h3>
            <p className="text-3xl font-bold my-2">12</p>
            <p className="text-sm text-[#94a3b8]">Active teams in the league</p>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-[#0f172a] rounded-full p-3 mb-4">
              <Settings className="h-6 w-6 text-[#e11d48]" />
            </div>
            <h3 className="font-medium">Players</h3>
            <p className="text-3xl font-bold my-2">86</p>
            <p className="text-sm text-[#94a3b8]">Registered players</p>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-[#0f172a] rounded-full p-3 mb-4">
              <Settings className="h-6 w-6 text-[#e11d48]" />
            </div>
            <h3 className="font-medium">Matches</h3>
            <p className="text-3xl font-bold my-2">24</p>
            <p className="text-sm text-[#94a3b8]">Scheduled matches</p>
          </div>
        </Card>
        <Card>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-[#0f172a] rounded-full p-3 mb-4">
              <Settings className="h-6 w-6 text-[#e11d48]" />
            </div>
            <h3 className="font-medium">Prize Pool</h3>
            <p className="text-3xl font-bold my-2">$25,000</p>
            <p className="text-sm text-[#94a3b8]">Total prize money</p>
          </div>
        </Card>
      </div>

      {/* Team Approvals Table */}
      <Card title="Team Approvals" description="Review and approve team registrations">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Captain</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: 1,
                  name: "Team Omega",
                  captain: "Alex Johnson",
                  division: "East",
                  players: 8,
                  date: "May 10, 2023",
                },
                {
                  id: 2,
                  name: "Phoenix Rising",
                  captain: "Sarah Miller",
                  division: "West",
                  players: 7,
                  date: "May 11, 2023",
                },
                {
                  id: 3,
                  name: "Thunderbolts",
                  captain: "Mike Wilson",
                  division: "East",
                  players: 9,
                  date: "May 12, 2023",
                },
              ].map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.captain}</TableCell>
                  <TableCell>{team.division}</TableCell>
                  <TableCell>{team.players}</TableCell>
                  <TableCell>{team.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-green-500">
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-[#e11d48]">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* League Settings and Webhook Management */}
      <div className="grid gap-6 md:grid-cols-2 my-8">
        <Card title="League Settings" description="Configure league parameters">
          <div className="p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Season Name</label>
                <Input defaultValue="Road to $25K 2023" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Season Start Date</label>
                <Input type="date" defaultValue="2023-05-01" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Season End Date</label>
                <Input type="date" defaultValue="2023-08-31" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Registration Deadline</label>
                <Input type="date" defaultValue="2023-04-15" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Teams</label>
                <Input type="number" defaultValue="16" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Players Per Team</label>
                <Input type="number" defaultValue="12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Game Duration (minutes)</label>
                <Input type="number" defaultValue="40" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Divisions</label>
                <Input defaultValue="East, West, North, South" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </div>
        </Card>
        <Card title="Webhook Management" description="Configure external integrations">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Discord Webhook URL</label>
              <Input defaultValue="https://discord.com/api/webhooks/123456789/abcdef" />
              <p className="text-xs text-[#94a3b8]">Notifications will be sent to this Discord channel</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook Events</label>
              <div className="space-y-2">
                {[
                  "New team registration",
                  "Match scheduled",
                  "Match results submitted",
                  "Player stats updated",
                  "Team approval status changed",
                ].map((event, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`event-${index}`}
                      defaultChecked={index < 3}
                      className="h-4 w-4 rounded border-[#94a3b8] bg-[#1e293b] text-[#e11d48] focus:ring-[#e11d48]"
                    />
                    <label htmlFor={`event-${index}`} className="text-sm">
                      {event}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Webhook</label>
              <div className="flex gap-2">
                <select className="h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
                  <option>New team registration</option>
                  <option>Match scheduled</option>
                  <option>Match results submitted</option>
                </select>
                <Button variant="outline">Send Test</Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Save Webhook Settings</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Manual Stat Override */}
      <Card title="Manual Stat Override" description="Manually adjust player statistics">
        <div className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Player</label>
              <select className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
                <option>Select Player</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Mike Johnson</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Match</label>
              <select className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
                <option>Select Match</option>
                <option>Team Alpha vs Team Beta - May 10, 2023</option>
                <option>Team Gamma vs Team Alpha - May 5, 2023</option>
                <option>Team Alpha vs Team Delta - April 28, 2023</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stat Type</label>
              <select className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
                <option>Points</option>
                <option>Assists</option>
                <option>Rebounds</option>
                <option>Steals</option>
                <option>Blocks</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Value</label>
              <Input type="number" defaultValue="18" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Value</label>
              <Input type="number" defaultValue="22" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Change</label>
            <textarea
              rows={3}
              placeholder="Explain why this stat is being adjusted..."
              className="w-full rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Update Stats</Button>
          </div>
        </div>
      </Card>

      {/* Admin Activity Log */}
      <Card title="Admin Activity Log" description="Recent administrative actions">
        <div className="p-4 divide-y divide-[#0f172a]">
          {[
            { action: "Approved team registration", admin: "Admin User", date: "May 12, 2023 • 14:32" },
            { action: "Updated league settings", admin: "Admin User", date: "May 11, 2023 • 10:15" },
            { action: "Manually adjusted player stats", admin: "Admin User", date: "May 10, 2023 • 16:45" },
            { action: "Added new division", admin: "Admin User", date: "May 9, 2023 • 09:20" },
            { action: "Rejected team registration", admin: "Admin User", date: "May 8, 2023 • 11:05" },
          ].map((log, index) => (
            <div key={index} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{log.action}</p>
                <p className="text-sm text-[#94a3b8]">
                  By {log.admin} • {log.date}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
// Refactored from bodega-esport2.0/app/admin/page.tsx
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Save, Settings, X } from "lucide-react";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const BodegaAdminPanel: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (!token) throw new Error('No access token');
        const res = await fetch("/auth-service/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        if (!data.is_admin) throw new Error("Access denied");
        setIsAdmin(true);
      } catch (error) {
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-[#94a3b8]">Manage league settings and operations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Global Settings
          </Button>
        </div>
      </div>

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
      <Card>
  <CardHeader>
    <CardTitle>Team Approvals</CardTitle>
    <CardDescription>Review and approve team registrations</CardDescription>
  </CardHeader>
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
        <Card>
  <CardHeader>
    <CardTitle>League Settings</CardTitle>
    <CardDescription>Configure league parameters</CardDescription>
  </CardHeader>
          <div className="p-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Season Name</Label>
                <Input defaultValue="Road to $25K 2023" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Season Start Date</Label>
                <Input type="date" defaultValue="2023-05-01" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Season End Date</Label>
                <Input type="date" defaultValue="2023-08-31" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Registration Deadline</Label>
                <Input type="date" defaultValue="2023-04-15" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Teams</Label>
                <Input type="number" defaultValue="16" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Players Per Team</Label>
                <Input type="number" defaultValue="12" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Game Duration (minutes)</Label>
                <Input type="number" defaultValue="40" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Divisions</Label>
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
        <Card>
  <CardHeader>
    <CardTitle>Webhook Management</CardTitle>
    <CardDescription>Configure webhooks for league events</CardDescription>
  </CardHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Webhook URL</Label>
              <Input placeholder="https://example.com/webhook" />
            </div>
            <div className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Webhook
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Stat Adjustments */}
      <Card>
  <CardHeader>
    <CardTitle>Stat Adjustments</CardTitle>
    <CardDescription>Manually adjust player stats</CardDescription>
  </CardHeader>
        <div className="p-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Player</Label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Match</Label>
              <Select>
                <SelectTrigger className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
                  <SelectValue placeholder="Select match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team Alpha vs Team Beta - May 10, 2023">Team Alpha vs Team Beta - May 10, 2023</SelectItem>
                  <SelectItem value="Team Gamma vs Team Alpha - May 5, 2023">Team Gamma vs Team Alpha - May 5, 2023</SelectItem>
                  <SelectItem value="Team Alpha vs Team Delta - April 28, 2023">Team Alpha vs Team Delta - April 28, 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Stat Type</Label>
              <Select>
                <SelectTrigger className="w-full h-10 rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]">
                  <SelectValue placeholder="Select stat type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Points">Points</SelectItem>
                  <SelectItem value="Assists">Assists</SelectItem>
                  <SelectItem value="Rebounds">Rebounds</SelectItem>
                  <SelectItem value="Steals">Steals</SelectItem>
                  <SelectItem value="Blocks">Blocks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Current Value</Label>
              <Input type="number" defaultValue="18" disabled />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">New Value</Label>
              <Input type="number" defaultValue="22" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Reason for Change</Label>
            <Textarea
              rows={3}
              placeholder="Explain why this stat is being adjusted..."
              className="w-full rounded-md border border-[#0f172a] bg-[#1e293b] px-3 py-2 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
            ></Textarea>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Update Stats</Button>
          </div>
        </div>
      </Card>

      {/* Admin Activity Log */}
      <Card>
  <CardHeader>
    <CardTitle>Admin Activity Log</CardTitle>
    <CardDescription>Recent administrative actions</CardDescription>
  </CardHeader>
        <div className="p-4 divide-y divide-[#0f172a]">
          {[
            { action: "Approved team registration", admin: "Admin User", date: "May 12, 2023 9 14:32" },
            { action: "Updated league settings", admin: "Admin User", date: "May 11, 2023 9 10:15" },
            { action: "Manually adjusted player stats", admin: "Admin User", date: "May 10, 2023 9 16:45" },
            { action: "Added new division", admin: "Admin User", date: "May 9, 2023 9 09:20" },
            { action: "Rejected team registration", admin: "Admin User", date: "May 8, 2023 9 11:05" },
          ].map((log, index) => (
            <div key={index} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{log.action}</p>
                <p className="text-sm text-[#94a3b8]">
                  By {log.admin} 9 {log.date}
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
};

export default BodegaAdminPanel;

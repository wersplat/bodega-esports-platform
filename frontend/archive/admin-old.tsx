import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';






import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SidebarLayoutWrapper from "@/components/SidebarLayoutWrapper";

interface Team {
  id: string;
  name: string;
  captain: string;
  division: string;
  players: string[];
}

interface Match {
  id: string;
  league_id: string;
  round: number;
  team1_id: string;
  team2_id: string;
  winner_id?: string;
}

interface League {
  id: string;
  name: string;
}

const Admin: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://api.bodegacatsgc.gg/auth/me");
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
      <h1 className="page-title">Admin Dashboard</h1>
      {/* Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* ...cards... */}
      </div>
      {/* Team Approvals Table */}
      <Card>
  <CardHeader>
    <CardTitle>Team Approvals</CardTitle>
    <CardDescription>Review and approve team registrations</CardDescription>
  </CardHeader>
        {/* ...table content... */}
      </Card>
      {/* Stat Adjustments */}
      <Card>
  <CardHeader>
    <CardTitle>Stat Adjustments</CardTitle>
    <CardDescription>Manually adjust player stats</CardDescription>
  </CardHeader>
        {/* ...stat adjustment content... */}
      </Card>
      {/* Admin Activity Log */}
      <Card>
  <CardHeader>
    <CardTitle>Admin Activity Log</CardTitle>
    <CardDescription>Recent administrative actions</CardDescription>
  </CardHeader>
        {/* ...activity log content... */}
      </Card>
    </div>
  );
};

export default Admin;

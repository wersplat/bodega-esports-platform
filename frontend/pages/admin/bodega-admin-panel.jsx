// Refactored from bodega-esport2.0/app/admin/page.tsx
import { Card } from "../../components/card";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/table";
import { Check, Save, Settings, X } from "lucide-react";

export default function BodegaAdminPanel() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Cards for Teams, Players, Matches, Prize Pool */}
        {/* ... (copy the card JSX from the original) ... */}
      </div>

      {/* Team Approvals Table */}
      {/* ... (copy the table JSX from the original) ... */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* League Settings and Webhook Management */}
        {/* ... (copy the settings and webhook JSX from the original) ... */}
      </div>

      {/* Manual Stat Override */}
      {/* ... (copy the manual stat override JSX from the original) ... */}

      {/* Admin Activity Log */}
      {/* ... (copy the activity log JSX from the original) ... */}
    </div>
  );
}

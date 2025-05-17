import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import React from 'react';

interface Team {
  id: number;
  name: string;
  captain: string;
  division: string;
  players: number;
  date: string;
}

export default function TeamApprovalTable() {
  const teams: Team[] = [
    { id: 1, name: "Team Omega", captain: "Alex Johnson", division: "East", players: 8, date: "May 10, 2023" },
    { id: 2, name: "Phoenix Rising", captain: "Sarah Miller", division: "West", players: 7, date: "May 11, 2023" },
    { id: 3, name: "Thunderbolts", captain: "Mike Wilson", division: "East", players: 9, date: "May 12, 2023" }
  ];

  return (
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
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.captain}</TableCell>
                <TableCell>{team.division}</TableCell>
                <TableCell>{team.players}</TableCell>
                <TableCell>{team.date}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-green-500">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-[#e11d48]">
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

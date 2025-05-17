import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import React from 'react';

export default function LeagueSettingsForm() {
  const fields: Array<[string, string, string]> = [
    ["Season Name", "Road to $25K 2023", "text"],
    ["Season Start Date", "2023-05-01", "date"],
    ["Season End Date", "2023-08-31", "date"],
    ["Registration Deadline", "2023-04-15", "date"],
    ["Max Teams", "16", "number"],
    ["Max Players Per Team", "12", "number"],
    ["Game Duration (minutes)", "40", "number"],
    ["Divisions", "East, West, North, South", "text"]
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>League Settings</CardTitle>
        <CardDescription>Configure league parameters</CardDescription>
      </CardHeader>
      <div className="p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([label, value, type], idx) => (
            <div key={idx} className="space-y-2">
              <Label className="text-sm font-medium">{label}</Label>
              <Input defaultValue={value} type={type} />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}

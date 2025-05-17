import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React from 'react';

const events = [
  "New team registration",
  "Match scheduled",
  "Match results submitted",
  "Player stats updated",
  "Team approval status changed"
];

const WebhookManager: React.FC = () => {
  return (
    <Card>
  <CardHeader>
    <CardTitle>Webhook Management</CardTitle>
    <CardDescription>Configure external integrations</CardDescription>
  </CardHeader>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Discord Webhook URL</Label>
          <Input defaultValue="https://discord.com/api/webhooks/123456789/abcdef" />
          <p className="text-xs text-[#94a3b8]">Notifications will be sent to this Discord channel</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Webhook Events</Label>
          {events.map((event, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox id={`event-${index}`} defaultChecked={index < 3} />
              <Label htmlFor={`event-${index}`} className="text-sm">{event}</Label>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Test Webhook</Label>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
                <SelectContent>
                  {events.map((event, index) => (
                    <SelectItem key={index} value={event}>{event}</SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
            <Button variant="outline">Send Test</Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Save Webhook Settings</Button>
        </div>
      </div>
    </Card>
  );
};

export default WebhookManager;

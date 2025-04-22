
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PostgresConfigSection } from "./PostgresConfigSection";

export function GeneralSettingsSection() {
  return (
    <>
      <PostgresConfigSection />
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general dashboard settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Dashboard Name</Label>
              <Input 
                type="text" 
                placeholder="Dashboard Name" 
                defaultValue="Tyk API Gateway Dashboard" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <select className="w-full h-10 px-3 py-2 border border-input rounded-md">
                  <option>(UTC+00:00) UTC</option>
                  <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option>(UTC-06:00) Central Time (US & Canada)</option>
                  <option>(UTC-07:00) Mountain Time (US & Canada)</option>
                  <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                  <option>(UTC+01:00) Central European Time</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Date Format</Label>
                <select className="w-full h-10 px-3 py-2 border border-input rounded-md">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Refresh Dashboard</Label>
                <p className="text-sm text-muted-foreground">Automatically refresh data every 5 minutes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset</Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

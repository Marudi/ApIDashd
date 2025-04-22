
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function SecuritySettingsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage dashboard security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Access Control</Label>
              <p className="text-sm text-muted-foreground">Configure access control settings</p>
            </div>
          </div>
          
          <div className="space-y-4 pl-6 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
              </div>
              <select className="w-48 h-9 px-3 py-1 border border-input rounded-md">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>8 hours</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>IP Whitelisting</Label>
                <p className="text-sm text-muted-foreground">Restrict dashboard access to specific IPs</p>
              </div>
              <Button variant="outline" size="sm">
                <Shield className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
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
  );
}

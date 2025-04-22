
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function NotificationsSettingsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure system notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Notifications</Label>
            <div className="space-y-2 pl-6 border-l-2 border-muted">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Recipients</Label>
                  <p className="text-sm text-muted-foreground">Recipients for system notifications</p>
                </div>
              </div>
              <Input 
                type="text" 
                placeholder="admin@example.com, alerts@example.com" 
                defaultValue="admin@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <Label>Alert Configuration</Label>
            <div className="space-y-4 pl-6 border-l-2 border-muted">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Gateway Status Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when gateway status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High CPU Usage Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when CPU usage exceeds threshold</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <select className="w-24 h-9 px-2 py-1 border border-input rounded-md">
                    <option>75%</option>
                    <option>80%</option>
                    <option>90%</option>
                    <option>95%</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Error Rate Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when API error rate exceeds threshold</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <select className="w-24 h-9 px-2 py-1 border border-input rounded-md">
                    <option>5%</option>
                    <option>10%</option>
                    <option>15%</option>
                    <option>20%</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>API Key Expiry Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert before API keys expire</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <select className="w-24 h-9 px-2 py-1 border border-input rounded-md">
                    <option>1 day</option>
                    <option>3 days</option>
                    <option>7 days</option>
                    <option>14 days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center p-4 border rounded-md bg-primary/5">
          <MailCheck className="h-10 w-10 text-primary mr-4" />
          <div>
            <h4 className="font-medium">Test Notification Settings</h4>
            <p className="text-sm text-muted-foreground">Send a test notification to verify your settings</p>
          </div>
          <Button className="ml-auto" variant="outline">
            Send Test
          </Button>
        </div>
        
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

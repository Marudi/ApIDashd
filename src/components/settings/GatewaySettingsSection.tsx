
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function GatewaySettingsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gateway Configuration</CardTitle>
        <CardDescription>Configure Tyk API Gateway settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Gateway URL</Label>
            <div className="flex gap-2">
              <Input 
                type="url" 
                placeholder="https://gateway.example.com" 
                defaultValue="https://gateway.example.com"
                className="flex-1"
              />
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Gateway Secret</Label>
            <Input 
              type="password" 
              placeholder="Gateway Secret" 
              defaultValue="••••••••••••••••"
            />
            <p className="text-xs text-muted-foreground">Secret used to authenticate with the Gateway</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics Retention</Label>
                <p className="text-sm text-muted-foreground">How long to keep analytics data</p>
              </div>
              <select className="w-36 h-9 px-3 py-1 border border-input rounded-md">
                <option>7 days</option>
                <option>14 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rate Limit Logging</Label>
                <p className="text-sm text-muted-foreground">Log rate limit events</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Advanced Gateway Settings</Label>
              <p className="text-sm text-muted-foreground">Configure advanced gateway settings</p>
            </div>
          </div>
          
          <div className="space-y-4 pl-6 border-l-2 border-muted">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Health Check Interval</Label>
                <p className="text-sm text-muted-foreground">How often to check gateway health</p>
              </div>
              <select className="w-36 h-9 px-3 py-1 border border-input rounded-md">
                <option>30 seconds</option>
                <option>1 minute</option>
                <option>5 minutes</option>
                <option>15 minutes</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Gateway Debugging</Label>
                <p className="text-sm text-muted-foreground">Enable detailed debug logs</p>
              </div>
              <Switch />
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

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Clock, Database, Globe, Lock, MailCheck, RefreshCw, Save, Server, Shield, User, Sync } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GatewaySync } from "@/components/settings/GatewaySync";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="gateway">Gateway</TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center">
              <Sync className="mr-2 h-4 w-4" />
              Live Sync
            </TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="gateway" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="sync" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GatewaySync type="tyk" />
              <GatewaySync type="kong" />
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

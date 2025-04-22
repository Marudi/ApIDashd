
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Bell, MessageSquare, Save, Slack, Webhook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NotificationType, useNotifications } from "@/services/notificationService";
import { WebhookTester } from "./WebhookTester";
import { useIsMobile } from "@/hooks/use-mobile";

export function WebhookSettingsSection() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { 
    configureSlack, 
    configureWebhook, 
    enableType, 
    disableType, 
    testSlack, 
    testWebhook 
  } = useNotifications();
  
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [slackChannel, setSlackChannel] = useState("#api-alerts");
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [contentType, setContentType] = useState("application/json");
  const [notifyOn, setNotifyOn] = useState<NotificationType[]>(["error"]);
  const [frequency, setFrequency] = useState("immediate");
  
  // Apply notification types when they change
  useEffect(() => {
    // First disable all
    ["error", "api_change", "rate_limit", "quota", "system"].forEach(type => {
      disableType(type as NotificationType);
    });
    
    // Then enable the selected ones
    notifyOn.forEach(type => {
      enableType(type);
    });
  }, [notifyOn, enableType, disableType]);
  
  // Update Slack config when values change
  useEffect(() => {
    configureSlack({
      enabled: slackEnabled,
      url: slackWebhookUrl,
      channel: slackChannel
    });
  }, [slackEnabled, slackWebhookUrl, slackChannel, configureSlack]);
  
  // Update Webhook config when values change
  useEffect(() => {
    configureWebhook({
      enabled: webhookEnabled,
      url: webhookUrl,
      contentType
    });
  }, [webhookEnabled, webhookUrl, contentType, configureWebhook]);
  
  // Test webhook connection
  const handleTestWebhook = async (type: "slack" | "webhook") => {
    const url = type === "slack" ? slackWebhookUrl : webhookUrl;
    
    if (!url) {
      toast({
        title: "Error",
        description: `Please enter a valid ${type === "slack" ? "Slack webhook" : "webhook"} URL`,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Testing Connection",
      description: `Sending test notification to ${type === "slack" ? "Slack" : "webhook"}...`,
    });
    
    try {
      const success = type === "slack" 
        ? await testSlack()
        : await testWebhook();
      
      if (success) {
        toast({
          title: "Success",
          description: `Successfully sent test notification to ${type === "slack" ? "Slack" : "webhook"}`,
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to send test notification to ${type === "slack" ? "Slack" : "webhook"}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send test notification to ${type === "slack" ? "Slack" : "webhook"}`,
        variant: "destructive",
      });
    }
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real implementation, this would save the settings to the server
    toast({
      title: "Settings Saved",
      description: "Your notification settings have been saved successfully",
    });
  };
  
  // Toggle notification type
  const toggleNotificationType = (type: NotificationType, enabled: boolean) => {
    if (enabled) {
      setNotifyOn(prev => [...prev, type]);
    } else {
      setNotifyOn(prev => prev.filter(item => item !== type));
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Webhook & Notification Settings</CardTitle>
            <CardDescription>Configure webhooks and notifications for system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notification Preferences</Label>
                  <p className="text-sm text-muted-foreground">Choose when to receive notifications</p>
                </div>
              </div>
              
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className={`flex ${isMobile ? "flex-col" : "items-center justify-between"} gap-2`}>
                  <div className="space-y-0.5">
                    <Label>Error Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts on system errors</p>
                  </div>
                  <Switch 
                    checked={notifyOn.includes("error")} 
                    onCheckedChange={(checked) => toggleNotificationType("error", checked)} 
                  />
                </div>
                
                <div className={`flex ${isMobile ? "flex-col" : "items-center justify-between"} gap-2`}>
                  <div className="space-y-0.5">
                    <Label>API Changes</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when APIs are modified</p>
                  </div>
                  <Switch 
                    checked={notifyOn.includes("api_change")} 
                    onCheckedChange={(checked) => toggleNotificationType("api_change", checked)} 
                  />
                </div>
                
                <div className={`flex ${isMobile ? "flex-col" : "items-center justify-between"} gap-2`}>
                  <div className="space-y-0.5">
                    <Label>Rate Limit Exceeded</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when rate limits are exceeded</p>
                  </div>
                  <Switch 
                    checked={notifyOn.includes("rate_limit")} 
                    onCheckedChange={(checked) => toggleNotificationType("rate_limit", checked)} 
                  />
                </div>
                
                <div className={`flex ${isMobile ? "flex-col" : "items-center justify-between"} gap-2`}>
                  <div className="space-y-0.5">
                    <Label>Quota Exceeded</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when quotas are exceeded</p>
                  </div>
                  <Switch 
                    checked={notifyOn.includes("quota")} 
                    onCheckedChange={(checked) => toggleNotificationType("quota", checked)} 
                  />
                </div>
                
                <div className={`flex ${isMobile ? "flex-col" : "items-center justify-between"} gap-2`}>
                  <div className="space-y-0.5">
                    <Label>Notification Frequency</Label>
                    <p className="text-sm text-muted-foreground">How often to send batched notifications</p>
                  </div>
                  <Select 
                    value={frequency} 
                    onValueChange={setFrequency}
                  >
                    <SelectTrigger className={isMobile ? "w-full" : "w-48"}>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center">
                    <Slack className="mr-2 h-5 w-5" />
                    Slack Integration
                  </Label>
                  <p className="text-sm text-muted-foreground">Send notifications to Slack</p>
                </div>
                <Switch 
                  checked={slackEnabled} 
                  onCheckedChange={setSlackEnabled} 
                />
              </div>
              
              {slackEnabled && (
                <div className="space-y-4 pl-6 border-l-2 border-muted">
                  <div className="space-y-2">
                    <Label>Slack Webhook URL</Label>
                    <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
                      <Input 
                        value={slackWebhookUrl} 
                        onChange={(e) => setSlackWebhookUrl(e.target.value)}
                        placeholder="https://hooks.slack.com/services/TXXXXXXXX/BXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={() => handleTestWebhook("slack")}>
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <AlertCircle className="inline h-3 w-3 mr-1" />
                      Create a webhook in Slack and paste the URL here
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <Input 
                      placeholder="#alerts" 
                      value={slackChannel}
                      onChange={(e) => setSlackChannel(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center">
                    <Webhook className="mr-2 h-5 w-5" />
                    Custom Webhook
                  </Label>
                  <p className="text-sm text-muted-foreground">Send notifications to a custom webhook</p>
                </div>
                <Switch 
                  checked={webhookEnabled} 
                  onCheckedChange={setWebhookEnabled} 
                />
              </div>
              
              {webhookEnabled && (
                <div className="space-y-4 pl-6 border-l-2 border-muted">
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
                      <Input 
                        value={webhookUrl} 
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://example.com/webhook"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={() => handleTestWebhook("webhook")}>
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select 
                      value={contentType} 
                      onValueChange={setContentType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="application/json">application/json</SelectItem>
                        <SelectItem value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</SelectItem>
                        <SelectItem value="text/plain">text/plain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Reset</Button>
              <Button onClick={saveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <WebhookTester />
      </div>
    </div>
  );
}

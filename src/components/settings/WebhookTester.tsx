
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { NotificationType, useNotifications } from "@/services/notificationService";

export function WebhookTester() {
  const { toast } = useToast();
  const { notify } = useNotifications();
  const [title, setTitle] = useState("Test Notification");
  const [message, setMessage] = useState("This is a test notification from the API Gateway Dashboard");
  const [type, setType] = useState<NotificationType>("system");
  const [isSending, setIsSending] = useState(false);

  const handleSendTest = async () => {
    if (!title || !message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const success = await notify({
        title,
        message,
        type,
        data: { 
          test: true,
          sentFrom: "webhook-tester" 
        }
      });
      
      if (success) {
        toast({
          title: "Test Sent",
          description: "The notification was sent successfully",
        });
      } else {
        toast({
          title: "Warning",
          description: "Notification sent, but some destinations may have failed",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Notifications</CardTitle>
        <CardDescription>Send a test notification to configured destinations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Notification Type</Label>
          <Select value={type} onValueChange={(val) => setType(val as NotificationType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="api_change">API Change</SelectItem>
              <SelectItem value="rate_limit">Rate Limit</SelectItem>
              <SelectItem value="quota">Quota</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Title</Label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Notification title" 
          />
        </div>
        
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Notification message" 
            rows={3} 
          />
        </div>
        
        <Button 
          onClick={handleSendTest} 
          disabled={isSending}
          className="w-full"
        >
          {isSending ? "Sending..." : "Send Test Notification"}
        </Button>
      </CardContent>
    </Card>
  );
}

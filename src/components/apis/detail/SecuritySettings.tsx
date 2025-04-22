
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield, ShieldCheck, ShieldOff, Settings, Lock } from "lucide-react";
import { ApiDefinition } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface SecuritySettingsProps {
  api: ApiDefinition;
  onConfigureRateLimiting: () => void;
  onConfigureQuota: () => void;
}

const SecuritySettings = ({
  api,
  onConfigureRateLimiting,
  onConfigureQuota
}: SecuritySettingsProps) => {
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showQuotaDialog, setShowQuotaDialog] = useState(false);
  const [tempRateLimit, setTempRateLimit] = useState({
    enabled: api.rateLimit?.enabled || false,
    rate: api.rateLimit?.rate || 100,
    per: api.rateLimit?.per || 60
  });
  const [tempQuota, setTempQuota] = useState({
    enabled: api.quota?.enabled || false,
    max: api.quota?.max || 10000,
    per: api.quota?.per || 86400 // 24 hours in seconds
  });
  const [tempAuthType, setTempAuthType] = useState(api.authType);
  const [applyingChanges, setApplyingChanges] = useState(false);

  const handleAuthTypeChange = () => {
    setApplyingChanges(true);
    
    toast({
      title: "Updating Authentication",
      description: "Applying authentication changes...",
    });
    
    // Simulate API call
    setTimeout(() => {
      setApplyingChanges(false);
      setShowAuthDialog(false);
      
      toast({
        title: "Authentication Updated",
        description: `Authentication type changed to ${tempAuthType}.`,
      });
    }, 1500);
  };

  const handleRateLimitSave = () => {
    setApplyingChanges(true);
    
    toast({
      title: "Updating Rate Limit",
      description: "Applying rate limit changes...",
    });
    
    // Simulate API call
    setTimeout(() => {
      setApplyingChanges(false);
      setShowRateLimitDialog(false);
      
      toast({
        title: "Rate Limit Updated",
        description: tempRateLimit.enabled
          ? `Rate limit set to ${tempRateLimit.rate} requests per ${tempRateLimit.per} seconds.`
          : "Rate limiting has been disabled.",
      });
      
      onConfigureRateLimiting();
    }, 1500);
  };

  const handleQuotaSave = () => {
    setApplyingChanges(true);
    
    toast({
      title: "Updating Quota",
      description: "Applying quota changes...",
    });
    
    // Simulate API call
    setTimeout(() => {
      setApplyingChanges(false);
      setShowQuotaDialog(false);
      
      toast({
        title: "Quota Updated",
        description: tempQuota.enabled
          ? `Quota set to ${tempQuota.max} requests per ${tempQuota.per / 3600} hours.`
          : "Quota has been disabled.",
      });
      
      onConfigureQuota();
    }, 1500);
  };

  const getAuthTypeIcon = (type: string) => {
    switch (type) {
      case "jwt":
        return <ShieldCheck className="h-4 w-4" />;
      case "token":
      case "oauth":
        return <Shield className="h-4 w-4" />;
      case "none":
        return <ShieldOff className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatAuthType = (type: string) => {
    switch (type) {
      case "jwt":
        return "JWT";
      case "token":
        return "API Key";
      case "oauth":
        return "OAuth 2.0";
      case "none":
        return "None";
      default:
        return type;
    }
  };

  const getCorsSettings = () => {
    // This would typically come from the API object in production
    return {
      enabled: true,
      allowedOrigins: ["*"],
      allowedMethods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400
    };
  };

  const getSecurityHeaders = () => {
    // This would typically come from the API object in production
    return {
      enabled: true,
      xFrameOptions: "DENY",
      contentSecurityPolicy: "default-src 'self'",
      xContentTypeOptions: "nosniff",
      strictTransportSecurity: "max-age=31536000; includeSubDomains"
    };
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure authentication, rate limiting, and other security features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Authentication</h3>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                {getAuthTypeIcon(api.authType)}
                <div>
                  <p className="font-medium">Authentication Type</p>
                  <p className="text-sm text-muted-foreground">
                    Current: <Badge variant="outline" className="capitalize ml-1">
                      {formatAuthType(api.authType)}
                    </Badge>
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAuthDialog(true)}>Change</Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Request Controls</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Rate Limiting</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Status: 
                    <Badge variant={api.rateLimit?.enabled ? "default" : "secondary"} className="ml-1">
                      {api.rateLimit?.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    {api.rateLimit?.enabled && (
                      <span className="ml-2">{api.rateLimit.rate} req / {api.rateLimit.per}s</span>
                    )}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowRateLimitDialog(true)}
                >Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Usage Quota</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Status: 
                    <Badge variant={api.quota?.enabled ? "default" : "secondary"} className="ml-1">
                      {api.quota?.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    {api.quota?.enabled && (
                      <span className="ml-2">{api.quota.max} req / {api.quota.per / 3600}h</span>
                    )}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowQuotaDialog(true)}
                >Configure</Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-3">Advanced Security</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">CORS Settings</p>
                  <p className="text-sm text-muted-foreground">
                    {getCorsSettings().enabled ? 
                      `${getCorsSettings().allowedOrigins.join(", ")}` : 
                      "CORS is disabled"
                    }
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toast({
                      title: "CORS Settings",
                      description: "CORS configuration dialog will be implemented in the next release.",
                    });
                  }}
                >Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">Security Headers</p>
                  <p className="text-sm text-muted-foreground">
                    {getSecurityHeaders().enabled ? 
                      "Standard security headers enabled" : 
                      "No security headers configured"
                    }
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Security Headers",
                      description: "Security headers configuration dialog will be implemented in the next release.",
                    });
                  }}
                >Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <p className="font-medium">IP Restrictions</p>
                  <p className="text-sm text-muted-foreground">
                    No IP restrictions configured
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "IP Restrictions",
                      description: "IP restrictions configuration dialog will be implemented in the next release.",
                    });
                  }}
                >Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Authentication</DialogTitle>
            <DialogDescription>
              Choose an authentication method for this API
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Authentication Type</Label>
              <Select value={tempAuthType} onValueChange={setTempAuthType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Authentication</SelectItem>
                  <SelectItem value="token">API Key</SelectItem>
                  <SelectItem value="jwt">JWT</SelectItem>
                  <SelectItem value="oauth">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {tempAuthType === "jwt" && (
              <div className="space-y-2">
                <Label>JWT Secret (generate or paste)</Label>
                <div className="flex gap-2">
                  <Input placeholder="JWT Secret Key" className="flex-1" />
                  <Button variant="outline" size="sm">Generate</Button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verifyAud" />
                    <label
                      htmlFor="verifyAud"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Verify Audience
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verifyIss" />
                    <label
                      htmlFor="verifyIss"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Verify Issuer
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {tempAuthType === "oauth" && (
              <div className="space-y-2">
                <Label>OAuth Provider</Label>
                <Select defaultValue="custom">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="auth0">Auth0</SelectItem>
                    <SelectItem value="okta">Okta</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                  </SelectContent>
                </Select>
                
                <Label className="mt-3">Client ID</Label>
                <Input placeholder="OAuth Client ID" />
                
                <Label className="mt-3">Client Secret</Label>
                <Input placeholder="OAuth Client Secret" type="password" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>Cancel</Button>
            <Button onClick={handleAuthTypeChange} disabled={applyingChanges}>
              {applyingChanges ? "Applying..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rate Limit Dialog */}
      <Dialog open={showRateLimitDialog} onOpenChange={setShowRateLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Rate Limiting</DialogTitle>
            <DialogDescription>
              Set limits on how many requests can be made in a given time period
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="rate-limit-toggle" className="font-medium">Enable Rate Limiting</Label>
              <Switch 
                id="rate-limit-toggle" 
                checked={tempRateLimit.enabled} 
                onCheckedChange={(checked) => setTempRateLimit({...tempRateLimit, enabled: checked})}
              />
            </div>
            
            {tempRateLimit.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate">Max Requests</Label>
                    <Input 
                      id="rate" 
                      type="number" 
                      value={tempRateLimit.rate} 
                      onChange={(e) => setTempRateLimit({...tempRateLimit, rate: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="per">Time Window (seconds)</Label>
                    <Input 
                      id="per" 
                      type="number" 
                      value={tempRateLimit.per} 
                      onChange={(e) => setTempRateLimit({...tempRateLimit, per: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="rounded-md bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">Common Presets</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTempRateLimit({...tempRateLimit, rate: 100, per: 60})}
                    >100 / minute</Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTempRateLimit({...tempRateLimit, rate: 1000, per: 3600})}
                    >1000 / hour</Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTempRateLimit({...tempRateLimit, rate: 20, per: 1})}
                    >20 / second</Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setTempRateLimit({...tempRateLimit, rate: 10000, per: 86400})}
                    >10K / day</Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRateLimitDialog(false)}>Cancel</Button>
            <Button onClick={handleRateLimitSave} disabled={applyingChanges}>
              {applyingChanges ? "Applying..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quota Dialog */}
      <Dialog open={showQuotaDialog} onOpenChange={setShowQuotaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Usage Quota</DialogTitle>
            <DialogDescription>
              Set a total usage limit for this API over a specified time period
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="quota-toggle" className="font-medium">Enable Usage Quota</Label>
              <Switch 
                id="quota-toggle" 
                checked={tempQuota.enabled} 
                onCheckedChange={(checked) => setTempQuota({...tempQuota, enabled: checked})}
              />
            </div>
            
            {tempQuota.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max">Max Requests</Label>
                    <Input 
                      id="max" 
                      type="number" 
                      value={tempQuota.max} 
                      onChange={(e) => setTempQuota({...tempQuota, max: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Time Period</Label>
                    <Select 
                      value={tempQuota.per.toString()} 
                      onValueChange={(value) => setTempQuota({...tempQuota, per: parseInt(value)})}
                    >
                      <SelectTrigger id="period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3600">1 Hour</SelectItem>
                        <SelectItem value="86400">1 Day</SelectItem>
                        <SelectItem value="604800">1 Week</SelectItem>
                        <SelectItem value="2592000">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Quota Behavior</h4>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="blockRequests" defaultChecked />
                    <label
                      htmlFor="blockRequests"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Block requests when quota exceeded
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id="notifyAdmin" />
                    <label
                      htmlFor="notifyAdmin"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Notify administrator when quota exceeded
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuotaDialog(false)}>Cancel</Button>
            <Button onClick={handleQuotaSave} disabled={applyingChanges}>
              {applyingChanges ? "Applying..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecuritySettings;

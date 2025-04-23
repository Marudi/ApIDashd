
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, ShieldOff } from "lucide-react";
import { ApiDefinition } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface AuthenticationSectionProps {
  api: ApiDefinition;
}

export function AuthenticationSection({ api }: AuthenticationSectionProps) {
  const { toast } = useToast();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [tempAuthType, setTempAuthType] = useState<ApiDefinition["authType"]>(api.authType);
  const [applyingChanges, setApplyingChanges] = useState(false);

  const handleAuthTypeChange = () => {
    setApplyingChanges(true);
    
    toast({
      title: "Updating Authentication",
      description: "Applying authentication changes...",
    });
    
    setTimeout(() => {
      setApplyingChanges(false);
      setShowAuthDialog(false);
      
      toast({
        title: "Authentication Updated",
        description: `Authentication type changed to ${tempAuthType}.`,
      });
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
      case "oauth2":
        return "OAuth 2.0";
      case "basic":
        return "Basic Auth";
      case "apikey":
        return "API Key";
      case "none":
        return "None";
      default:
        return type;
    }
  };

  return (
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
              <Select 
                value={tempAuthType} 
                onValueChange={(value: ApiDefinition["authType"]) => setTempAuthType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Authentication</SelectItem>
                  <SelectItem value="token">API Key (Token)</SelectItem>
                  <SelectItem value="apikey">API Key</SelectItem>
                  <SelectItem value="jwt">JWT</SelectItem>
                  <SelectItem value="oauth">OAuth</SelectItem>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
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
    </div>
  );
}

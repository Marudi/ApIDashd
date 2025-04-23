
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ApiDefinition } from "@/lib/types";

interface RequestControlsSectionProps {
  api: ApiDefinition;
  onConfigureRateLimiting: () => void;
  onConfigureQuota: () => void;
}

export function RequestControlsSection({ api, onConfigureRateLimiting, onConfigureQuota }: RequestControlsSectionProps) {
  const { toast } = useToast();
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showQuotaDialog, setShowQuotaDialog] = useState(false);
  const [applyingChanges, setApplyingChanges] = useState(false);
  const [tempRateLimit, setTempRateLimit] = useState({
    enabled: api.rateLimit?.enabled || false,
    rate: api.rateLimit?.rate || 100,
    per: api.rateLimit?.per || 60
  });
  const [tempQuota, setTempQuota] = useState({
    enabled: api.quota?.enabled || false,
    max: api.quota?.max || 10000,
    per: api.quota?.per || 86400
  });

  const handleRateLimitSave = () => {
    setApplyingChanges(true);
    toast({
      title: "Updating Rate Limit",
      description: "Applying rate limit changes...",
    });
    
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

  return (
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
    </div>
  );
}

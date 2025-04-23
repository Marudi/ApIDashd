
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw, Check, AlertCircle, Database } from "lucide-react";
import { gatewaySyncService, GatewayType, SyncStatus } from "@/services/gatewaySyncService";
import { ExtendedGatewayConfig, gatewayConfigService } from "@/services/GatewayConfigService";
import { redisService } from "@/services/RedisService";
import { Separator } from "@/components/ui/separator";

interface GatewaySyncProps {
  type: GatewayType;
}

export function GatewaySync({ type }: GatewaySyncProps) {
  const [config, setConfig] = useState<ExtendedGatewayConfig>(gatewayConfigService.getConfig(type));
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(gatewaySyncService.getSyncStatus(type));
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const title = type === "tyk" ? "Tyk Gateway" : "Kong Gateway";

  useEffect(() => {
    // Update local state when the sync status changes
    const interval = setInterval(() => {
      setSyncStatus(gatewaySyncService.getSyncStatus(type));
    }, 1000);

    return () => clearInterval(interval);
  }, [type]);

  const handleConfigChange = (field: keyof ExtendedGatewayConfig, value: any) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    gatewayConfigService.updateConfig(type, { [field]: value });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    await gatewaySyncService.testConnection(type);
    setIsTestingConnection(false);
  };

  const handleSyncNow = () => {
    gatewaySyncService.syncGateway(type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title} Synchronization</CardTitle>
        <CardDescription>Connect and synchronize with your {title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Synchronization</Label>
            <p className="text-sm text-muted-foreground">Automatically sync with {title}</p>
          </div>
          <Switch 
            checked={config.enabled} 
            onCheckedChange={(checked) => handleConfigChange("enabled", checked)} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${type}-url`}>Gateway URL</Label>
          <Input 
            id={`${type}-url`} 
            type="url" 
            placeholder="https://gateway.example.com" 
            value={config.url}
            onChange={(e) => handleConfigChange("url", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${type}-api-key`}>API Key / Token</Label>
          <Input 
            id={`${type}-api-key`} 
            type="password" 
            placeholder="Enter your API key" 
            value={config.apiKey}
            onChange={(e) => handleConfigChange("apiKey", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${type}-interval`}>Sync Interval</Label>
          <Select 
            value={config.syncInterval.toString()} 
            onValueChange={(value) => handleConfigChange("syncInterval", parseInt(value))}
          >
            <SelectTrigger id={`${type}-interval`}>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Every 1 minute</SelectItem>
              <SelectItem value="5">Every 5 minutes</SelectItem>
              <SelectItem value="15">Every 15 minutes</SelectItem>
              <SelectItem value="30">Every 30 minutes</SelectItem>
              <SelectItem value="60">Every hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Redis Integration
            </Label>
            <p className="text-sm text-muted-foreground">Use Redis to sync API definitions</p>
          </div>
          <Switch 
            checked={config.useRedis} 
            onCheckedChange={(checked) => handleConfigChange("useRedis", checked)} 
          />
        </div>

        {config.useRedis && (
          <div className="space-y-2 pl-6 border-l-2 border-muted">
            <Label htmlFor={`${type}-redis-prefix`}>Redis Key Prefix</Label>
            <Input 
              id={`${type}-redis-prefix`} 
              placeholder={`${type}:apis:`} 
              value={config.redisKeyPrefix}
              onChange={(e) => handleConfigChange("redisKeyPrefix", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Specify the key prefix used to store API definitions in Redis
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isTestingConnection || !config.url || !config.apiKey}
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
          
          <Button 
            onClick={handleSyncNow}
            disabled={!config.enabled || syncStatus.inProgress || !config.url || !config.apiKey}
          >
            {syncStatus.inProgress ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        </div>

        {/* Sync Status */}
        <div className="border rounded-md p-4 bg-muted/30">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium">Sync Status</h4>
              {syncStatus.lastSynced && (
                <p className="text-sm text-muted-foreground">
                  Last synced: {syncStatus.lastSynced.toLocaleString()}
                </p>
              )}
            </div>
            <div>
              {syncStatus.error ? (
                <div className="flex items-center text-destructive">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  <span className="text-sm">Error</span>
                </div>
              ) : syncStatus.lastSynced ? (
                <div className="flex items-center text-green-600">
                  <Check className="mr-1 h-4 w-4" />
                  <span className="text-sm">Synced</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Not synced yet</span>
              )}
            </div>
          </div>
          
          {syncStatus.error && (
            <p className="text-sm text-destructive mt-2">{syncStatus.error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

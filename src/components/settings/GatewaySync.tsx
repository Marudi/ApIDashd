import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { GatewaySyncService, GatewayConfig, GatewayType } from "@/lib/services/gateway-sync";
import { Loader2, RefreshCw, Save, TestTube } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GatewaySyncProps {
  type: GatewayType;
}

export function GatewaySync({ type }: GatewaySyncProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState<GatewayConfig>({
    url: '',
    apiKey: '',
    enabled: false,
    syncInterval: 5,
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    inProgress: false,
    lastSync: null as string | null,
  });

  const gatewaySyncService = GatewaySyncService.getInstance();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const savedConfig = await gatewaySyncService.getConfig(type);
    setConfig(savedConfig);
    if (savedConfig.lastSync) {
      setSyncStatus(prev => ({ ...prev, lastSync: savedConfig.lastSync || null }));
    }
  };

  const handleConfigChange = (key: keyof GatewayConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const success = await gatewaySyncService.testConnection(type, config);
      if (success) {
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${type} gateway`,
        });
      } else {
        throw new Error("Connection failed");
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to gateway",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await gatewaySyncService.saveConfig(type, config);
      toast({
        title: "Settings Saved",
        description: `${type} gateway configuration has been saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save gateway configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncStatus(prev => ({ ...prev, inProgress: true }));
    try {
      await gatewaySyncService.syncGateway(type);
      toast({
        title: "Sync Successful",
        description: `Successfully synchronized with ${type} gateway`,
      });
      await loadConfig(); // Reload config to get updated lastSync
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to synchronize with gateway",
        variant: "destructive",
      });
    } finally {
      setSyncStatus(prev => ({ ...prev, inProgress: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{type} Gateway</CardTitle>
        <CardDescription>
          Configure synchronization with your {type} gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Synchronization</Label>
            <p className="text-sm text-muted-foreground">
              Automatically sync with {type} gateway
            </p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => handleConfigChange('enabled', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${type}-url`}>Gateway URL</Label>
          <Input
            id={`${type}-url`}
            value={config.url}
            onChange={(e) => handleConfigChange('url', e.target.value)}
            placeholder={`https://${type}-gateway.example.com`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${type}-apiKey`}>API Key</Label>
          <Input
            id={`${type}-apiKey`}
            type="password"
            value={config.apiKey}
            onChange={(e) => handleConfigChange('apiKey', e.target.value)}
            placeholder="Enter your API key"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${type}-interval`}>Sync Interval</Label>
          <Select 
            value={config.syncInterval.toString()} 
            onValueChange={(value) => handleConfigChange('syncInterval', parseInt(value))}
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

        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isTesting || !config.url || !config.apiKey}
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Test Connection
              </>
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

        {syncStatus.lastSync && (
          <div className="text-sm text-muted-foreground">
            Last synced: {new Date(syncStatus.lastSync).toLocaleString()}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

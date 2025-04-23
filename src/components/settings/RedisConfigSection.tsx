
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Database, Save, RefreshCw, Loader2, Check, AlertCircle } from "lucide-react";
import { redisService, RedisConfig, RedisConnectionStatus } from "@/services/RedisService";
import { toast } from "sonner";

export function RedisConfigSection() {
  const [config, setConfig] = useState<RedisConfig>(redisService.getConfig());
  const [connectionStatus, setConnectionStatus] = useState<RedisConnectionStatus>(
    redisService.getConnectionStatus()
  );
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  const handleConfigChange = (field: keyof RedisConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveConfig = () => {
    redisService.updateConfig(config);
    toast.success("Redis configuration saved");
  };
  
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      await redisService.testConnection();
      setConnectionStatus(redisService.getConnectionStatus());
    } finally {
      setIsTestingConnection(false);
    }
  };

  const isFormValid = () => {
    return config.host.trim() !== "" && config.port > 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Redis Configuration
        </CardTitle>
        <CardDescription>Configure Redis connection for Tyk API Gateway integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="redis-host">Redis Host</Label>
              <Input 
                id="redis-host" 
                placeholder="localhost" 
                value={config.host}
                onChange={(e) => handleConfigChange("host", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="redis-port">Port</Label>
              <Input 
                id="redis-port" 
                type="number" 
                placeholder="6379" 
                value={config.port}
                onChange={(e) => handleConfigChange("port", parseInt(e.target.value) || 6379)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="redis-username">Username (optional)</Label>
              <Input 
                id="redis-username" 
                placeholder="Username" 
                value={config.username}
                onChange={(e) => handleConfigChange("username", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="redis-password">Password (optional)</Label>
              <Input 
                id="redis-password" 
                type="password" 
                placeholder="Password" 
                value={config.password}
                onChange={(e) => handleConfigChange("password", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="redis-database">Database</Label>
              <Input 
                id="redis-database" 
                type="number" 
                placeholder="0" 
                value={config.database}
                onChange={(e) => handleConfigChange("database", parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex items-center justify-between space-y-0 pt-4">
              <div className="space-y-0.5">
                <Label>Enable TLS/SSL</Label>
                <p className="text-sm text-muted-foreground">Use secure connection</p>
              </div>
              <Switch 
                checked={config.tls}
                onCheckedChange={(checked) => handleConfigChange("tls", checked)}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button 
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTestingConnection || !isFormValid()}
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
          
          <Button onClick={handleSaveConfig} disabled={!isFormValid()}>
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
        
        {/* Connection Status */}
        <div className="border rounded-md p-4 bg-muted/30">
          <div className="flex items-center">
            <div className="flex-1">
              <h4 className="font-medium">Connection Status</h4>
              {connectionStatus.lastTestedAt && (
                <p className="text-sm text-muted-foreground">
                  Last tested: {connectionStatus.lastTestedAt.toLocaleString()}
                </p>
              )}
            </div>
            <div>
              {connectionStatus.error ? (
                <div className="flex items-center text-destructive">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  <span className="text-sm">Failed</span>
                </div>
              ) : connectionStatus.connected ? (
                <div className="flex items-center text-green-600">
                  <Check className="mr-1 h-4 w-4" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Not connected</span>
              )}
            </div>
          </div>
          
          {connectionStatus.error && (
            <p className="text-sm text-destructive mt-2">{connectionStatus.error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

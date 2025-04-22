import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { DatabaseConfig, DatabaseConnection } from "@/lib/config/database";
import { Loader2, Save, TestTube } from "lucide-react";

export function DatabaseSettings() {
  const { toast } = useToast();
  const [config, setConfig] = useState<DatabaseConfig>({
    host: '',
    port: 5432,
    database: '',
    user: '',
    password: '',
    ssl: false,
    maxConnections: 10,
    connectionTimeout: 5000,
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem('databaseConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleConfigChange = (key: keyof DatabaseConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const db = DatabaseConnection.getInstance(config);
      await db.connect();
      toast({
        title: "Connection Successful",
        description: "Successfully connected to the database",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to database",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('databaseConfig', JSON.stringify(config));
      toast({
        title: "Settings Saved",
        description: "Database configuration has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save database configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Settings</CardTitle>
        <CardDescription>
          Configure your PostgreSQL database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              value={config.host}
              onChange={(e) => handleConfigChange('host', e.target.value)}
              placeholder="localhost"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              value={config.port}
              onChange={(e) => handleConfigChange('port', parseInt(e.target.value))}
              placeholder="5432"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="database">Database Name</Label>
            <Input
              id="database"
              value={config.database}
              onChange={(e) => handleConfigChange('database', e.target.value)}
              placeholder="apidash"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user">Username</Label>
            <Input
              id="user"
              value={config.user}
              onChange={(e) => handleConfigChange('user', e.target.value)}
              placeholder="postgres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={config.password}
              onChange={(e) => handleConfigChange('password', e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxConnections">Max Connections</Label>
            <Input
              id="maxConnections"
              type="number"
              value={config.maxConnections}
              onChange={(e) => handleConfigChange('maxConnections', parseInt(e.target.value))}
              placeholder="10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ssl"
            checked={config.ssl}
            onCheckedChange={(checked) => handleConfigChange('ssl', checked)}
          />
          <Label htmlFor="ssl">Enable SSL</Label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isTesting}
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
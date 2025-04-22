
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PostgresConfigSection } from "./PostgresConfigSection";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";
import { StorageUsageCard } from "./StorageUsageCard";
import { useToast } from "@/hooks/use-toast";

// Default settings
const DEFAULT_SETTINGS = {
  dashboardName: "Tyk API Gateway Dashboard",
  timeZone: "(UTC+00:00) UTC",
  dateFormat: "MM/DD/YYYY",
  autoRefresh: true,
};

export function GeneralSettingsSection() {
  const { persistentEnabled, setPersistentEnabled, setPersistentItem, getPersistentItem } = usePersistentStorage();
  const { toast } = useToast();

  const [dashboardName, setDashboardName] = useState(DEFAULT_SETTINGS.dashboardName);
  const [timeZone, setTimeZone] = useState(DEFAULT_SETTINGS.timeZone);
  const [dateFormat, setDateFormat] = useState(DEFAULT_SETTINGS.dateFormat);
  const [autoRefresh, setAutoRefresh] = useState(DEFAULT_SETTINGS.autoRefresh);
  const [loading, setLoading] = useState(true);

  // Load settings on mount or when persistence enabled changes
  useEffect(() => {
    setLoading(true);
    if (persistentEnabled) {
      const loaded = getPersistentItem("dashboard_settings");
      if (loaded) {
        setDashboardName(loaded.dashboardName ?? DEFAULT_SETTINGS.dashboardName);
        setTimeZone(loaded.timeZone ?? DEFAULT_SETTINGS.timeZone);
        setDateFormat(loaded.dateFormat ?? DEFAULT_SETTINGS.dateFormat);
        setAutoRefresh(loaded.autoRefresh ?? DEFAULT_SETTINGS.autoRefresh);
      } else {
        setDashboardName(DEFAULT_SETTINGS.dashboardName);
        setTimeZone(DEFAULT_SETTINGS.timeZone);
        setDateFormat(DEFAULT_SETTINGS.dateFormat);
        setAutoRefresh(DEFAULT_SETTINGS.autoRefresh);
      }
    } else {
      // fallback to defaults
      setDashboardName(DEFAULT_SETTINGS.dashboardName);
      setTimeZone(DEFAULT_SETTINGS.timeZone);
      setDateFormat(DEFAULT_SETTINGS.dateFormat);
      setAutoRefresh(DEFAULT_SETTINGS.autoRefresh);
    }
    setLoading(false);
  }, [persistentEnabled, getPersistentItem]);

  // Save handler
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const settings = {
      dashboardName,
      timeZone,
      dateFormat,
      autoRefresh,
    };
    if (persistentEnabled) {
      setPersistentItem("dashboard_settings", settings);
      toast({
        title: "Settings Saved",
        description: "Your dashboard settings have been updated.",
        duration: 2000,
      });
    } else {
      toast({
        title: "Persistence Disabled",
        description: "Enable 'Persist API & Key Data locally' to save settings.",
        variant: "destructive",
        duration: 2500,
      });
    }
  };

  // Reset handler
  const handleReset = () => {
    setDashboardName(DEFAULT_SETTINGS.dashboardName);
    setTimeZone(DEFAULT_SETTINGS.timeZone);
    setDateFormat(DEFAULT_SETTINGS.dateFormat);
    setAutoRefresh(DEFAULT_SETTINGS.autoRefresh);
    // Optionally clear persisted settings
    if (persistentEnabled) {
      setPersistentItem("dashboard_settings", DEFAULT_SETTINGS);
    }
    toast({
      title: "Settings Reset",
      description: "Settings reverted to defaults.",
      duration: 1800,
    });
  };

  return (
    <>
      <PostgresConfigSection />
      <div className="my-6">
        <StorageUsageCard />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general dashboard settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            className="space-y-6"
            onSubmit={handleSave}
            autoComplete="off"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Dashboard Name</Label>
                <Input 
                  type="text" 
                  placeholder="Dashboard Name" 
                  value={dashboardName}
                  onChange={e => setDashboardName(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <select
                    className="w-full h-10 px-3 py-2 border border-input rounded-md"
                    value={timeZone}
                    onChange={e => setTimeZone(e.target.value)}
                    disabled={loading}
                  >
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
                  <select
                    className="w-full h-10 px-3 py-2 border border-input rounded-md"
                    value={dateFormat}
                    onChange={e => setDateFormat(e.target.value)}
                    disabled={loading}
                  >
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
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={val => setAutoRefresh(!!val)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Persist API &amp; Key Data locally</Label>
                  <p className="text-sm text-muted-foreground">
                    Save API and key data in your browser for offline access and session restore.
                  </p>
                </div>
                <Switch checked={persistentEnabled} onCheckedChange={setPersistentEnabled} />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleReset}>Reset</Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

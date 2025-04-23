
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import { PostgresConfigSection } from "./PostgresConfigSection";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";
import { StorageUsageCard } from "./StorageUsageCard";
import { useToast } from "@/hooks/use-toast";
import { useDemoData } from "@/contexts/DemoDataContext";
import { DashboardNameInput } from "./DashboardNameInput";
import { TimeZoneSelect } from "./TimeZoneSelect";
import { DateFormatSelect } from "./DateFormatSelect";
import { AutoRefreshToggle } from "./AutoRefreshToggle";
import { ShowDemoDataToggle } from "./ShowDemoDataToggle";
import { PersistenceToggle } from "./PersistenceToggle";

// Default settings
const DEFAULT_SETTINGS = {
  dashboardName: "Tyk API Gateway Dashboard",
  timeZone: "(UTC+00:00) UTC",
  dateFormat: "MM/DD/YYYY",
  autoRefresh: true,
  showDemoData: true,
};

export function GeneralSettingsSection() {
  const { persistentEnabled, setPersistentEnabled, setPersistentItem, getPersistentItem } = usePersistentStorage();
  const { toast } = useToast();
  const { showDemoData, setShowDemoData } = useDemoData();

  const [dashboardName, setDashboardName] = useState(DEFAULT_SETTINGS.dashboardName);
  const [timeZone, setTimeZone] = useState(DEFAULT_SETTINGS.timeZone);
  const [dateFormat, setDateFormat] = useState(DEFAULT_SETTINGS.dateFormat);
  const [autoRefresh, setAutoRefresh] = useState(DEFAULT_SETTINGS.autoRefresh);
  const [loading, setLoading] = useState(true);

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
      setDashboardName(DEFAULT_SETTINGS.dashboardName);
      setTimeZone(DEFAULT_SETTINGS.timeZone);
      setDateFormat(DEFAULT_SETTINGS.dateFormat);
      setAutoRefresh(DEFAULT_SETTINGS.autoRefresh);
    }
    setLoading(false);
  }, [persistentEnabled, getPersistentItem]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const settings = {
      dashboardName,
      timeZone,
      dateFormat,
      autoRefresh,
      showDemoData,
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

  const handleReset = () => {
    setDashboardName(DEFAULT_SETTINGS.dashboardName);
    setTimeZone(DEFAULT_SETTINGS.timeZone);
    setDateFormat(DEFAULT_SETTINGS.dateFormat);
    setAutoRefresh(DEFAULT_SETTINGS.autoRefresh);
    setShowDemoData(DEFAULT_SETTINGS.showDemoData);
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
              <DashboardNameInput
                value={dashboardName}
                onChange={setDashboardName}
                disabled={loading}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TimeZoneSelect
                  value={timeZone}
                  onChange={setTimeZone}
                  disabled={loading}
                />
                <DateFormatSelect
                  value={dateFormat}
                  onChange={setDateFormat}
                  disabled={loading}
                />
              </div>

              <AutoRefreshToggle
                checked={autoRefresh}
                onChange={val => setAutoRefresh(!!val)}
                disabled={loading}
              />

              <ShowDemoDataToggle
                checked={showDemoData}
                onChange={val => setShowDemoData(val)}
                disabled={loading}
              />

              <PersistenceToggle
                checked={persistentEnabled}
                onChange={setPersistentEnabled}
              />
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleReset}>
                Reset
              </Button>
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

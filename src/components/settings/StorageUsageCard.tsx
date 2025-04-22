
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { HardDrive } from "lucide-react";

const LOCAL_KEYS = [
  "dashboard_persistence_enabled",
  "api_definitions",
  "api_keys",
];

const MAX_STORAGE_BYTES = 5 * 1024 * 1024; // Approx. 5MB for localStorage.

function prettyBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
  return `${(bytes/1024/1024).toFixed(2)} MB`;
}

export function StorageUsageCard() {
  const { toast } = useToast();
  const [usage, setUsage] = useState({ used: 0, total: MAX_STORAGE_BYTES, percent: 0 });

  // Calculate used bytes for only our app's keys
  const updateUsage = () => {
    let used = 0;
    LOCAL_KEYS.forEach((key) => {
      const v = window.localStorage.getItem(key);
      if (v != null) {
        used += key.length + v.length;
      }
    });
    setUsage({
      used,
      total: MAX_STORAGE_BYTES,
      percent: Math.min(100, (used / MAX_STORAGE_BYTES) * 100),
    });
  };

  useEffect(() => {
    updateUsage();
    window.addEventListener("storage", updateUsage);
    return () => window.removeEventListener("storage", updateUsage);
  }, []);

  // Download all persistent data as JSON
  const handleBackup = () => {
    const backedUp = Object.fromEntries(
      LOCAL_KEYS.map(key => [key, window.localStorage.getItem(key)])
    );
    const blob = new Blob([JSON.stringify(backedUp, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-persistent-storage-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Backup Downloaded",
      description: "A backup of your persistent data has been downloaded."
    });
  };

  // Removes any persistent data no longer used (keys not in LOCAL_KEYS)
  const handleCleanUnused = () => {
    let removed = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)!;
      if (!LOCAL_KEYS.includes(key)) {
        window.localStorage.removeItem(key);
        removed++;
      }
    }
    updateUsage();
    toast({
      title: "Cleanup Complete",
      description: removed > 0 ? `Removed ${removed} unused item(s) from storage.` : "No unused data found."
    });
  };

  // Remove all persistent storage (only our app's keys)
  const handleDeleteAll = () => {
    LOCAL_KEYS.forEach(key => window.localStorage.removeItem(key));
    updateUsage();
    toast({
      title: "Persistent Storage Cleared",
      description: "All persistent dashboard data has been deleted."
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row gap-4 items-start">
        <span className="bg-purple-100 rounded-full p-2 inline-flex"><HardDrive className="w-6 h-6 text-primary" /></span>
        <div>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>
            Monitor and manage data stored locally via the persistence setting.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Progress value={usage.percent} max={100} color={usage.percent < 90 ? "default" : usage.percent < 98 ? "warning" : "error"} />
          <div className="text-xs text-muted-foreground mt-1 flex justify-between">
            <span>Used: <b>{prettyBytes(usage.used)}</b></span>
            <span>Max: {prettyBytes(usage.total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={handleBackup} size="sm">
          Backup
        </Button>
        <Button variant="outline" onClick={handleCleanUnused} size="sm">
          Clean Unused
        </Button>
        <Button variant="destructive" onClick={handleDeleteAll} size="sm">
          Delete All
        </Button>
      </CardFooter>
    </Card>
  );
}

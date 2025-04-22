
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { gatewaySyncService, GatewayType, SyncStatus } from "@/services/gatewaySyncService";

interface SyncStatusIndicatorProps {
  type: GatewayType;
}

export function SyncStatusIndicator({ type }: SyncStatusIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(gatewaySyncService.getSyncStatus(type));
  const config = gatewaySyncService.getConfig(type);

  useEffect(() => {
    // Update local state when the sync status changes
    const interval = setInterval(() => {
      setSyncStatus(gatewaySyncService.getSyncStatus(type));
    }, 1000);

    return () => clearInterval(interval);
  }, [type]);

  const handleSyncNow = () => {
    gatewaySyncService.syncGateway(type);
  };

  if (!config.enabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="text-muted-foreground">
              Sync Disabled
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Gateway synchronization is disabled. Enable it in settings.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (syncStatus.inProgress) {
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Syncing...
      </Badge>
    );
  }

  if (syncStatus.error) {
    return (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive">Sync Failed</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{syncStatus.error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2"
          onClick={handleSyncNow}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (!syncStatus.lastSynced) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-muted-foreground">
          Not synced yet
        </Badge>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2"
          onClick={handleSyncNow}
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  // Successfully synced
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Synced
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last synced: {syncStatus.lastSynced.toLocaleString()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2"
        onClick={handleSyncNow}
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  );
}

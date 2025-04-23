
import { toast } from "sonner";
import { gatewayConfigService } from "./GatewayConfigService";
import { gatewayApiService } from "./GatewayApiService";
import { gatewaySyncScheduler } from "./GatewaySyncScheduler";

export type GatewayType = "tyk" | "kong";

export interface GatewayConfig {
  type: GatewayType;
  url: string;
  apiKey: string;
  syncInterval: number; // in minutes
  enabled: boolean;
}

export interface SyncStatus {
  lastSynced: Date | null;
  inProgress: boolean;
  error: string | null;
}

/**
 * Exported singleton service to provide the same API as before.
 */
export const gatewaySyncService = {
  getConfig: (type: GatewayType) => gatewayConfigService.getConfig(type),
  updateConfig: (type: GatewayType, config: Partial<GatewayConfig>) => {
    gatewayConfigService.updateConfig(type, config);
    gatewaySyncScheduler.updateSyncSchedule(type);
  },

  getSyncStatus: (type: GatewayType) => gatewaySyncScheduler.getSyncStatus(type),

  syncGateway: (type: GatewayType) => gatewaySyncScheduler.syncGateway(type),

  testConnection: async (type: GatewayType) => {
    const config = gatewayConfigService.getConfig(type);
    return gatewayApiService.testConnection(type, config);
  }
};


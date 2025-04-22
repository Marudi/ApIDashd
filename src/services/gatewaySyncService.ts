
import { toast } from "sonner";

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

class GatewaySyncService {
  private configs: Record<GatewayType, GatewayConfig> = {
    tyk: {
      type: "tyk",
      url: "",
      apiKey: "",
      syncInterval: 5,
      enabled: false,
    },
    kong: {
      type: "kong",
      url: "",
      apiKey: "",
      syncInterval: 5,
      enabled: false,
    },
  };

  private syncStatus: Record<GatewayType, SyncStatus> = {
    tyk: {
      lastSynced: null,
      inProgress: false,
      error: null,
    },
    kong: {
      lastSynced: null,
      inProgress: false,
      error: null,
    },
  };

  private syncIntervals: Record<GatewayType, number | null> = {
    tyk: null,
    kong: null,
  };

  constructor() {
    this.loadConfig();
    this.initSyncSchedules();
  }

  private loadConfig() {
    // Load from localStorage if available
    const savedTykConfig = localStorage.getItem("tyk-gateway-config");
    const savedKongConfig = localStorage.getItem("kong-gateway-config");

    if (savedTykConfig) {
      this.configs.tyk = JSON.parse(savedTykConfig);
    }

    if (savedKongConfig) {
      this.configs.kong = JSON.parse(savedKongConfig);
    }
  }

  private saveConfig(type: GatewayType) {
    localStorage.setItem(
      `${type}-gateway-config`,
      JSON.stringify(this.configs[type])
    );
  }

  public getConfig(type: GatewayType): GatewayConfig {
    return this.configs[type];
  }

  public updateConfig(type: GatewayType, config: Partial<GatewayConfig>): void {
    this.configs[type] = {
      ...this.configs[type],
      ...config,
    };
    this.saveConfig(type);
    this.updateSyncSchedule(type);
  }

  public getSyncStatus(type: GatewayType): SyncStatus {
    return this.syncStatus[type];
  }

  private initSyncSchedules() {
    Object.keys(this.configs).forEach((type) => {
      this.updateSyncSchedule(type as GatewayType);
    });
  }

  private updateSyncSchedule(type: GatewayType) {
    // Clear existing interval if any
    if (this.syncIntervals[type] !== null) {
      window.clearInterval(this.syncIntervals[type]!);
      this.syncIntervals[type] = null;
    }

    const config = this.configs[type];
    if (config.enabled && config.url && config.apiKey) {
      // Set new interval
      this.syncIntervals[type] = window.setInterval(() => {
        this.syncGateway(type);
      }, config.syncInterval * 60 * 1000);

      // Initial sync
      this.syncGateway(type);
    }
  }

  public async syncGateway(type: GatewayType): Promise<boolean> {
    const config = this.configs[type];
    
    if (!config.enabled || !config.url || !config.apiKey) {
      return false;
    }

    this.syncStatus[type] = {
      ...this.syncStatus[type],
      inProgress: true,
      error: null,
    };

    try {
      console.log(`Syncing with ${type} gateway at ${config.url}`);
      
      // Simulate API call to gateway
      const response = await this.fetchGatewayData(type, config);
      
      this.syncStatus[type] = {
        lastSynced: new Date(),
        inProgress: false,
        error: null,
      };
      
      toast.success(`Successfully synchronized with ${type.toUpperCase()} gateway`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.syncStatus[type] = {
        ...this.syncStatus[type],
        inProgress: false,
        error: errorMessage,
      };
      
      toast.error(`Failed to sync with ${type.toUpperCase()} gateway: ${errorMessage}`);
      return false;
    }
  }

  private async fetchGatewayData(type: GatewayType, config: GatewayConfig) {
    // This would be replaced with actual API calls to Tyk or Kong
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        if (Math.random() > 0.2) { // 80% success rate for simulation
          resolve({
            apis: [],
            status: "success"
          });
        } else {
          reject(new Error("Gateway connection failed"));
        }
      }, 2000);
    });
  }

  public testConnection(type: GatewayType): Promise<boolean> {
    const config = this.configs[type];
    
    if (!config.url || !config.apiKey) {
      toast.error("Gateway URL and API Key must be provided");
      return Promise.resolve(false);
    }

    toast.info(`Testing connection to ${type.toUpperCase()} gateway...`);
    
    return this.fetchGatewayData(type, config)
      .then(() => {
        toast.success(`Successfully connected to ${type.toUpperCase()} gateway`);
        return true;
      })
      .catch((error) => {
        toast.error(`Connection test failed: ${error.message}`);
        return false;
      });
  }
}

// Create a singleton instance
export const gatewaySyncService = new GatewaySyncService();

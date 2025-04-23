
import { GatewayType, GatewayConfig, SyncStatus } from "./gatewaySyncService";
import { toast } from "sonner";

export class GatewayApiService {
  public async fetchGatewayData(type: GatewayType, config: GatewayConfig) {
    // Simulated API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ apis: [], status: "success" });
        } else {
          reject(new Error("Gateway connection failed"));
        }
      }, 2000);
    });
  }

  public async testConnection(type: GatewayType, config: GatewayConfig): Promise<boolean> {
    if (!config.url || !config.apiKey) {
      toast.error("Connection Test Failed", {
        description: "Gateway URL and API Key must be provided"
      });
      return false;
    }
    try {
      await this.fetchGatewayData(type, config);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      toast.error("Connection Test Failed", {
        description: errorMessage
      });
      return false;
    }
  }

  public async syncGateway(
    type: GatewayType,
    config: GatewayConfig,
    status: SyncStatus,
    setStatus: (status: SyncStatus) => void
  ): Promise<boolean> {
    if (!config.enabled || !config.url || !config.apiKey) {
      return false;
    }

    setStatus({
      ...status,
      inProgress: true,
      error: null
    });

    try {
      await this.fetchGatewayData(type, config);

      setStatus({
        lastSynced: new Date(),
        inProgress: false,
        error: null
      });
      toast.success(`Successfully synchronized with ${type.toUpperCase()} gateway`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({
        ...status,
        inProgress: false,
        error: errorMessage
      });
      toast.error(`Failed to sync with ${type.toUpperCase()} gateway: ${errorMessage}`);
      return false;
    }
  }
}

export const gatewayApiService = new GatewayApiService();

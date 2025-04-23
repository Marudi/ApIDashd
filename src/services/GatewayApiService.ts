
import { GatewayType, GatewayConfig, SyncStatus } from "./gatewaySyncService";
import { ExtendedGatewayConfig, gatewayConfigService } from "./GatewayConfigService";
import { redisService } from "./RedisService";
import { toast } from "sonner";

export class GatewayApiService {
  public async fetchGatewayData(type: GatewayType, config: ExtendedGatewayConfig) {
    // Check if Redis integration is enabled
    if (config.useRedis) {
      try {
        return await this.fetchGatewayDataFromRedis(type, config);
      } catch (error) {
        console.error(`Redis error when fetching ${type} gateway data:`, error);
        
        // Notify the user of Redis failure and fallback
        toast.warning(`Redis connection failed for ${type.toUpperCase()} gateway`, {
          description: "Falling back to direct API connection"
        });
        
        // Fall back to direct API call if Redis fails
        return this.fetchGatewayDataDirect(type, config);
      }
    }
    
    // Fall back to direct API call if Redis isn't enabled
    return this.fetchGatewayDataDirect(type, config);
  }

  private async fetchGatewayDataDirect(type: GatewayType, config: ExtendedGatewayConfig) {
    console.log(`Fetching ${type} gateway data directly`);
    
    // Validate configuration
    if (!config.url || !config.apiKey) {
      throw new Error(`${type.toUpperCase()} gateway URL and API Key must be provided`);
    }
    
    // Simulated direct API call to the gateway
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) {
          resolve({ 
            apis: [], 
            status: "success",
            source: "direct" 
          });
        } else {
          reject(new Error(`${type.toUpperCase()} gateway connection failed`));
        }
      }, 2000);
    });
  }

  private async fetchGatewayDataFromRedis(type: GatewayType, config: ExtendedGatewayConfig) {
    try {
      console.log(`Fetching ${type} gateway data from Redis`);
      
      // Ensure Redis is connected
      const connectionStatus = redisService.getConnectionStatus();
      if (!connectionStatus.connected) {
        const connected = await redisService.connect();
        if (!connected) {
          throw new Error(connectionStatus.error || "Failed to establish Redis connection");
        }
      }

      // Use the Redis service to fetch APIs
      const apiDefs = await redisService.getTykApis();
      console.log(`Retrieved ${apiDefs.length} API definitions from Redis`);
      
      return { 
        apis: apiDefs, 
        status: "success", 
        source: "redis" 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Redis error for ${type} gateway: ${errorMessage}`);
      throw new Error(`Redis error: ${errorMessage}`);
    }
  }

  public async testConnection(type: GatewayType, config: ExtendedGatewayConfig): Promise<boolean> {
    if (!config.url || !config.apiKey) {
      toast.error("Connection Test Failed", {
        description: "Gateway URL and API Key must be provided"
      });
      return false;
    }

    try {
      // If Redis integration is enabled, test Redis connection first
      if (config.useRedis) {
        console.log("Testing Redis connection");
        const redisConnected = await redisService.testConnection();
        if (!redisConnected) {
          // Redis connection already shows toast, no need to duplicate
          return false;
        }
      }

      // Then test gateway connection
      await this.fetchGatewayData(type, config);
      toast.success("Gateway Connection Test Successful", {
        description: `Successfully connected to ${type.toUpperCase()} gateway${config.useRedis ? " via Redis" : ""}`
      });
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
    config: ExtendedGatewayConfig,
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
      const result = await this.fetchGatewayData(type, config);
      
      setStatus({
        lastSynced: new Date(),
        inProgress: false,
        error: null
      });
      
      const dataSource = result.source === "redis" ? " via Redis" : "";
      toast.success(`Successfully synchronized with ${type.toUpperCase()} gateway${dataSource}`);
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

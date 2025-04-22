import { DatabaseService } from "./database";
import { ApiDefinition } from "./database";
import { z } from "zod";

export const GatewayConfigSchema = z.object({
  url: z.string().url(),
  apiKey: z.string().min(1),
  enabled: z.boolean().default(false),
  syncInterval: z.number().min(1).max(60).default(5), // minutes
  lastSync: z.string().datetime().optional(),
});

export type GatewayConfig = z.infer<typeof GatewayConfigSchema>;

export type GatewayType = 'tyk' | 'kong';

export class GatewaySyncService {
  private static instance: GatewaySyncService;
  private db: DatabaseService;
  private syncIntervals: Map<GatewayType, NodeJS.Timeout> = new Map();

  private constructor() {
    this.db = DatabaseService.getInstance();
  }

  public static getInstance(): GatewaySyncService {
    if (!GatewaySyncService.instance) {
      GatewaySyncService.instance = new GatewaySyncService();
    }
    return GatewaySyncService.instance;
  }

  public async getConfig(type: GatewayType): Promise<GatewayConfig> {
    const config = localStorage.getItem(`gateway_${type}_config`);
    if (config) {
      return GatewayConfigSchema.parse(JSON.parse(config));
    }
    return GatewayConfigSchema.parse({});
  }

  public async saveConfig(type: GatewayType, config: GatewayConfig): Promise<void> {
    const validatedConfig = GatewayConfigSchema.parse(config);
    localStorage.setItem(`gateway_${type}_config`, JSON.stringify(validatedConfig));
    
    if (validatedConfig.enabled) {
      this.startSync(type);
    } else {
      this.stopSync(type);
    }
  }

  public async testConnection(type: GatewayType, config: GatewayConfig): Promise<boolean> {
    try {
      const response = await fetch(`${config.url}/status`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Gateway returned status ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`Failed to connect to ${type} gateway:`, error);
      return false;
    }
  }

  public async syncGateway(type: GatewayType): Promise<void> {
    const config = await this.getConfig(type);
    if (!config.enabled || !config.url || !config.apiKey) {
      return;
    }

    try {
      const apis = await this.fetchGatewayApis(type, config);
      await this.syncApisToDatabase(type, apis);
      
      await this.saveConfig(type, {
        ...config,
        lastSync: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to sync ${type} gateway:`, error);
    }
  }

  private async fetchGatewayApis(type: GatewayType, config: GatewayConfig): Promise<ApiDefinition[]> {
    const endpoint = type === 'tyk' ? '/tyk/apis' : '/apis';
    const response = await fetch(`${config.url}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch APIs from ${type} gateway`);
    }

    const data = await response.json();
    return this.transformGatewayApis(type, data);
  }

  private transformGatewayApis(type: GatewayType, data: any): ApiDefinition[] {
    if (type === 'tyk') {
      return data.apis.map((api: any) => ({
        id: api.api_id,
        name: api.name,
        description: api.description,
        version: api.version,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        config: api,
        status: 'published',
        gatewayType: type,
      }));
    } else {
      // Kong transformation
      return data.data.map((api: any) => ({
        id: api.id,
        name: api.name,
        description: api.description,
        version: api.version,
        createdAt: new Date(api.created_at * 1000).toISOString(),
        updatedAt: new Date(api.updated_at * 1000).toISOString(),
        config: api,
        status: 'published',
        gatewayType: type,
      }));
    }
  }

  private async syncApisToDatabase(type: GatewayType, apis: ApiDefinition[]): Promise<void> {
    for (const api of apis) {
      const existing = await this.db.getApiDefinition(api.id);
      if (existing) {
        await this.db.updateApiDefinition(api.id, api);
      } else {
        await this.db.createApiDefinition(api);
      }
    }
  }

  public startSync(type: GatewayType): void {
    this.stopSync(type); // Clear any existing interval

    const config = localStorage.getItem(`gateway_${type}_config`);
    if (!config) return;

    const { syncInterval, enabled } = JSON.parse(config);
    if (!enabled) return;

    const interval = setInterval(() => {
      this.syncGateway(type);
    }, syncInterval * 60 * 1000);

    this.syncIntervals.set(type, interval);
    this.syncGateway(type); // Initial sync
  }

  public stopSync(type: GatewayType): void {
    const interval = this.syncIntervals.get(type);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(type);
    }
  }

  public stopAllSync(): void {
    for (const [type] of this.syncIntervals) {
      this.stopSync(type);
    }
  }
} 
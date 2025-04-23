
import { GatewayType, GatewayConfig } from "./gatewaySyncService";

export interface ExtendedGatewayConfig extends GatewayConfig {
  useRedis?: boolean;
  redisKeyPrefix?: string;
}

export class GatewayConfigService {
  private configs: Record<GatewayType, ExtendedGatewayConfig> = {
    tyk: {
      type: "tyk",
      url: "",
      apiKey: "",
      syncInterval: 5,
      enabled: false,
      useRedis: false,
      redisKeyPrefix: "tyk:apis:"
    },
    kong: {
      type: "kong",
      url: "",
      apiKey: "",
      syncInterval: 5,
      enabled: false,
      useRedis: false,
      redisKeyPrefix: "kong:apis:"
    },
  };

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
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

  public getConfig(type: GatewayType): ExtendedGatewayConfig {
    return this.configs[type];
  }

  public updateConfig(type: GatewayType, config: Partial<ExtendedGatewayConfig>): void {
    this.configs[type] = {
      ...this.configs[type],
      ...config,
    };
    this.saveConfig(type);
  }
}

export const gatewayConfigService = new GatewayConfigService();


import { GatewayType, GatewayConfig } from "./gatewaySyncService";

export class GatewayConfigService {
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

  public getConfig(type: GatewayType): GatewayConfig {
    return this.configs[type];
  }

  public updateConfig(type: GatewayType, config: Partial<GatewayConfig>): void {
    this.configs[type] = {
      ...this.configs[type],
      ...config,
    };
    this.saveConfig(type);
  }
}

export const gatewayConfigService = new GatewayConfigService();

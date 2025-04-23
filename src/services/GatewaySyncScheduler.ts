
import { GatewayType, GatewayConfig, SyncStatus } from "./gatewaySyncService";
import { gatewayApiService } from "./GatewayApiService";
import { gatewayConfigService } from "./GatewayConfigService";

type StatusUpdater = (type: GatewayType, status: SyncStatus) => void;

export class GatewaySyncScheduler {
  private syncIntervals: Record<GatewayType, number | null> = {
    tyk: null,
    kong: null,
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

  private updater: StatusUpdater | null = null;

  constructor() {
    this.initSyncSchedules();
  }

  private initSyncSchedules() {
    (["tyk", "kong"] as GatewayType[]).forEach((type) => {
      this.updateSyncSchedule(type);
    });
  }

  private clearInterval(type: GatewayType) {
    if (this.syncIntervals[type] !== null) {
      window.clearInterval(this.syncIntervals[type]!);
      this.syncIntervals[type] = null;
    }
  }

  public updateSyncSchedule(type: GatewayType) {
    this.clearInterval(type);

    const config = gatewayConfigService.getConfig(type);
    if (config.enabled && config.url && config.apiKey) {
      this.syncIntervals[type] = window.setInterval(() => {
        this.syncGateway(type);
      }, config.syncInterval * 60 * 1000);

      // Initial sync
      this.syncGateway(type);
    }
  }

  public async syncGateway(type: GatewayType) {
    const config = gatewayConfigService.getConfig(type);
    const status = this.syncStatus[type];

    await gatewayApiService.syncGateway(
      type,
      config,
      status,
      (updatedStatus) => {
        this.syncStatus[type] = updatedStatus;
        if (this.updater) this.updater(type, updatedStatus);
      }
    );
  }

  public getSyncStatus(type: GatewayType): SyncStatus {
    return this.syncStatus[type];
  }

  public setStatusUpdater(cb: StatusUpdater) {
    this.updater = cb;
  }
}

export const gatewaySyncScheduler = new GatewaySyncScheduler();

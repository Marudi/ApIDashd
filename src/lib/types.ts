
// Tyk API Gateway dashboard types

export interface ApiDefinition {
  id: string;
  name: string;
  listenPath: string;
  targetUrl: string;
  protocol: string;
  active: boolean;
  versioningInfo?: {
    enabled: boolean;
    versions: ApiVersion[];
  };
  authType: "none" | "token" | "jwt" | "oauth";
  rateLimit?: {
    rate: number;
    per: number;
    enabled: boolean;
  };
  quota?: {
    max: number;
    rate: number;
    per: number;
    enabled: boolean;
  };
  lastUpdated: string;
  createdAt: string;
}

export interface ApiVersion {
  name: string;
  id: string;
  expires?: string;
  paths?: {
    [key: string]: boolean;
  };
}

export interface Policy {
  id: string;
  name: string;
  active: boolean;
  apis: string[];
  rateLimit?: {
    rate: number;
    per: number;
    enabled: boolean;
  };
  quota?: {
    max: number;
    rate: number;
    per: number;
    enabled: boolean;
  };
  lastUpdated: string;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  keyHash: string;
  policyId?: string;
  expires?: string;
  lastUsed?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface AnalyticsData {
  total: number;
  successful: number;
  errored: number;
  avgLatency: number;
  timeframe: {
    start: string;
    end: string;
  };
  hourlyStats: {
    hour: number;
    requests: number;
    errors: number;
    latency: number;
  }[];
  topEndpoints: {
    path: string;
    method: string;
    hits: number;
    errors: number;
  }[];
  topErrors: {
    code: number;
    count: number;
    message: string;
  }[];
}

export interface SystemHealth {
  gatewayStatus: "healthy" | "warning" | "critical";
  gatewayVersion: string;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  apiCount: number;
  requestsPerSecond: number;
}

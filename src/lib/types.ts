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
  status: "active" | "inactive" | "revoked";  // Updated to include "revoked"
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

// Kong API Gateway types
export interface KongService {
  id: string;
  name: string;
  protocol: "http" | "https" | "grpc" | "grpcs" | "tcp" | "tls" | "udp";
  host: string;
  port: number;
  path?: string;
  retries?: number;
  connectTimeout?: number;
  writeTimeout?: number;
  readTimeout?: number;
  tags?: string[];
  enabled: boolean;
  createdAt: string;
}

export interface KongRoute {
  id: string;
  name: string;
  serviceId: string;
  protocols: ("http" | "https" | "grpc" | "grpcs" | "tcp" | "tls" | "udp")[];
  methods?: ("GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD")[];
  hosts?: string[];
  paths?: string[];
  headers?: Record<string, string[]>;
  tags?: string[];
  enabled: boolean;
  createdAt: string;
}

export interface KongPlugin {
  id: string;
  name: string;
  enabled: boolean;
  serviceId?: string;
  routeId?: string;
  consumerId?: string;
  config: Record<string, any>;
  tags?: string[];
  createdAt: string;
}

export interface KongConsumer {
  id: string;
  username: string;
  customId?: string;
  tags?: string[];
  createdAt: string;
}

export interface KongUpstream {
  id: string;
  name: string;
  algorithm?: "round-robin" | "consistent-hashing" | "least-connections";
  hashOn?: "none" | "consumer" | "ip" | "header" | "cookie";
  hashFallback?: "none" | "consumer" | "ip" | "header" | "cookie";
  hashOnHeader?: string;
  hashFallbackHeader?: string;
  slots?: number;
  healthchecks?: {
    active?: {
      concurrency?: number;
      healthy?: {
        httpStatuses?: number[];
        interval?: number;
        successes?: number;
      };
      httpPath?: string;
      timeout?: number;
      unhealthy?: {
        httpFailures?: number;
        httpStatuses?: number[];
        interval?: number;
        tcpFailures?: number;
        timeouts?: number;
      };
    };
    passive?: {
      healthy?: {
        httpStatuses?: number[];
        successes?: number;
      };
      unhealthy?: {
        httpFailures?: number;
        httpStatuses?: number[];
        tcpFailures?: number;
        timeouts?: number;
      };
    };
  };
  tags?: string[];
  createdAt: string;
}

export interface KongTarget {
  id: string;
  target: string;
  upstreamId: string;
  weight?: number;
  tags?: string[];
  createdAt: string;
}

export interface KongSystemHealth {
  status: "healthy" | "warning" | "critical";
  version: string;
  uptime: number;
  nodes: {
    id: string;
    name: string;
    status: "healthy" | "warning" | "critical";
    lastPing: string;
  }[];
  memoryUsage: number;
  databaseStatus: "connected" | "disconnected";
  activeConnections: number;
}


import { 
  ApiDefinition, 
  Policy, 
  ApiKey, 
  AnalyticsData,
  SystemHealth
} from "./types";

// Mock API Definitions
export const mockApis: ApiDefinition[] = [
  {
    id: "api1",
    name: "User Service API",
    listenPath: "/user-service/",
    targetUrl: "https://internal-user-service.example.com",
    protocol: "http",
    active: true,
    authType: "token",
    rateLimit: {
      rate: 100,
      per: 60,
      enabled: true
    },
    lastUpdated: "2023-10-15T14:32:21Z",
    createdAt: "2023-08-02T09:15:43Z"
  },
  {
    id: "api2",
    name: "Payment Gateway API",
    listenPath: "/payments/",
    targetUrl: "https://payments.example.com",
    protocol: "https",
    active: true,
    authType: "jwt",
    versioningInfo: {
      enabled: true,
      versions: [
        { name: "v1", id: "v1" },
        { name: "v2", id: "v2" }
      ]
    },
    rateLimit: {
      rate: 50,
      per: 60,
      enabled: true
    },
    lastUpdated: "2023-11-18T11:22:03Z",
    createdAt: "2023-07-14T15:42:11Z"
  },
  {
    id: "api3",
    name: "Analytics API",
    listenPath: "/analytics/",
    targetUrl: "https://analytics.internal.example.com",
    protocol: "https",
    active: false,
    authType: "oauth",
    quota: {
      max: 10000,
      rate: 10000,
      per: 86400,
      enabled: true
    },
    lastUpdated: "2023-12-05T09:11:43Z",
    createdAt: "2023-09-22T13:45:33Z"
  },
  {
    id: "api4",
    name: "Product Catalog API",
    listenPath: "/products/",
    targetUrl: "https://catalog.example.com",
    protocol: "https",
    active: true,
    authType: "none",
    lastUpdated: "2024-01-12T16:02:56Z",
    createdAt: "2023-10-30T10:25:19Z"
  },
  {
    id: "api5",
    name: "Notification Service",
    listenPath: "/notifications/",
    targetUrl: "https://notifications.example.com",
    protocol: "https",
    active: true,
    authType: "token",
    rateLimit: {
      rate: 200,
      per: 60,
      enabled: true
    },
    lastUpdated: "2024-02-01T14:35:22Z",
    createdAt: "2023-11-15T09:18:42Z"
  }
];

// Mock Policies
export const mockPolicies: Policy[] = [
  {
    id: "pol1",
    name: "Standard API Access",
    active: true,
    apis: ["api1", "api4"],
    rateLimit: {
      rate: 60,
      per: 60,
      enabled: true
    },
    lastUpdated: "2023-12-12T09:32:11Z",
    createdAt: "2023-08-15T14:22:33Z"
  },
  {
    id: "pol2",
    name: "Premium API Access",
    active: true,
    apis: ["api1", "api2", "api4", "api5"],
    rateLimit: {
      rate: 300,
      per: 60,
      enabled: true
    },
    quota: {
      max: 100000,
      rate: 100000,
      per: 86400,
      enabled: true
    },
    lastUpdated: "2024-01-05T11:15:42Z",
    createdAt: "2023-09-10T16:45:21Z"
  },
  {
    id: "pol3",
    name: "Internal Services",
    active: true,
    apis: ["api1", "api2", "api3", "api4", "api5"],
    lastUpdated: "2024-02-02T15:42:18Z",
    createdAt: "2023-10-20T13:11:35Z"
  }
];

// Mock API Keys
export const mockApiKeys: ApiKey[] = [
  {
    id: "key1",
    keyHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    policyId: "pol1",
    status: "active",
    createdAt: "2023-09-15T10:22:33Z"
  },
  {
    id: "key2",
    keyHash: "60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752",
    policyId: "pol2",
    expires: "2024-09-01T00:00:00Z",
    lastUsed: "2024-03-15T14:22:18Z",
    status: "active",
    createdAt: "2023-09-01T09:15:27Z"
  },
  {
    id: "key3",
    keyHash: "fd61a03af4f77d870fc21e05e7e80678095c92d808cfb3b5c279ee04c74aca13",
    policyId: "pol3",
    lastUsed: "2024-03-20T11:42:53Z",
    status: "active",
    createdAt: "2023-10-12T15:33:21Z"
  },
  {
    id: "key4",
    keyHash: "a4e624d686e03ed2767c0abd85c14426b0b1157d2ce81d27bb4fe4f6f01d688a",
    policyId: "pol1",
    lastUsed: "2024-02-28T09:12:05Z",
    status: "inactive",
    createdAt: "2023-11-05T14:25:16Z"
  }
];

// Mock Analytics Data
export const mockAnalytics: AnalyticsData = {
  total: 157842,
  successful: 152103,
  errored: 5739,
  avgLatency: 142,
  timeframe: {
    start: "2024-03-01T00:00:00Z",
    end: "2024-03-21T23:59:59Z"
  },
  hourlyStats: [
    { hour: 0, requests: 1523, errors: 42, latency: 132 },
    { hour: 1, requests: 1022, errors: 31, latency: 128 },
    { hour: 2, requests: 845, errors: 22, latency: 125 },
    { hour: 3, requests: 742, errors: 18, latency: 121 },
    { hour: 4, requests: 691, errors: 15, latency: 122 },
    { hour: 5, requests: 983, errors: 27, latency: 124 },
    { hour: 6, requests: 2341, errors: 78, latency: 135 },
    { hour: 7, requests: 4521, errors: 165, latency: 145 },
    { hour: 8, requests: 7842, errors: 298, latency: 156 },
    { hour: 9, requests: 9853, errors: 387, latency: 162 },
    { hour: 10, requests: 10215, errors: 412, latency: 168 },
    { hour: 11, requests: 9856, errors: 376, latency: 165 },
    { hour: 12, requests: 9234, errors: 342, latency: 159 },
    { hour: 13, requests: 10342, errors: 398, latency: 164 },
    { hour: 14, requests: 11532, errors: 432, latency: 172 },
    { hour: 15, requests: 12453, errors: 487, latency: 178 },
    { hour: 16, requests: 10234, errors: 398, latency: 165 },
    { hour: 17, requests: 9567, errors: 376, latency: 158 },
    { hour: 18, requests: 8752, errors: 312, latency: 152 },
    { hour: 19, requests: 7981, errors: 287, latency: 146 },
    { hour: 20, requests: 7234, errors: 245, latency: 142 },
    { hour: 21, requests: 6532, errors: 213, latency: 138 },
    { hour: 22, requests: 5123, errors: 176, latency: 134 },
    { hour: 23, requests: 2874, errors: 98, latency: 130 }
  ],
  topEndpoints: [
    { path: "/user-service/login", method: "POST", hits: 32145, errors: 542 },
    { path: "/products/catalog", method: "GET", hits: 28976, errors: 321 },
    { path: "/payments/process", method: "POST", hits: 15432, errors: 876 },
    { path: "/user-service/profile", method: "GET", hits: 14321, errors: 125 },
    { path: "/notifications/send", method: "POST", hits: 12543, errors: 432 }
  ],
  topErrors: [
    { code: 429, count: 1876, message: "Rate limit exceeded" },
    { code: 403, count: 1243, message: "Unauthorized access" },
    { code: 500, count: 987, message: "Internal server error" },
    { code: 404, count: 843, message: "Endpoint not found" },
    { code: 400, count: 790, message: "Bad request format" }
  ]
};

// Mock System Health
export const mockSystemHealth: SystemHealth = {
  gatewayStatus: "healthy",
  gatewayVersion: "v4.3.1",
  uptime: 1547895, // seconds
  cpuUsage: 32.4,
  memoryUsage: 42.7,
  apiCount: 5,
  requestsPerSecond: 105.3
};

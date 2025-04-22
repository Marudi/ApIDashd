
import { ApiDefinition } from "./types";

// Kong Gateway Mocks
export const kongApis: ApiDefinition[] = [
  {
    id: "k1",
    name: "User Service API",
    listenPath: "/users",
    targetUrl: "http://user-service:8080",
    protocol: "http",
    active: true,
    authType: "jwt",
    lastUpdated: "2025-03-15T10:30:00Z",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "k2",
    name: "Product Catalog API",
    listenPath: "/products",
    targetUrl: "http://product-service:8081",
    protocol: "http",
    active: true,
    authType: "token",
    lastUpdated: "2025-03-14T15:45:00Z",
    createdAt: "2025-01-14T15:45:00Z",
  },
  {
    id: "k3",
    name: "Payment Processing API",
    listenPath: "/payments",
    targetUrl: "http://payment-service:8082",
    protocol: "https",
    active: true,
    authType: "oauth",
    lastUpdated: "2025-03-10T09:20:00Z",
    createdAt: "2025-01-10T09:20:00Z",
  },
  {
    id: "k4",
    name: "Analytics API",
    listenPath: "/analytics",
    targetUrl: "http://analytics-service:8083",
    protocol: "http",
    active: false,
    authType: "none",
    lastUpdated: "2025-02-28T11:15:00Z",
    createdAt: "2025-01-28T11:15:00Z",
  }
];

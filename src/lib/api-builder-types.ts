
import { Node, Edge } from 'reactflow';
import { ApiDefinition } from './types';

// API Builder Types
export type ApiNodeType = 'input' | 'endpoint' | 'transform' | 'auth' | 'ratelimit' | 'cache' | 'mock' | 'validator' | 'output';

export interface ApiNodeData {
  label: string;
  method?: string;
  path?: string;
  url?: string;
  // Updated to match ApiDefinition's authType
  authType?: ApiDefinition['authType'];
  authConfig?: {
    apiKeyName?: string;
    apiKeyLocation?: 'header' | 'query';
    username?: string;
    password?: string;
    jwtSecret?: string;
  };
  transformType?: 'json' | 'xml' | 'text' | 'custom';
  transformScript?: string;
  rate?: number;
  per?: number;
  ttl?: number;
  keyTemplate?: string;
  validationType?: 'json-schema' | 'regex' | 'custom';
  schema?: string;
  pattern?: string;
  mockResponse?: {
    statusCode: number;
    headers?: Record<string, string>;
    body: string;
  };
  cacheConfig?: {
    ttl: number;
    keyTemplate: string;
    allowStale?: boolean;
    staleTimeout?: number;
  };
  headers?: Array<{ key: string; value: string }>;
  statusCode?: number;
  name?: string;
  description?: string;
  [key: string]: any;
}

// Updated to use Node type from ReactFlow directly to avoid type conflicts
export type ApiNode = Node<ApiNodeData>;
export type ApiEdge = Edge;

export interface ApiFlow {
  id: string;
  name: string;
  nodes: ApiNode[];
  edges: ApiEdge[];
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  published: boolean;
}

export interface ActiveCollaborator {
  id: string;
  name: string;
  avatarUrl?: string;
  color: string;
  cursorPosition?: {
    x: number;
    y: number;
  };
  lastActive: Date;
}

export interface ApiNodeTypeConfig {
  type: ApiNodeType;
  label: string;
  description: string;
  color: string;
  icon: string;
  allowedConnections: ApiNodeType[];
  defaultData: Partial<ApiNodeData>;
}

// Update this interface to align with ReactFlow's NodeProps
export interface ApiBuilderNodeProps {
  id: string;
  type: string; // Changed from ApiNodeType to string to match ReactFlow's NodeProps
  data: ApiNodeData;
  selected: boolean;
  isConnectable?: boolean; // Optional prop from ReactFlow
}

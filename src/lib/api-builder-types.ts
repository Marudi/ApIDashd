
// API Builder Types
export interface ApiNode {
  id: string;
  type: 'input' | 'endpoint' | 'transform' | 'auth' | 'ratelimit' | 'cache' | 'mock' | 'validator' | 'output';
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    [key: string]: any;
  };
}

export interface ApiEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

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
  type: ApiNode['type'];
  label: string;
  description: string;
  color: string;
  icon: string;
  allowedConnections: ApiNode['type'][];
  defaultData: Partial<ApiNode['data']>;
}

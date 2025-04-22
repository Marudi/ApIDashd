
import { Node, Edge } from 'reactflow';

// API Builder Types
export type ApiNodeType = 'input' | 'endpoint' | 'transform' | 'auth' | 'ratelimit' | 'cache' | 'mock' | 'validator' | 'output';

export interface ApiNodeData {
  label: string;
  [key: string]: any;
}

export type ApiNode = Node<ApiNodeData, ApiNodeType>;
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

export interface ApiBuilderNodeProps {
  data: ApiNodeData;
  type: ApiNodeType;
  selected: boolean;
  isConnectable: boolean;
}

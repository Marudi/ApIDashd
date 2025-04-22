
import { Node, Edge } from 'reactflow';

// API Builder Types
export type ApiNodeType = 'input' | 'endpoint' | 'transform' | 'auth' | 'ratelimit' | 'cache' | 'mock' | 'validator' | 'output';

export interface ApiNodeData {
  label: string;
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

// This is now properly aligned with ReactFlow's NodeProps
export interface ApiBuilderNodeProps {
  data: ApiNodeData;
  selected: boolean;
  isConnectable: boolean;
  id: string;
  type: string;
}

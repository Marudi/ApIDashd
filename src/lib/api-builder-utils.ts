
import { XYPosition } from 'reactflow';
import { ApiFlow, ApiNode, ApiEdge, ApiNodeTypeConfig, ApiNodeType, ApiNodeData } from './api-builder-types';

// Node type configurations with their default properties
export const nodeTypes: Record<ApiNodeType, ApiNodeTypeConfig> = {
  input: {
    type: 'input',
    label: 'API Trigger',
    description: 'Starting point for your API flow',
    color: '#0BA5D3',
    icon: 'play',
    allowedConnections: ['transform', 'auth', 'validator', 'endpoint'],
    defaultData: {
      label: 'Start',
      method: 'GET',
      path: '/api/v1',
    }
  },
  endpoint: {
    type: 'endpoint',
    label: 'Endpoint',
    description: 'Connect to an external API or service',
    color: '#22c55e',
    icon: 'server',
    allowedConnections: ['transform', 'validator', 'output', 'cache'],
    defaultData: {
      label: 'Endpoint',
      url: 'https://api.example.com',
      method: 'GET',
      headers: [],
    }
  },
  transform: {
    type: 'transform',
    label: 'Transform',
    description: 'Modify request or response data',
    color: '#f59e0b',
    icon: 'repeat',
    allowedConnections: ['endpoint', 'auth', 'validator', 'output', 'transform'],
    defaultData: {
      label: 'Transform',
      transformType: 'json',
      transformScript: '',
    }
  },
  auth: {
    type: 'auth',
    label: 'Authentication',
    description: 'Add authentication to your API',
    color: '#8b5cf6',
    icon: 'shield',
    allowedConnections: ['endpoint', 'transform', 'validator'],
    defaultData: {
      label: 'Auth',
      authType: 'token',
      tokenLocation: 'header',
    }
  },
  ratelimit: {
    type: 'ratelimit',
    label: 'Rate Limit',
    description: 'Limit the number of requests',
    color: '#ec4899',
    icon: 'timer',
    allowedConnections: ['endpoint', 'auth', 'transform', 'validator', 'output'],
    defaultData: {
      label: 'Rate Limit',
      rate: 100,
      per: 60,
    }
  },
  cache: {
    type: 'cache',
    label: 'Cache',
    description: 'Cache responses for performance',
    color: '#06b6d4',
    icon: 'database',
    allowedConnections: ['output', 'transform'],
    defaultData: {
      label: 'Cache',
      ttl: 300,
      keyTemplate: '{{method}}-{{path}}',
    }
  },
  mock: {
    type: 'mock',
    label: 'Mock Response',
    description: 'Generate mock responses for testing',
    color: '#64748b',
    icon: 'code',
    allowedConnections: ['output', 'transform'],
    defaultData: {
      label: 'Mock',
      responseCode: 200,
      responseBody: '{"message": "Mock response"}',
    }
  },
  validator: {
    type: 'validator',
    label: 'Validator',
    description: 'Validate request or response data',
    color: '#e11d48',
    icon: 'check-circle',
    allowedConnections: ['endpoint', 'transform', 'output'],
    defaultData: {
      label: 'Validator',
      validationType: 'json-schema',
      schema: '',
    }
  },
  output: {
    type: 'output',
    label: 'Response',
    description: 'Configure the API response',
    color: '#6366f1',
    icon: 'arrow-left',
    allowedConnections: [],
    defaultData: {
      label: 'Response',
      statusCode: 200,
      headers: [],
    }
  },
};

// Generate a random color for user collaboration
export const getRandomColor = () => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#16a34a', 
    '#0ea5e9', '#8b5cf6', '#c026d3', '#ec4899'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate a unique ID for nodes and edges
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Create a new node with default properties
export const createNode = (
  type: ApiNodeType, 
  position: XYPosition,
  label?: string
): ApiNode => {
  const nodeType = nodeTypes[type];
  return {
    id: generateId(),
    type,
    position,
    data: {
      ...nodeType.defaultData,
      label: label || nodeType.defaultData.label || nodeType.label,
    }
  };
};

// Check if a connection between nodes is valid
export const isValidConnection = (sourceType: string, targetType: string) => {
  // Check if both types are valid ApiNodeTypes before proceeding
  if (!nodeTypes[sourceType as ApiNodeType] || !nodeTypes[targetType as ApiNodeType]) {
    return false;
  }
  
  const sourceNodeType = nodeTypes[sourceType as ApiNodeType];
  return sourceNodeType.allowedConnections.includes(targetType as ApiNodeType);
};

// Convert an API flow to a Tyk API definition
export const convertFlowToApiDefinition = (flow: ApiFlow) => {
  // This would implement the logic to convert the visual flow to a Tyk API definition
  // For now, we're returning a placeholder structure
  return {
    id: flow.id,
    name: flow.name,
    listenPath: flow.nodes.find(node => node.type === 'input')?.data.path || '/api/v1',
    targetUrl: flow.nodes.find(node => node.type === 'endpoint')?.data.url || 'https://api.example.com',
    protocol: 'http',
    active: false,
    authType: flow.nodes.find(node => node.type === 'auth')?.data.authType || 'none',
    rateLimit: flow.nodes.find(node => node.type === 'ratelimit')?.data ? {
      rate: flow.nodes.find(node => node.type === 'ratelimit')?.data.rate || 100,
      per: flow.nodes.find(node => node.type === 'ratelimit')?.data.per || 60,
      enabled: true,
    } : undefined,
    lastUpdated: new Date().toISOString(),
    createdAt: flow.createdAt,
  };
};

// Create an empty API flow template
export const createEmptyFlow = (userId: string, name = 'New API Flow'): ApiFlow => {
  const now = new Date().toISOString();
  const startNode = createNode('input', { x: 250, y: 100 });
  const endNode = createNode('output', { x: 250, y: 300 });

  return {
    id: generateId(),
    name,
    nodes: [startNode, endNode],
    edges: [{
      id: generateId(),
      source: startNode.id,
      target: endNode.id,
      animated: true,
    }],
    createdBy: userId,
    createdAt: now,
    lastUpdated: now,
    published: false,
  };
};

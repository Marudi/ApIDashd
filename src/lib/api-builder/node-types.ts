
import { ApiNodeType, ApiNodeTypeConfig } from '../api-builder-types';

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
      authType: 'apikey',  // Changed from 'token' to 'apikey' to match allowed types
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

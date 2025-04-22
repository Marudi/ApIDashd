
import { ApiFlow } from '../api-builder-types';
import { createNode, generateId } from './node-utils';

// Convert an API flow to a Tyk API definition
export const convertFlowToApiDefinition = (flow: ApiFlow) => {
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


import { XYPosition } from 'reactflow';
import { ApiNode, ApiNodeData, ApiNodeType } from '../api-builder-types';
import { nodeTypes } from './node-types';

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

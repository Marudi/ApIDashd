
import { Position, XYPosition } from 'reactflow';
import { ApiNodeData, ApiNodeType } from '../api-builder-types';

export const createNode = (type: ApiNodeType, position: XYPosition, label?: string) => ({
  id: `${type}-${Date.now()}`,
  type,
  position,
  data: {
    label: label || type.charAt(0).toUpperCase() + type.slice(1),
  } as ApiNodeData,
});


import { ApiNodeData } from '@/lib/api-builder-types';
import { ApiBuilderNode } from '@/components/api-builder/ApiBuilderNode';
import { NodeTypes, ConnectionLineType } from 'reactflow';

export const nodeTypes: NodeTypes = {
  input: ApiBuilderNode,
  endpoint: ApiBuilderNode,
  transform: ApiBuilderNode,
  auth: ApiBuilderNode,
  ratelimit: ApiBuilderNode,
  cache: ApiBuilderNode,
  mock: ApiBuilderNode,
  validator: ApiBuilderNode,
  output: ApiBuilderNode,
};

export const flowConfig = {
  snapToGrid: true,
  snapGrid: [15, 15],
  connectionLineType: ConnectionLineType.SmoothStep,
  proOptions: { hideAttribution: true },
  deleteKeyCode: "Delete",
  minZoom: 0.2,
  maxZoom: 4,
};

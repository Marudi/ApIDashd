
import { ConnectionLineType } from 'reactflow';

export const flowConfig = {
  snapToGrid: true,
  snapGrid: [15, 15] as [number, number],
  connectionLineType: ConnectionLineType.SmoothStep,
  proOptions: { hideAttribution: true },
  deleteKeyCode: "Delete",
  minZoom: 0.2,
  maxZoom: 4,
  fitViewOptions: {
    padding: 0.1,
    duration: 800,
  },
  defaultEdgeOptions: { 
    type: 'smoothstep',
    animated: false,
  },
};

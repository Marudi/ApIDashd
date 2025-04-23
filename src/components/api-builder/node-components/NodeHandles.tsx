
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface NodeHandlesProps {
  type: string;
}

export const NodeHandles = memo(function NodeHandles({ type }: NodeHandlesProps) {
  return (
    <>
      {/* Input handle (not for input nodes) */}
      {type !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555', width: 10, height: 10 }}
          className="!border-2 !border-background"
        />
      )}

      {/* Output handle (not for output nodes) */}
      {type !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#555', width: 10, height: 10 }}
          className="!border-2 !border-background"
        />
      )}
    </>
  );
});

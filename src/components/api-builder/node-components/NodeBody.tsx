
import { memo } from 'react';
import { ApiNodeData } from '@/lib/api-builder-types';

interface NodeBodyProps {
  data: ApiNodeData;
  type: string;
}

export const NodeBody = memo(function NodeBody({ data, type }: NodeBodyProps) {
  return (
    <div className="bg-card p-3 rounded-b-md">
      <div className="text-sm">
        {data.name || data.label || `${type} Node`}
      </div>
      {data.description && (
        <div className="text-xs text-muted-foreground mt-1">
          {data.description}
        </div>
      )}
    </div>
  );
});

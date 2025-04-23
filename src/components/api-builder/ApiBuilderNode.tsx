import { memo, useCallback } from 'react';
import { NodeProps } from 'reactflow';
import { ApiNodeData, ApiNodeType } from '@/lib/api-builder-types';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator 
} from "@/components/ui/context-menu";
import { Copy, Trash, Settings } from 'lucide-react';
import { NodeHeader } from './node-components/NodeHeader';
import { NodeBody } from './node-components/NodeBody';
import { NodeHandles } from './node-components/NodeHandles';
import { DragHandle } from './node-components/DragHandle';
import { NodeSettings } from './node-components/NodeSettings';
import { useNodeConfig } from '@/hooks/useNodeConfig';

interface ApiBuilderNodeComponentProps extends NodeProps<ApiNodeData> {
  onDuplicate?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
}

function ApiBuilderNodeComponent(props: ApiBuilderNodeComponentProps) {
  const { id, type, data, selected, onDuplicate, onDelete } = props;
  const { openNodeConfig } = useNodeConfig();
  const nodeType = type as ApiNodeType;

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(id);
    }
  }, [id, onDelete]);

  const handleDuplicate = useCallback(() => {
    if (onDuplicate) {
      onDuplicate(id);
    }
  }, [id, onDuplicate]);

  const handleSettings = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); 
    openNodeConfig({
      id,
      type: nodeType,
      data,
      position: { x: 0, y: 0 },
      selected,
    });
  }, [id, nodeType, data, selected, openNodeConfig]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="rounded-md shadow-md relative"
          data-id={id}
        >
          <div>
            <div className="drag-handle-wrapper">
              <DragHandle />
              <NodeSettings 
                nodeType={nodeType}
                onSettings={handleSettings}
                data={data}
              />
            </div>

            <div className={`min-w-[180px] max-w-[280px] ${
              selected ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}>
              <NodeHeader 
                type={type} 
                nodeType={nodeType}
              />
              <NodeBody 
                data={data} 
                type={type}
              />
            </div>

            <NodeHandles type={type} />
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete} className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const ApiBuilderNode = memo(ApiBuilderNodeComponent);
export { ApiBuilderNode };

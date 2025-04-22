
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ApiNodeData, ApiNodeType } from '@/lib/api-builder-types';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator 
} from "@/components/ui/context-menu";
import { Copy, Trash, Settings } from 'lucide-react';
import { SettingsButton } from './node-controls/SettingsButton';
import { useNodeConfig } from '@/hooks/useNodeConfig';

interface ApiBuilderNodeProps {
  id: string;
  type: ApiNodeType;
  data: ApiNodeData;
  selected: boolean;
}

function ApiBuilderNodeComponent({ id, type, data, selected }: ApiBuilderNodeProps) {
  const { openNodeConfig } = useNodeConfig();
  
  const getNodeColor = (nodeType: ApiNodeType) => {
    const colors = {
      input: 'bg-blue-500',
      endpoint: 'bg-green-500',
      transform: 'bg-purple-500',
      auth: 'bg-amber-500',
      ratelimit: 'bg-rose-500',
      cache: 'bg-cyan-500',
      mock: 'bg-indigo-500',
      validator: 'bg-orange-500',
      output: 'bg-emerald-500',
    };
    
    return colors[nodeType] || 'bg-gray-500';
  };

  const handleDelete = () => {
    // This would be implemented in a real application
    console.log('Delete node:', id);
  };

  const handleDuplicate = () => {
    // This would be implemented in a real application
    console.log('Duplicate node:', id);
  };

  const handleSettings = () => {
    openNodeConfig({
      id,
      type,
      data,
      position: { x: 0, y: 0 },
      selected: selected,
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`nodrag rounded-md shadow-md transition-all ${
            selected ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
        >
          <div className="min-w-[180px] max-w-[280px]">
            <div className={`${getNodeColor(type)} text-white p-2 rounded-t-md flex justify-between items-center`}>
              <span className="font-medium capitalize">{type}</span>
              <div>
                <SettingsButton 
                  nodeType={type} 
                  onClick={handleSettings} 
                  size="sm" 
                  variant="ghost" 
                />
              </div>
            </div>
            <div className="bg-card p-3 rounded-b-md">
              <div className="text-sm">
                {data.name || `${type} Node`}
              </div>
              {data.description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {data.description}
                </div>
              )}
            </div>
          </div>

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

// Memoize to prevent unnecessary re-renders
const ApiBuilderNode = memo(ApiBuilderNodeComponent);
export { ApiBuilderNode };

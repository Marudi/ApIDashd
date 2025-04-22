
import { useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Check, Code, Database, Play, Repeat, Server, Settings, Shield, Timer, Copy, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { nodeTypes } from "@/lib/api-builder-utils";
import { Badge } from "@/components/ui/badge";
import { ApiNodeData, ApiNodeType } from "@/lib/api-builder-types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useApiNode } from "@/hooks/useApiNode";

// Using NodeProps directly from ReactFlow
export function ApiBuilderNode({ data, selected, isConnectable, type, id }: NodeProps<ApiNodeData>) {
  const nodeType = type as string;
  const nodeConfig = nodeTypes[nodeType as ApiNodeType] || nodeTypes['input']; // Fallback to input if type is unknown
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();
  const { duplicateNode, deleteNode } = useApiNode();

  // Map node types to their respective icons
  const getNodeIcon = () => {
    switch (nodeType) {
      case 'input':
        return <Play className="h-4 w-4" />;
      case 'endpoint':
        return <Server className="h-4 w-4" />;
      case 'transform':
        return <Repeat className="h-4 w-4" />;
      case 'auth':
        return <Shield className="h-4 w-4" />;
      case 'ratelimit':
        return <Timer className="h-4 w-4" />;
      case 'cache':
        return <Database className="h-4 w-4" />;
      case 'mock':
        return <Code className="h-4 w-4" />;
      case 'validator':
        return <Check className="h-4 w-4" />;
      case 'output':
        return <Settings className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const handleDuplicate = () => {
    duplicateNode(id);
    toast({
      title: "Node Duplicated",
      description: `Duplicated ${data.label} node`,
    });
  };

  const handleDelete = () => {
    deleteNode(id);
    toast({
      title: "Node Deleted",
      description: `Deleted ${data.label} node`,
    });
  };

  return (
    <div
      className={cn(
        "min-w-[180px] max-w-[250px] border rounded-md shadow-sm bg-card transition-all",
        selected && "ring-2 ring-primary",
        isExpanded && "min-h-[150px]"
      )}
      style={{ borderColor: nodeConfig.color }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Input handle - only shown if node has incoming connections allowed */}
      {nodeType !== 'input' && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-primary !h-3 !w-3 !border-2"
        />
      )}

      {/* Node header */}
      <div 
        className="flex items-center justify-between p-3 border-b cursor-pointer"
        style={{ backgroundColor: `${nodeConfig.color}20` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md" style={{ backgroundColor: nodeConfig.color }}>
            {getNodeIcon()}
          </div>
          <div className="font-medium text-sm truncate max-w-[100px]" title={data.label}>
            {data.label}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {nodeConfig.label}
        </Badge>
      </div>

      {/* Node content - shown when expanded */}
      {isExpanded && (
        <div className="p-3 text-xs space-y-2">
          {nodeType === 'input' && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span>{data.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Path:</span>
                <span className="font-mono truncate max-w-[120px]" title={data.path}>{data.path}</span>
              </div>
            </>
          )}

          {nodeType === 'endpoint' && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL:</span>
                <span className="font-mono truncate max-w-[120px]" title={data.url}>{data.url}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span>{data.method}</span>
              </div>
            </>
          )}

          {nodeType === 'auth' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{data.authType}</span>
            </div>
          )}

          {nodeType === 'ratelimit' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Limit:</span>
              <span>{data.rate} per {data.per}s</span>
            </div>
          )}

          {nodeType === 'cache' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">TTL:</span>
              <span>{data.ttl}s</span>
            </div>
          )}

          {nodeType === 'output' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span>{data.statusCode}</span>
            </div>
          )}
          
          <div className="flex justify-end gap-1 pt-2">
            <Button variant="ghost" size="icon" onClick={handleDuplicate} className="h-6 w-6">
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="h-6 w-6 text-destructive">
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Output handle - only shown if node has outgoing connections allowed */}
      {nodeType !== 'output' && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!bg-primary !h-3 !w-3 !border-2"
        />
      )}
    </div>
  );
}


import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Check, Code, Database, Play, Repeat, Server, Settings, Shield, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { nodeTypes } from "@/lib/api-builder-utils";
import { Badge } from "@/components/ui/badge";
import { ApiNode } from "@/lib/api-builder-types";

interface ApiBuilderNodeProps {
  data: ApiNode['data'];
  type: ApiNode['type'];
  selected: boolean;
  isConnectable: boolean;
}

export function ApiBuilderNode({ data, type, selected, isConnectable }: ApiBuilderNodeProps) {
  const nodeConfig = nodeTypes[type];
  const [isExpanded, setIsExpanded] = useState(false);

  // Map node types to their respective icons
  const getNodeIcon = () => {
    switch (type) {
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

  return (
    <div
      className={cn(
        "min-w-[200px] border rounded-md shadow-sm bg-card transition-all",
        selected && "ring-2 ring-primary",
        isExpanded && "min-h-[150px]"
      )}
      style={{ borderColor: nodeConfig.color }}
    >
      {/* Input handle - only shown if node has incoming connections allowed */}
      {type !== 'input' && (
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
          <div className="font-medium text-sm">{data.label}</div>
        </div>
        <Badge variant="outline" className="text-xs">
          {nodeConfig.label}
        </Badge>
      </div>

      {/* Node content - shown when expanded */}
      {isExpanded && (
        <div className="p-3 text-xs space-y-2">
          {type === 'input' && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span>{data.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Path:</span>
                <span className="font-mono">{data.path}</span>
              </div>
            </>
          )}

          {type === 'endpoint' && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL:</span>
                <span className="font-mono truncate max-w-[120px]">{data.url}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method:</span>
                <span>{data.method}</span>
              </div>
            </>
          )}

          {type === 'auth' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{data.authType}</span>
            </div>
          )}

          {type === 'ratelimit' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Limit:</span>
              <span>{data.rate} per {data.per}s</span>
            </div>
          )}

          {type === 'cache' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">TTL:</span>
              <span>{data.ttl}s</span>
            </div>
          )}

          {type === 'output' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span>{data.statusCode}</span>
            </div>
          )}
        </div>
      )}

      {/* Output handle - only shown if node has outgoing connections allowed */}
      {type !== 'output' && (
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

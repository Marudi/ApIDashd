
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { nodeTypes } from "@/lib/api-builder/node-types";
import { Check, Code, Database, Play, Repeat, Server, Settings, Shield, Timer } from "lucide-react";

interface NodeToolbarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodeToolbar({ onDragStart }: NodeToolbarProps) {
  // Get node icon based on type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'input':
        return <Play className="h-4 w-4 text-white" />;
      case 'endpoint':
        return <Server className="h-4 w-4 text-white" />;
      case 'transform':
        return <Repeat className="h-4 w-4 text-white" />;
      case 'auth':
        return <Shield className="h-4 w-4 text-white" />;
      case 'ratelimit':
        return <Timer className="h-4 w-4 text-white" />;
      case 'cache':
        return <Database className="h-4 w-4 text-white" />;
      case 'mock':
        return <Code className="h-4 w-4 text-white" />;
      case 'validator':
        return <Check className="h-4 w-4 text-white" />;
      case 'output':
        return <Settings className="h-4 w-4 text-white" />;
      default:
        return <Settings className="h-4 w-4 text-white" />;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Components</CardTitle>
        <CardDescription>Drag and drop components to build your API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(nodeTypes).map(([type, config]) => (
            <div
              key={type}
              className="flex flex-col items-center p-2 border rounded-md cursor-move hover:bg-accent transition-colors"
              draggable
              onDragStart={(event) => onDragStart(event, type)}
            >
              <div className="p-2 rounded-full mb-2" style={{ backgroundColor: config.color }}>
                {getNodeIcon(type)}
              </div>
              <span className="text-xs font-medium">{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

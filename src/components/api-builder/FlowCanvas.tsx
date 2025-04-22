import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  BackgroundVariant,
  Controls, 
  Panel, 
  useReactFlow, 
  Node, 
  Edge, 
  Connection, 
  NodeTypes,
  ConnectionLineType,
  ControlButton,
} from 'reactflow';
import { ApiNodeData } from '@/lib/api-builder-types';
import { createNode } from '@/lib/api-builder-utils';
import { ActiveCollaborator } from '@/lib/api-builder-types';
import { ApiBuilderNode } from '@/components/api-builder/ApiBuilderNode';
import { Download, Save, ZoomIn, ZoomOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

interface FlowCanvasProps {
  nodes: Node<ApiNodeData>[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: any) => void;
  collaborators: ActiveCollaborator[];
  currentUserId: string;
  onSave?: () => void;
}

const nodeTypes: NodeTypes = {
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

export function FlowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setNodes,
  collaborators,
  currentUserId,
  onSave,
}: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleResize = () => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [reactFlowInstance]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = createNode(type as any, position);
      setNodes((nds: Node[]) => nds.concat(newNode));
      
      toast({
        title: 'Node Added',
        description: `Added new ${type} node to your flow`,
      });
    },
    [reactFlowInstance, setNodes]
  );

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
    }
  }, [onSave]);

  const handleExport = useCallback(() => {
    if (reactFlowInstance) {
      const flowData = reactFlowInstance.toObject();
      const jsonString = JSON.stringify(flowData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'api-flow.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Flow Exported',
        description: 'Your API flow has been exported as JSON',
      });
    }
  }, [reactFlowInstance]);

  return (
    <div className="col-span-3 h-full border rounded-md bg-accent/5 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        connectionLineType={ConnectionLineType.SmoothStep}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={4}
      >
        <Background 
          color="#aaa" 
          gap={16} 
          size={1} 
          variant={BackgroundVariant.Dots}
        />
        <Controls showInteractive={false}>
          <ControlButton onClick={handleSave} title="Save Flow">
            <Save className="h-4 w-4" />
          </ControlButton>
          <ControlButton onClick={handleExport} title="Export Flow">
            <Download className="h-4 w-4" />
          </ControlButton>
        </Controls>
        
        <Panel position="top-left" className="bg-background/80 p-2 rounded-md backdrop-blur-sm">
          {isMobile ? (
            <div className="text-xs text-muted-foreground">
              Drag nodes from sidebar to build your API
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Drag nodes onto the canvas • Use Ctrl/Cmd+S to save
            </div>
          )}
        </Panel>
        
        <Panel position="top-right">
          {collaborators
            .filter(user => user.id !== currentUserId && user.cursorPosition)
            .map(user => (
              <div
                key={user.id}
                className="absolute pointer-events-none"
                style={{
                  left: user.cursorPosition?.x,
                  top: user.cursorPosition?.y,
                  zIndex: 10,
                }}
              >
                <div className="flex flex-col items-start">
                  <div 
                    className="h-5 w-5 transform rotate-45"
                    style={{ backgroundColor: user.color }}
                  />
                  <span 
                    className="text-xs px-1 rounded text-white -mt-1"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name}
                  </span>
                </div>
              </div>
            ))}
        </Panel>
      </ReactFlow>
    </div>
  );
}

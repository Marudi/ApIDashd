import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  BackgroundVariant,
  useReactFlow, 
  Node, 
  Edge, 
  Connection, 
  NodeTypes,
  ConnectionLineType,
} from 'reactflow';
import { ApiNodeData } from '@/lib/api-builder-types';
import { createNode } from '@/lib/api-builder-utils';
import { ActiveCollaborator } from '@/lib/api-builder-types';
import { ApiBuilderNode } from '@/components/api-builder/ApiBuilderNode';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';
import { FlowControls } from './flow-controls/FlowControls';
import { InstructionsPanel } from './flow-panels/InstructionsPanel';
import { CollaboratorsPanel } from './flow-panels/CollaboratorsPanel';

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
        <FlowControls onSave={handleSave} onExport={handleExport} />
        <InstructionsPanel isMobile={isMobile} />
        <CollaboratorsPanel 
          collaborators={collaborators}
          currentUserId={currentUserId}
        />
      </ReactFlow>
    </div>
  );
}

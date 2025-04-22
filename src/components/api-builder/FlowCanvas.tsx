
import { useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, Panel, useReactFlow, Node, Edge, Connection, NodeTypes } from 'reactflow';
import { ApiNodeData } from '@/lib/api-builder-types';
import { createNode } from '@/lib/api-builder-utils';
import { ActiveCollaborator } from '@/lib/api-builder-types';
import { ApiBuilderNode } from '@/components/api-builder/ApiBuilderNode';

interface FlowCanvasProps {
  nodes: Node<ApiNodeData>[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: any) => void;
  collaborators: ActiveCollaborator[];
  currentUserId: string;
}

// Define our custom nodeTypes with the ApiBuilderNode component
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
}: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

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
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="col-span-3 h-full border rounded-md bg-accent/5" ref={reactFlowWrapper}>
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
      >
        <Background />
        <Controls />
        <Panel position="top-left">
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

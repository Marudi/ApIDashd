
import { useState, useRef, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  useReactFlow,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApiBuilderNode } from "@/components/api-builder/ApiBuilderNode";
import { NodeToolbar } from "@/components/api-builder/NodeToolbar";
import { FlowToolbar } from "@/components/api-builder/FlowToolbar";
import { CollaboratorsList } from "@/components/api-builder/CollaboratorsList";
import { ApiFlow, ApiNodeType, ApiNodeData } from "@/lib/api-builder-types";
import { createEmptyFlow, createNode, getRandomColor, isValidConnection } from "@/lib/api-builder-utils";
import { toast } from "@/components/ui/use-toast";

// Custom node types for our ReactFlow instance
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

// Mock current user (in a real app, this would come from auth)
const currentUser = {
  id: "user-1",
  name: "John Smith",
  color: getRandomColor(),
};

// Mock collaborators (in a real app, this would come from a real-time service)
const mockCollaborators = [
  {
    id: currentUser.id,
    name: currentUser.name,
    color: currentUser.color,
    lastActive: new Date(),
  },
  {
    id: "user-2",
    name: "Alice Johnson",
    color: getRandomColor(),
    cursorPosition: { x: 300, y: 200 },
    lastActive: new Date(),
  },
  {
    id: "user-3",
    name: "Bob Williams",
    color: getRandomColor(),
    cursorPosition: { x: 450, y: 350 },
    lastActive: new Date(),
  },
];

const ApiBuilder = () => {
  return (
    <DashboardLayout>
      <ReactFlowProvider>
        <ApiBuilderFlow />
      </ReactFlowProvider>
    </DashboardLayout>
  );
};

const ApiBuilderFlow = () => {
  // Use a sample flow as initial state
  const [flow, setFlow] = useState<ApiFlow>(createEmptyFlow(currentUser.id, "My First API"));
  
  // ReactFlow states
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // Handle connecting two nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      // Find the source and target nodes
      const sourceNode = nodes.find(node => node.id === connection.source);
      const targetNode = nodes.find(node => node.id === connection.target);
      
      if (sourceNode && targetNode) {
        // Check if this connection is allowed based on node types
        if (isValidConnection(sourceNode.type as ApiNodeType, targetNode.type as ApiNodeType)) {
          setEdges((eds) => addEdge({
            ...connection,
            animated: true,
            id: `e${connection.source}-${connection.target}`,
          }, eds));
        } else {
          toast({
            title: "Invalid Connection",
            description: `You cannot connect ${sourceNode.type} to ${targetNode.type}`,
            variant: "destructive",
          });
        }
      }
    },
    [nodes, setEdges, toast]
  );

  // Handle drag over to allow dropping node types
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping a new node from the toolbar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow') as ApiNodeType;

      if (!type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = createNode(type, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handle node drag start from toolbar
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Save the current flow
  const saveFlow = useCallback(() => {
    const updatedFlow: ApiFlow = {
      ...flow,
      nodes,
      edges,
      lastUpdated: new Date().toISOString(),
    };
    setFlow(updatedFlow);
    toast({
      title: "Flow Saved",
      description: "Your API flow has been saved successfully",
    });
  }, [flow, nodes, edges, toast]);

  // Delete the current flow (in a real app, this would trigger a confirmation)
  const deleteFlow = useCallback(() => {
    // Here we would send a delete request to the server
    toast({
      title: "Flow Deleted",
      description: "Your API flow has been deleted",
      variant: "destructive",
    });
    // Reset to an empty flow
    const newFlow = createEmptyFlow(currentUser.id);
    setFlow(newFlow);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
  }, [toast, setNodes, setEdges]);

  // Publish the flow to create a live API
  const publishFlow = useCallback(() => {
    setFlow((currentFlow) => ({
      ...currentFlow,
      published: true,
    }));
  }, []);

  // Update flow name
  const updateFlowName = useCallback((name: string) => {
    setFlow((currentFlow) => ({
      ...currentFlow,
      name,
    }));
  }, []);

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

  const handleReset = useCallback(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  return (
    <div className="h-[calc(100vh-12rem)] w-full">
      <FlowToolbar 
        flow={flow}
        onSave={saveFlow}
        onDelete={deleteFlow}
        onPublish={publishFlow}
        onNameChange={updateFlowName}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />

      <CollaboratorsList 
        collaborators={mockCollaborators}
        currentUserId={currentUser.id}
      />

      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Left sidebar with node types */}
        <div className="col-span-1">
          <NodeToolbar onDragStart={onDragStart} />
        </div>

        {/* Flow editor */}
        <div
          className="col-span-3 h-full border rounded-md bg-accent/5"
          ref={reactFlowWrapper}
        >
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

            {/* Custom cursor positions for each collaborator */}
            <Panel position="top-left">
              {mockCollaborators
                .filter(user => user.id !== currentUser.id && user.cursorPosition)
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
      </div>
    </div>
  );
};

export default ApiBuilder;

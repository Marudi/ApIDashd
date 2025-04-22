
import { ReactFlowProvider } from 'reactflow';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApiBuilderNode } from "@/components/api-builder/ApiBuilderNode";
import { NodeToolbar } from "@/components/api-builder/NodeToolbar";
import { FlowToolbar } from "@/components/api-builder/FlowToolbar";
import { CollaboratorsList } from "@/components/api-builder/CollaboratorsList";
import { FlowCanvas } from "@/components/api-builder/FlowCanvas";
import { useApiFlow } from "@/hooks/useApiFlow";
import { getRandomColor } from "@/lib/api-builder-utils";
import { useCallback } from 'react';

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
  const { 
    flow,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveFlow,
    deleteFlow,
    publishFlow,
    updateFlowName,
    setNodes,
  } = useApiFlow(currentUser.id, "My First API");

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleZoomIn = useCallback(() => {
    // This would be implemented with reactflow's useReactFlow hook in a real app
    console.log('Zoom in');
  }, []);

  const handleZoomOut = useCallback(() => {
    // This would be implemented with reactflow's useReactFlow hook in a real app
    console.log('Zoom out');
  }, []);

  const handleReset = useCallback(() => {
    // This would be implemented with reactflow's useReactFlow hook in a real app
    console.log('Reset view');
  }, []);

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
        <div className="col-span-1">
          <NodeToolbar onDragStart={onDragStart} />
        </div>

        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          setNodes={setNodes}
          collaborators={mockCollaborators}
          currentUserId={currentUser.id}
        />
      </div>
    </div>
  );
};

export default ApiBuilder;

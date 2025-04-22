import { ReactFlowProvider } from 'reactflow';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApiBuilderNode } from "@/components/api-builder/ApiBuilderNode";
import { NodeToolbar } from "@/components/api-builder/NodeToolbar";
import { FlowToolbar } from "@/components/api-builder/FlowToolbar";
import { CollaboratorsList } from "@/components/api-builder/CollaboratorsList";
import { FlowCanvas } from "@/components/api-builder/FlowCanvas";
import { useApiFlow } from "@/hooks/useApiFlow";
import { getRandomColor } from '@/lib/api-builder/collaboration-utils';
import { useCallback, useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  
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
    unsavedChanges,
  } = useApiFlow(currentUser.id, "My First API");

  // Warn about unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsavedChanges]);

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
    <div className="h-[calc(100vh-12rem)] w-full flex flex-col">
      <FlowToolbar 
        flow={flow}
        onSave={saveFlow}
        onDelete={deleteFlow}
        onPublish={publishFlow}
        onNameChange={updateFlowName}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        hasUnsavedChanges={unsavedChanges}
      />

      <CollaboratorsList 
        collaborators={mockCollaborators}
        currentUserId={currentUser.id}
      />

      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} gap-4 h-full`}>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="mb-2">
                <Menu className="h-4 w-4 mr-2" />
                Node Palette
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[350px]">
              <div className="pt-6">
                <NodeToolbar onDragStart={onDragStart} />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="col-span-1">
            <NodeToolbar onDragStart={onDragStart} />
          </div>
        )}

        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          setNodes={setNodes}
          collaborators={mockCollaborators}
          currentUserId={currentUser.id}
          onSave={saveFlow}
        />
      </div>
    </div>
  );
};

export default ApiBuilder;

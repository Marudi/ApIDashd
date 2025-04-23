
import { ReactFlowProvider } from 'reactflow';
import { ApiBuilderNode } from "@/components/api-builder/ApiBuilderNode";
import { NodeToolbar } from "@/components/api-builder/NodeToolbar";
import { FlowToolbar } from "@/components/api-builder/FlowToolbar";
import { CollaboratorsList } from "@/components/api-builder/CollaboratorsList";
import { FlowCanvas } from "@/components/api-builder/FlowCanvas";
import { useApiFlow } from "@/hooks/useApiFlow";
import { getRandomColor } from '@/lib/api-builder/collaboration-utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const currentUser = {
  id: "user-1",
  name: "John Smith",
  color: getRandomColor(),
};

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

interface ApiBuilderFlowProps {
  onSave?: () => void;
  hasUnsavedChanges?: boolean;
}

export function ApiBuilderFlow({ onSave, hasUnsavedChanges: externalUnsavedChanges }: ApiBuilderFlowProps) {
  const isMobile = useIsMobile();
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);

  // --- New: Ref for controlling canvas actions globally
  const flowCanvasRef = useRef<{ zoomIn: () => void; zoomOut: () => void; fitView: () => void; }>(null);

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
    duplicateNode,
    deleteNode,
    unsavedChanges: internalUnsavedChanges,
  } = useApiFlow(currentUser.id, "My First API");

  // Use external unsaved changes state if provided, otherwise use internal state
  const unsavedChanges = externalUnsavedChanges !== undefined ? externalUnsavedChanges : internalUnsavedChanges;

  // Handle save with external handler if provided
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave();
    } else {
      saveFlow();
    }
  }, [onSave, saveFlow]);

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

  // --- New: Canvas controls handlers
  const handleZoomIn = useCallback(() => {
    flowCanvasRef.current?.zoomIn();
  }, []);
  const handleZoomOut = useCallback(() => {
    flowCanvasRef.current?.zoomOut();
  }, []);
  const handleReset = useCallback(() => {
    flowCanvasRef.current?.fitView();
  }, []);

  // --- New: Handler passed to nodes for duplicate/delete
  const handleNodeDuplicate = useCallback((nodeId: string) => {
    duplicateNode(nodeId);
  }, [duplicateNode]);
  const handleNodeDelete = useCallback((nodeId: string) => {
    deleteNode(nodeId);
  }, [deleteNode]);

  const [isPublishing, setIsPublishing] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className={`h-[calc(100vh-18rem)] w-full flex flex-col`}>
      <FlowToolbar 
        flow={flow}
        onSave={handleSave}
        onDelete={deleteFlow}
        onPublish={publishFlow}
        onNameChange={updateFlowName}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        hasUnsavedChanges={unsavedChanges}
        isPublishing={isPublishing}
        setIsPublishing={setIsPublishing}
        progress={progress}
        setProgress={setProgress}
      />

      <div className={`${isMobile ? "space-y-2" : ""}`}>
        <CollaboratorsList 
          collaborators={mockCollaborators}
          currentUserId={currentUser.id}
        />
      </div>

      <div
        className={`grid ${
          isMobile ? "grid-cols-1" : "grid-cols-4"
        } gap-2 sm:gap-4 h-full overflow-x-auto pb-2`}
        style={isMobile ? { minHeight: 0, height: "100%", flex: 1 } : {}}
      >
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="mb-2 w-full py-4 text-base font-medium"
                style={{ minHeight: "48px" }}
              >
                <Menu className="h-5 w-5 mr-2" />
                Node Palette
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[96vw] max-w-[380px] sm:max-w-[350px] px-3 pt-6"
              style={{
                paddingTop: "1.5rem",
                paddingBottom: "1.5rem",
                maxHeight: "100vh",
                overflowY: "auto",
              }}
            >
              <NodeToolbar onDragStart={onDragStart} />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="col-span-1 min-w-[210px] max-w-xs pb-2">
            <NodeToolbar onDragStart={onDragStart} />
          </div>
        )}

        <div
          className={`relative ${isMobile ? "w-full h-[70vh] min-h-[350px]" : "col-span-3"}`}
          style={isMobile ? { overflow: "hidden", padding: "0 0.25rem" } : {}}
        >
          <FlowCanvas
            ref={flowCanvasRef}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            setNodes={setNodes}
            collaborators={mockCollaborators}
            currentUserId={currentUser.id}
            onSave={handleSave}
            onNodeDuplicate={handleNodeDuplicate}
            onNodeDelete={handleNodeDelete}
          />
        </div>
      </div>
    </div>
  );
}

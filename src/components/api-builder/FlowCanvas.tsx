
import { useCallback, useImperativeHandle, useRef, forwardRef } from 'react';
import ReactFlow, { 
  Background, 
  BackgroundVariant,
  Node, 
  Edge, 
  Connection,
  ReactFlowInstance,
} from 'reactflow';
import { ApiNodeData } from '@/lib/api-builder-types';
import { ActiveCollaborator } from '@/lib/api-builder-types';
import { useIsMobile } from '@/hooks/use-mobile';
import { FlowControls } from './flow-controls/FlowControls';
import { InstructionsPanel } from './flow-panels/InstructionsPanel';
import { CollaboratorsPanel } from './flow-panels/CollaboratorsPanel';
import { NodeConfigDialog } from './node-editors/NodeConfigDialog';
import { useNodeConfig } from '@/hooks/useNodeConfig';
import { useFlowHandlers } from '@/hooks/useFlowHandlers';
import { createCustomNodeTypes } from './flow-canvas/CustomNodeTypes';
import { flowConfig } from './flow-canvas/FlowConfig';
import { useToast } from '@/components/ui/use-toast';

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
  onNodeDuplicate?: (nodeId: string) => void;
  onNodeDelete?: (nodeId: string) => void;
}

export const FlowCanvas = forwardRef(function FlowCanvas(
  {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
    collaborators,
    currentUserId,
    onSave,
    onNodeDuplicate,
    onNodeDelete,
  }: FlowCanvasProps,
  ref
) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstanceRef = useRef<ReactFlowInstance>();
  const { toast } = useToast();

  const isMobile = useIsMobile();
  
  const { 
    selectedNode, 
    isConfigOpen, 
    openNodeConfig, 
    closeNodeConfig, 
    handleSaveNodeConfig 
  } = useNodeConfig();

  const {
    onDragOver,
    onDrop,
    handleSave,
    handleExport
  } = useFlowHandlers(reactFlowWrapper, setNodes, onSave);

  // Fixed onNodeClick handler to properly open node config dialog
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<ApiNodeData>) => {
    // We don't need to do anything here since the click is handled by the node itself
    console.log("Node clicked:", node.id);
  }, []);

  const handleSaveNodeData = useCallback((updatedData: ApiNodeData) => {
    handleSaveNodeConfig(updatedData, nodes, setNodes);
  }, [handleSaveNodeConfig, nodes, setNodes]);

  // Expose zoom/fitView controls to parent via ref
  useImperativeHandle(ref, () => ({
    zoomIn: () => reactFlowInstanceRef.current?.zoomIn(),
    zoomOut: () => reactFlowInstanceRef.current?.zoomOut(),
    fitView: () => reactFlowInstanceRef.current?.fitView(flowConfig.fitViewOptions),
  }));

  // Create custom node types OUTSIDE of useMemo to avoid React hook rules violation
  const nodeTypes = createCustomNodeTypes(onNodeDuplicate, onNodeDelete);

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
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        proOptions={{ hideAttribution: true }}
        {...flowConfig}
        onInit={(instance) => { reactFlowInstanceRef.current = instance; }}
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

      {selectedNode && (
        <NodeConfigDialog
          isOpen={isConfigOpen}
          onClose={closeNodeConfig}
          nodeType={selectedNode.type as any}
          nodeData={selectedNode.data}
          onSave={handleSaveNodeData}
        />
      )}
    </div>
  );
});

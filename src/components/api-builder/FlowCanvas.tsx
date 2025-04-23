
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
import { nodeTypes, flowConfig } from './flow-canvas/FlowConfig';

// --- New: Props for controlling node duplicate/delete context actions
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

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<ApiNodeData>) => {
    openNodeConfig(node);
  }, [openNodeConfig]);

  const handleSaveNodeData = useCallback((updatedData: ApiNodeData) => {
    handleSaveNodeConfig(updatedData, nodes, setNodes);
  }, [handleSaveNodeConfig, nodes, setNodes]);

  // --- New: Expose zoom/fitView controls to parent via ref
  useImperativeHandle(ref, () => ({
    zoomIn: () => reactFlowInstanceRef.current?.zoomIn(),
    zoomOut: () => reactFlowInstanceRef.current?.zoomOut(),
    fitView: () => reactFlowInstanceRef.current?.fitView({ padding: 0.1, duration: 800 }),
  }));

  // --- Compose custom nodeTypes to inject context actions
  const customNodeTypes = {
    ...nodeTypes,
    default: (nodeProps: any) => nodeTypes.default({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    input: (nodeProps: any) => nodeTypes.input({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    endpoint: (nodeProps: any) => nodeTypes.endpoint({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    transform: (nodeProps: any) => nodeTypes.transform({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    auth: (nodeProps: any) => nodeTypes.auth({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    ratelimit: (nodeProps: any) => nodeTypes.ratelimit({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    cache: (nodeProps: any) => nodeTypes.cache({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    mock: (nodeProps: any) => nodeTypes.mock({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    validator: (nodeProps: any) => nodeTypes.validator({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
    output: (nodeProps: any) => nodeTypes.output({
      ...nodeProps,
      onDuplicate: onNodeDuplicate,
      onDelete: onNodeDelete
    }),
  };

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
        nodeTypes={customNodeTypes}
        draggable={true}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        fitView
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

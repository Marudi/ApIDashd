
import { useCallback, useRef } from 'react';
import ReactFlow, { 
  Background, 
  BackgroundVariant,
  Node, 
  Edge, 
  Connection,
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
        fitView
        {...flowConfig}
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
}

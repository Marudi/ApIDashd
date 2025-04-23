
import { useCallback, useEffect } from 'react';
import { Node, Connection, useReactFlow, XYPosition } from 'reactflow';
import { useToast } from '@/components/ui/use-toast';
import { ApiNodeData, ApiNodeType } from '@/lib/api-builder-types';
import { createNode } from '@/lib/api-builder/node-utils';

export function useFlowHandlers(
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  setNodes: React.Dispatch<React.SetStateAction<Node<ApiNodeData>[]>>,
  onSave?: () => void
) {
  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();

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
      const nodeType = event.dataTransfer.getData('application/reactflow');
      
      console.log('Drop event triggered with type:', nodeType);
      console.log('React Flow Bounds:', !!reactFlowBounds);
      console.log('React Flow Instance:', !!reactFlowInstance);
      
      if (!nodeType || !reactFlowBounds || !reactFlowInstance) {
        console.log('Missing data for drop operation:', { 
          type: nodeType, 
          hasBounds: !!reactFlowBounds, 
          hasInstance: !!reactFlowInstance 
        });
        return;
      }

      // Calculate the position where the node should be dropped
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      console.log('Creating node at position:', position);
      
      // Create the node with the calculated position
      const newNode = createNode(nodeType as ApiNodeType, position);
      
      // Ensure the node is explicitly set as draggable
      const nodeWithDraggable = {
        ...newNode,
        draggable: true,
        selected: true,
      };
      
      console.log('New node created:', nodeWithDraggable);
      
      setNodes((nds) => nds.concat(nodeWithDraggable));
      
      toast({
        title: "Node Added",
        description: `Added new ${nodeType} node to the canvas`,
      });
    },
    [reactFlowInstance, reactFlowWrapper, setNodes, toast]
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
  }, [reactFlowInstance, toast]);

  return {
    onDragOver,
    onDrop,
    handleSave,
    handleExport
  };
}

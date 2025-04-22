
import { useCallback, useEffect } from 'react';
import { Node, Connection, useReactFlow, XYPosition } from 'reactflow';
import { useToast } from '@/components/ui/use-toast';
import { ApiNodeData, ApiNodeType } from '@/lib/api-builder-types';
// Use the canonical node utils for node creation
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
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (!type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      // Calculate drop position correctly
      const position: XYPosition = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Use the correct node creator which provides the correct structure
      const newNode = createNode(type as ApiNodeType, position);

      setNodes((nds) => [
        ...nds,
        {
          ...newNode,
          // explicitly ensure added node is draggable
          draggable: true
        }
      ]);
      
      toast({
        title: "Node Added",
        description: `Added new ${type} node to the canvas`,
      });
    },
    [reactFlowInstance, setNodes, toast, reactFlowWrapper]
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


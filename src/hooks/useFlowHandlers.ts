import { useCallback, useEffect } from 'react';
import { Node, Connection, useReactFlow } from 'reactflow';
import { useToast } from '@/components/ui/use-toast';
import { ApiNodeData } from '@/lib/api-builder-types';
import { createNode } from '@/lib/api-builder/node-config-service';

export function useFlowHandlers(
  reactFlowWrapper: React.RefObject<HTMLDivElement>,
  setNodes: (nodes: Node[]) => void,
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

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = createNode(type as any, position);
      setNodes((nds: Node[]) => [...nds, newNode]);
      
      toast({
        title: "Node Added",
        description: `Added new ${type} node to the canvas`,
      });
    },
    [reactFlowInstance, setNodes, toast]
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

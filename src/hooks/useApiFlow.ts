
import { useCallback, useState } from 'react';
import { Connection, useEdgesState, useNodesState, addEdge } from 'reactflow';
import { toast } from '@/components/ui/use-toast';
import { ApiFlow } from '@/lib/api-builder-types';
import { createEmptyFlow, createNode, isValidConnection } from '@/lib/api-builder-utils';

export function useApiFlow(initialUserId: string, initialFlowName?: string) {
  const [flow, setFlow] = useState<ApiFlow>(createEmptyFlow(initialUserId, initialFlowName));
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find(node => node.id === connection.source);
      const targetNode = nodes.find(node => node.id === connection.target);
      
      if (sourceNode && targetNode) {
        if (isValidConnection(sourceNode.type, targetNode.type)) {
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
    [nodes, setEdges]
  );

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
  }, [flow, nodes, edges]);

  const deleteFlow = useCallback(() => {
    toast({
      title: "Flow Deleted",
      description: "Your API flow has been deleted",
      variant: "destructive",
    });
    const newFlow = createEmptyFlow(initialUserId);
    setFlow(newFlow);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
  }, [initialUserId, setNodes, setEdges]);

  const publishFlow = useCallback(() => {
    setFlow((currentFlow) => ({
      ...currentFlow,
      published: true,
    }));
  }, []);

  const updateFlowName = useCallback((name: string) => {
    setFlow((currentFlow) => ({
      ...currentFlow,
      name,
    }));
  }, []);

  return {
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
  };
}

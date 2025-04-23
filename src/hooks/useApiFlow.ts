import { useCallback, useState, useEffect } from 'react';
import { Connection, useEdgesState, useNodesState, addEdge } from 'reactflow';
import { toast } from '@/components/ui/use-toast';
import { ApiFlow } from '@/lib/api-builder-types';
import { createEmptyFlow } from '@/lib/api-builder/flow-utils';
import { createNode } from '@/lib/api-builder/node-utils';
import { isValidConnection } from '@/lib/api-builder/node-utils';

// Utility: Save flow version history to localStorage
function pushFlowToHistory(flow: ApiFlow) {
  try {
    const key = `api-flow-${flow.id}-history`;
    const prevRaw = localStorage.getItem(key);
    let prev: any[] = [];
    if (prevRaw) prev = JSON.parse(prevRaw);
    if (!Array.isArray(prev)) prev = [];
    // Only keep 10 max, add most recent to end
    prev.push({ ...flow });
    if (prev.length > 10) prev = prev.slice(-10);
    localStorage.setItem(key, JSON.stringify(prev));
  } catch (e) { /* silent */ }
}

export function useApiFlow(initialUserId: string, initialFlowName?: string) {
  const [flow, setFlow] = useState<ApiFlow>(createEmptyFlow(initialUserId, initialFlowName));
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    setUnsavedChanges(true);
  }, [nodes, edges]);

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
    setUnsavedChanges(false);
    toast({
      title: "Flow Saved",
      description: "Your API flow has been saved successfully",
    });
    try {
      localStorage.setItem(`api-flow-${flow.id}`, JSON.stringify(updatedFlow));
      pushFlowToHistory(updatedFlow);
    } catch (error) {
      console.error("Failed to save flow to localStorage", error);
    }
  }, [flow, nodes, edges]);

  const deleteFlow = useCallback(() => {
    toast({
      title: "Flow Deleted",
      description: "Your API flow has been deleted",
      variant: "destructive",
    });
    try {
      const prev = localStorage.getItem(`api-flow-${flow.id}`);
      if (prev) pushFlowToHistory(JSON.parse(prev));
      localStorage.removeItem(`api-flow-${flow.id}`);
    } catch (error) {
      console.error("Failed to delete flow from localStorage", error);
    }
    const newFlow = createEmptyFlow(initialUserId);
    setFlow(newFlow);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
    setUnsavedChanges(false);
  }, [initialUserId, setNodes, setEdges, flow.id]);

  const publishFlow = useCallback(() => {
    setFlow((currentFlow) => {
      const publishedFlow = {
        ...currentFlow,
        published: true,
        lastUpdated: new Date().toISOString(),
      };
      
      try {
        localStorage.setItem(`api-flow-${currentFlow.id}`, JSON.stringify(publishedFlow));
      } catch (error) {
        console.error("Failed to publish flow to localStorage", error);
      }
      
      return publishedFlow;
    });
    setUnsavedChanges(false);
  }, []);

  const updateFlowName = useCallback((name: string) => {
    setFlow((currentFlow) => ({
      ...currentFlow,
      name,
    }));
    setUnsavedChanges(true);
  }, []);

  const duplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (!nodeToDuplicate) return;
    
    const newNode = {
      ...nodeToDuplicate,
      id: `${nodeToDuplicate.id}-copy`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setUnsavedChanges(true);
  }, [nodes, setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
    setUnsavedChanges(true);
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        saveFlow();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveFlow]);

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
    unsavedChanges,
    duplicateNode,
    deleteNode,
  };
}

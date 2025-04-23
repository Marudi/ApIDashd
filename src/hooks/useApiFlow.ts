import { useCallback, useState, useEffect } from 'react';
import { Connection, useEdgesState, useNodesState, addEdge } from 'reactflow';
import { toast } from '@/components/ui/use-toast';
import { ApiFlow } from '@/lib/api-builder-types';
import { createEmptyFlow } from '@/lib/api-builder/flow-utils';
import { createNode } from '@/lib/api-builder/node-utils';
import { isValidConnection } from '@/lib/api-builder/node-utils';
import { usePersistentStorage } from "./usePersistentStorage";

// Utility: Save flow version history to persistent or local storage
function getHistoryKey(flowId: string) {
  return `api-flow-${flowId}-history`;
}
function getFlowKey(flowId: string) {
  return `api-flow-${flowId}`;
}

export function useApiFlow(initialUserId: string, initialFlowName?: string) {
  const [flow, setFlow] = useState<ApiFlow>(createEmptyFlow(initialUserId, initialFlowName));
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Persistent storage hook for global persistence toggle
  const {
    persistentEnabled,
    setPersistentItem,
    getPersistentItem,
  } = usePersistentStorage();

  // Save history utility, will use persistent storage if enabled
  const pushFlowToHistory = useCallback((flowObj: ApiFlow) => {
    try {
      const key = getHistoryKey(flowObj.id);
      let prev: any[] = [];
      let raw: string | null = null;
      if (persistentEnabled) {
        raw = getPersistentItem(key);
      } else {
        raw = localStorage.getItem(key);
      }
      if (raw) prev = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!Array.isArray(prev)) prev = [];
      prev.push({ ...flowObj });
      if (prev.length > 10) prev = prev.slice(-10);
      if (persistentEnabled) {
        setPersistentItem(key, prev);
      } else {
        localStorage.setItem(key, JSON.stringify(prev));
      }
    } catch (e) { /* silent */ }
  }, [persistentEnabled, setPersistentItem, getPersistentItem]);

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
      const flowKey = getFlowKey(flow.id);
      if (persistentEnabled) {
        setPersistentItem(flowKey, updatedFlow);
      } else {
        localStorage.setItem(flowKey, JSON.stringify(updatedFlow));
      }
      pushFlowToHistory(updatedFlow);
    } catch (error) {
      console.error("Failed to save flow to storage", error);
    }
  }, [flow, nodes, edges, persistentEnabled, setPersistentItem, pushFlowToHistory]);

  const deleteFlow = useCallback(() => {
    toast({
      title: "Flow Deleted",
      description: "Your API flow has been deleted",
      variant: "destructive",
    });
    try {
      const flowKey = getFlowKey(flow.id);
      let prev: any = null;
      if (persistentEnabled) {
        prev = getPersistentItem(flowKey);
      } else {
        const prevRaw = localStorage.getItem(flowKey);
        prev = prevRaw ? JSON.parse(prevRaw) : null;
      }
      if (prev) pushFlowToHistory(prev);
      if (persistentEnabled) {
        setPersistentItem(flowKey, null);
      } else {
        localStorage.removeItem(flowKey);
      }
    } catch (error) {
      console.error("Failed to delete flow from storage", error);
    }
    const newFlow = createEmptyFlow(initialUserId);
    setFlow(newFlow);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
    setUnsavedChanges(false);
  }, [initialUserId, setNodes, setEdges, flow.id, persistentEnabled, setPersistentItem, getPersistentItem, pushFlowToHistory]);

  const publishFlow = useCallback(() => {
    setFlow((currentFlow) => {
      const publishedFlow = {
        ...currentFlow,
        published: true,
        lastUpdated: new Date().toISOString(),
      };
      try {
        const flowKey = getFlowKey(currentFlow.id);
        if (persistentEnabled) {
          setPersistentItem(flowKey, publishedFlow);
        } else {
          localStorage.setItem(flowKey, JSON.stringify(publishedFlow));
        }
        pushFlowToHistory(publishedFlow);
      } catch (error) {
        console.error("Failed to publish flow to storage", error);
      }
      return publishedFlow;
    });
    setUnsavedChanges(false);
  }, [persistentEnabled, setPersistentItem, pushFlowToHistory]);

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

  useEffect(() => {
    setUnsavedChanges(true);
  }, [nodes, edges]);

  // Save on CMD/CTRL+S
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


import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { ApiFlow } from "@/lib/api-builder-types";
import { createEmptyFlow } from "@/lib/api-builder/flow-utils";
import { usePersistentStorage } from "./usePersistentStorage";
import { useFlowStorage } from "./useFlowStorage";
import { useFlowHistory } from "./useFlowHistory";
import { useFlowNodes } from "./useFlowNodes";

// Main compositional hook
export function useApiFlow(initialUserId: string, initialFlowName?: string) {
  const [flow, setFlow] = useState<ApiFlow>(
    createEmptyFlow(initialUserId, initialFlowName)
  );
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Persistent storage
  const {
    persistentEnabled,
    setPersistentItem,
    getPersistentItem,
  } = usePersistentStorage();

  // Split hooks for storage/history/nodes
  const { pushFlowToHistory, saveFlowToStorage, deleteFlowFromStorage } =
    useFlowStorage(persistentEnabled, setPersistentItem, getPersistentItem);
  const { getFlowHistory } = useFlowHistory(persistentEnabled, getPersistentItem);

  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    duplicateNode,
    deleteNode,
    onConnect,
  } = useFlowNodes(flow.nodes, flow.edges);

  // Update flow when nodes or edges change
  useEffect(() => {
    setFlow(prevFlow => ({
      ...prevFlow,
      nodes,
      edges
    }));
  }, [nodes, edges]);

  // Set complete flow
  const updateFlow = useCallback((newFlow: ApiFlow) => {
    setFlow(newFlow);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
    setUnsavedChanges(true);
  }, [setNodes, setEdges]);

  // Save logic
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
      saveFlowToStorage(updatedFlow);
    } catch (error) {
      console.error("Failed to save flow to storage", error);
    }
  }, [flow, nodes, edges, saveFlowToStorage]);

  // Delete logic
  const deleteFlow = useCallback(() => {
    toast({
      title: "Flow Deleted",
      description: "Your API flow has been deleted",
      variant: "destructive",
    });
    try {
      // Get previous version for history
      const flowKey = `api-flow-${flow.id}`;
      let prev: any = null;
      if (persistentEnabled) {
        prev = getPersistentItem(flowKey);
      } else {
        const prevRaw = localStorage.getItem(flowKey);
        prev = prevRaw ? JSON.parse(prevRaw) : null;
      }
      if (prev) pushFlowToHistory(prev);
      deleteFlowFromStorage(flow.id);
    } catch (error) {
      console.error("Failed to delete flow from storage", error);
    }
    const newFlow = createEmptyFlow(initialUserId);
    setFlow(newFlow);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
    setUnsavedChanges(false);
  }, [
    initialUserId,
    setNodes,
    setEdges,
    flow.id,
    persistentEnabled,
    getPersistentItem,
    pushFlowToHistory,
    deleteFlowFromStorage,
  ]);

  // Publish logic
  const publishFlow = useCallback(() => {
    setFlow((currentFlow) => {
      const publishedFlow = {
        ...currentFlow,
        published: true,
        lastUpdated: new Date().toISOString(),
      };
      try {
        saveFlowToStorage(publishedFlow);
      } catch (error) {
        console.error("Failed to publish flow to storage", error);
      }
      return publishedFlow;
    });
    setUnsavedChanges(false);
  }, [saveFlowToStorage]);

  // Name change
  const updateFlowName = useCallback((name: string) => {
    setFlow((currentFlow) => ({
      ...currentFlow,
      name,
    }));
    setUnsavedChanges(true);
  }, []);

  // Track unsaved changes
  useEffect(() => {
    setUnsavedChanges(true);
  }, [nodes, edges]);

  // Save on CMD/CTRL+S
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        saveFlow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
    getFlowHistory,
    setFlow: updateFlow,
  };
}


import { useCallback } from "react";
import { ApiFlow } from "@/lib/api-builder-types";
import { usePersistentStorage } from "./usePersistentStorage";

// Utility functions for flow storage
function getHistoryKey(flowId: string) {
  return `api-flow-${flowId}-history`;
}
function getFlowKey(flowId: string) {
  return `api-flow-${flowId}`;
}

export function useFlowStorage(persistentEnabled: boolean, setPersistentItem: any, getPersistentItem: any) {
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

  const saveFlowToStorage = useCallback((flow: ApiFlow) => {
    const flowKey = getFlowKey(flow.id);
    if (persistentEnabled) {
      setPersistentItem(flowKey, flow);
    } else {
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
    pushFlowToHistory(flow);
  }, [persistentEnabled, setPersistentItem, pushFlowToHistory]);

  const deleteFlowFromStorage = useCallback((flowId: string) => {
    const flowKey = getFlowKey(flowId);
    if (persistentEnabled) {
      setPersistentItem(flowKey, null);
    } else {
      localStorage.removeItem(flowKey);
    }
  }, [persistentEnabled, setPersistentItem]);

  return {
    pushFlowToHistory,
    saveFlowToStorage,
    deleteFlowFromStorage,
  };
}


import { useCallback } from "react";

// Utility function, used here for completeness
function getHistoryKey(flowId: string) {
  return `api-flow-${flowId}-history`;
}

export function useFlowHistory(persistentEnabled: boolean, getPersistentItem: any) {
  // Returns last 10 versions of history
  const getFlowHistory = useCallback((flowId: string) => {
    const versionsKey = getHistoryKey(flowId);
    let raw: string | null = null;
    if (persistentEnabled) {
      raw = getPersistentItem(versionsKey);
      if (raw && typeof raw !== "string") return raw.slice(-10).reverse();
    }
    raw = localStorage.getItem(versionsKey);
    if (raw) {
      try {
        return JSON.parse(raw).slice(-10).reverse();
      } catch {
        return [];
      }
    }
    return [];
  }, [persistentEnabled, getPersistentItem]);

  return {
    getFlowHistory,
  };
}

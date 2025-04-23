
import { useCallback } from "react";
import { ApiFlow } from "@/lib/api-builder-types";

// Utility function, used here for completeness
function getHistoryKey(flowId: string) {
  return `api-flow-${flowId}-history`;
}

export function useFlowHistory(
  persistentEnabled: boolean,
  getPersistentItem: (key: string) => any
) {
  // Returns last 10 versions of history
  const getFlowHistory = useCallback((flowId: string) => {
    const versionsKey = getHistoryKey(flowId);
    let raw: string | null | any[] = null;
    if (persistentEnabled) {
      raw = getPersistentItem(versionsKey);
      // Check if raw is an array before using slice
      if (raw && Array.isArray(raw)) return raw.slice(-10).reverse();
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

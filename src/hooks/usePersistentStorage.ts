
import { useEffect, useState, useCallback } from "react";

type StorageKey = "api_definitions" | "api_keys";

/**
 * usePersistentStorage is a hook for dashboard-wide persistent storage.
 * In addition to API/key data helpers, it provides generic get/set methods:
 * - getPersistentItem(key: string): any | null
 * - setPersistentItem(key: string, value: any): void
 *
 * These store/retrieve values only if persistence is enabled.
 * Use them for settings, changes, requests, load balancer config, etc.
 */
export function usePersistentStorage() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    return (
      window.localStorage.getItem("dashboard_persistence_enabled") === "true"
    );
  });

  // Getter for API definitions (legacy, use generic method if possible)
  const getApiDefs = useCallback(() => {
    if (!enabled) return null;
    const v = window.localStorage.getItem("api_definitions");
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  }, [enabled]);

  // Setter for API definitions
  const setApiDefs = useCallback(
    (defs: any) => {
      if (enabled) {
        window.localStorage.setItem("api_definitions", JSON.stringify(defs));
      }
    },
    [enabled]
  );

  // Getter for API keys (legacy, use generic method if possible)
  const getApiKeys = useCallback(() => {
    if (!enabled) return null;
    const v = window.localStorage.getItem("api_keys");
    if (!v) return null;
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  }, [enabled]);

  // Setter for API keys
  const setApiKeys = useCallback(
    (keys: any) => {
      if (enabled) {
        window.localStorage.setItem("api_keys", JSON.stringify(keys));
      }
    },
    [enabled]
  );

  // Generic setter for any persistent data
  const setPersistentItem = useCallback(
    (key: string, value: any) => {
      if (enabled) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    },
    [enabled]
  );

  // Generic getter for any persistent data
  const getPersistentItem = useCallback(
    (key: string) => {
      if (!enabled) return null;
      const v = window.localStorage.getItem(key);
      if (!v) return null;
      try {
        return JSON.parse(v);
      } catch {
        return null;
      }
    },
    [enabled]
  );

  // Listen for persistence toggle and clear if disabling
  useEffect(() => {
    window.localStorage.setItem("dashboard_persistence_enabled", String(enabled));
    if (!enabled) {
      window.localStorage.removeItem("api_definitions");
      window.localStorage.removeItem("api_keys");
      // Optionally clear other app-specific keys if desired
      // For now, generic keys will persist unless handled elsewhere (like 'Delete All' in StorageUsageCard)
    }
  }, [enabled]);

  return {
    persistentEnabled: enabled,
    setPersistentEnabled: setEnabled,
    getApiDefs,
    setApiDefs,
    getApiKeys,
    setApiKeys,
    setPersistentItem,
    getPersistentItem,
  };
}

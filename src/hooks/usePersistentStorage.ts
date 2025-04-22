
import { useEffect, useState, useCallback } from "react";

type StorageKey = "api_definitions" | "api_keys";

export function usePersistentStorage() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    return (
      window.localStorage.getItem("dashboard_persistence_enabled") === "true"
    );
  });

  // Getter for API definitions
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

  // Getter for API keys
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

  // Listen for persistence toggle and clear if disabling
  useEffect(() => {
    window.localStorage.setItem("dashboard_persistence_enabled", String(enabled));
    if (!enabled) {
      window.localStorage.removeItem("api_definitions");
      window.localStorage.removeItem("api_keys");
    }
  }, [enabled]);

  return {
    persistentEnabled: enabled,
    setPersistentEnabled: setEnabled,
    getApiDefs,
    setApiDefs,
    getApiKeys,
    setApiKeys
  };
}

import { useState, useSyncExternalStore } from "react";

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function createJSONReader<T>(key: string, fallback: T): () => T {
  let cachedRaw: string | null | undefined;
  let cachedValue: T = fallback;
  return () => {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    if (raw === null) {
      cachedValue = fallback;
    } else {
      try {
        cachedValue = JSON.parse(raw) as T;
      } catch {
        cachedValue = fallback;
      }
    }
    return cachedValue;
  };
}

export function useLocalJSON<T>(key: string, fallback: T): T {
  const [read] = useState(() => createJSONReader(key, fallback));
  const [serverFallback] = useState(() => fallback);
  return useSyncExternalStore(subscribeToStorage, read, () => serverFallback);
}

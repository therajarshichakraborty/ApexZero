// src/lib/server-cache.ts
interface Entry<T> {
  value: T;
  expires: number;
}

function globalMap<T>(key: string): Map<string, Entry<T>> {
  const g = globalThis as Record<string, unknown>;
  if (!g[key]) g[key] = new Map<string, Entry<T>>();
  return g[key] as Map<string, Entry<T>>;
}

export function get<T>(map: Map<string, Entry<T>>, key: string): T | null {
  const e = map.get(key);
  if (!e) return null;
  if (e.expires < Date.now()) {
    map.delete(key);
    return null;
  }
  return e.value;
}

export function set<T>(map: Map<string, Entry<T>>, key: string, value: T, ttlMs: number) {
  map.set(key, { value, expires: Date.now() + ttlMs });
}

// Shared global caches
export const sessionCache = globalMap<string>("__sc_session");
export const queryCache = globalMap<unknown[]>("__sc_query");
export const clientCache = globalMap<unknown>("__sc_client");

// src/lib/query-cache.ts

interface QueryCacheEntry {
  rows: unknown[];
  expires: number;
}

const g = globalThis as unknown as {
  queryCache: Map<string, QueryCacheEntry> | undefined;
};

const queryCache: Map<string, QueryCacheEntry> = g.queryCache ?? new Map();
g.queryCache = queryCache;

const QUERY_TTL = 4 * 60 * 1000; // 4 minutes

export function getCachedQuery(key: string): unknown[] | null {
  const entry = queryCache.get(key);
  if (entry && entry.expires > Date.now()) return entry.rows;
  return null;
}

export function setCachedQuery(key: string, rows: unknown[]): void {
  queryCache.set(key, { rows, expires: Date.now() + QUERY_TTL });
}

export function invalidateCachedQuery(key: string): void {
  queryCache.delete(key);
}

// src/lib/corsair-token-cache.ts

// Stores decrypted token rows keyed by tenant ID
// Corsair fetches these with something like:
// SELECT * FROM corsair_credentials WHERE tenant_id = $1
const tokenRowCache = new Map<string, { row: unknown; expires: number }>();

const TOKEN_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export function getCachedTokenRow(tenantId: string) {
  const entry = tokenRowCache.get(tenantId);
  if (entry && entry.expires > Date.now()) return entry.row;
  return null;
}

export function setCachedTokenRow(tenantId: string, row: unknown) {
  tokenRowCache.set(tenantId, {
    row,
    expires: Date.now() + TOKEN_CACHE_TTL,
  });
}

export function invalidateTokenRow(tenantId: string) {
  tokenRowCache.delete(tenantId);
}
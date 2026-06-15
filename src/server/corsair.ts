// src/server/corsair.ts
import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { env } from "@/lib/env.config";
import { pool } from "@/db";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export const corsair = createCorsair({
  plugins: [gmail()],
  database: pool,
  kek: env.CORSAIR_KEK!,
  multiTenancy: true,
});

type TenantClient = ReturnType<typeof corsair.withTenant>;

const g = globalThis as any;

// Each cache lives directly on globalThis with a unique key
// This survives Next.js module re-instantiation completely
if (!g.__corsair_session_cache) {
  g.__corsair_session_cache = new Map<string, { userId: string; exp: number }>();
}
if (!g.__corsair_client_cache) {
  g.__corsair_client_cache = new Map<string, { client: TenantClient; exp: number }>();
}

const sessionMap: Map<string, { userId: string; exp: number }> = g.__corsair_session_cache;
const clientMap: Map<string, { client: TenantClient; exp: number }> = g.__corsair_client_cache;

const SESSION_TTL = 5 * 60 * 1000;
const CLIENT_TTL = 4 * 60 * 1000;

export async function getCorsairWithTenant(): Promise<TenantClient> {
  const now = Date.now();
  const h = await headers();
  const cookieHeader = h.get("cookie") ?? "";

  const sessionCookie =
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find(
        (c) =>
          c.startsWith("better-auth.session_token=") ||
          c.startsWith("__Secure-better-auth.session_token="),
      ) ?? "";

  console.log("[c] sessionMap.size:", sessionMap.size, "clientMap.size:", clientMap.size);

  // 1. Resolve userId
  let userId: string;
  const cachedSession = sessionCookie ? sessionMap.get(sessionCookie) : null;

  if (cachedSession && cachedSession.exp > now) {
    console.log("[c] session HIT");
    userId = cachedSession.userId;
  } else {
    console.log("[c] session MISS");
    const session = await auth.api.getSession({ headers: h });
    if (!session?.user?.id) throw new Error("Unauthenticated");
    userId = session.user.id;
    if (sessionCookie) {
      sessionMap.set(sessionCookie, { userId, exp: now + SESSION_TTL });
      console.log("[c] session SET, size now:", sessionMap.size);
    }
  }

  // 2. Resolve Corsair client
  const cachedClient = clientMap.get(userId);
  if (cachedClient && cachedClient.exp > now) {
    console.log("[c] client HIT — Corsair internal caches intact");
    return cachedClient.client;
  }

  console.log("[c] client MISS — creating withTenant");
  const client = corsair.withTenant(userId);
  clientMap.set(userId, { client, exp: now + CLIENT_TTL });

  return client;
}

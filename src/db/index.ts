// src/db/index.ts
import { env } from "@/lib/env.config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const pool = new Pool({
  connectionString: env.DATABASE_URL!,
  max: 10,
  min: 2,
  idleTimeoutMillis: 60_000,
});

pool.on("connect", () => console.log("PG CONNECT"));
pool.on("acquire", () => console.log("PG ACQUIRE"));

export const db = drizzle({ client: pool, schema });


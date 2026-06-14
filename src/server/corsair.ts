import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { env } from "@/lib/env.config";
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(pool);

export const corsair = createCorsair({
    plugins: [gmail()],
    database: pool,
    kek: env.CORSAIR_KEK!,
    multiTenancy: true,
});

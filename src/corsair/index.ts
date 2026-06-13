import { createCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { db } from "@/db";
import { env } from "@/lib/env.config";

export const corsair = createCorsair({
    plugins: [
        gmail()
    ],

    database: db,
    multiTenancy: false,
    kek: env.CORSAIR_KEK!,
});
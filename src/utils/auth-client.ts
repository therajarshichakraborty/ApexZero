import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env.config";
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

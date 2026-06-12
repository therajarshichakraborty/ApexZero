import { betterAuth } from "better-auth";
import { env } from "@/lib/env.config";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID! as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET! as string,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID! as string,
      clientSecret: env.GITHUB_CLIENT_SECRET! as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    useSecureCookies: false,
  },
  plugins: [nextCookies()],
});

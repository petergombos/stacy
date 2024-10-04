import "dotenv/config";
import type { Config } from "drizzle-kit";
import { env } from "~/lib/env";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  driver: "turso",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;

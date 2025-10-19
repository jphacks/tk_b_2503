import { defineConfig } from "drizzle-kit";

import { env } from "./src/clients/env";

export default defineConfig({
  schema: "./src/libs/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});

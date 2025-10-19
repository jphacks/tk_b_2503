import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "#/clients/env";
import * as schema from "#/libs/drizzle/schema";

const sqlClient = createClient({
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(sqlClient, { schema });

export * from "#/libs/drizzle/schema";

import { createAuthClient } from "better-auth/client";

import { env } from "#/clients/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL
    ? env.NEXT_PUBLIC_BASE_URL
    : "http://localhost:3000",
  basePath: "/api/auth",
});

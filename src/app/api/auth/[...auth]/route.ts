import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "#/clients/auth/server";
import { ALLOWED_ORIGINS } from "#/libs/constants";

const isAllowed = (origin?: string) =>
  !!origin && ALLOWED_ORIGINS.includes(origin);

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
  Vary: "Origin",
});

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  if (!isAllowed(origin)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export const { GET, POST } = toNextJsHandler(auth.handler);

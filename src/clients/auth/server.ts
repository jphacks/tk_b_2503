import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "#/clients/db";
import { env } from "#/clients/env";
import { ALLOWED_ORIGINS } from "#/libs/constants";
import { account, session, user, verification } from "#/libs/drizzle/schema";

export const auth = betterAuth({
  appName: "Haru",
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  secret: env.BETTER_AUTH_SECRET,
  plugins: [nextCookies()],
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["line", "google"],
    },
  },
  socialProviders: {
    line: {
      clientId: env.LINE_CLIENT_ID,
      clientSecret: env.LINE_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: ALLOWED_ORIGINS,
});

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return session;
}

// mocking
// export async function getSession() {
//   return {
//     session: {
//       id: "mock-session-id",
//       userId: "mock-user-id",
//       expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
//     },
//     user: {
//       id: "WIBHTb8bMI94winlNKqXPZlFZ6YYuTa7",
//       name: "cp20",
//       email: "n.naoki.1587@gmail.com",
//     },
//   };
// }

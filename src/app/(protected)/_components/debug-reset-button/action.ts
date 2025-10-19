"use server";

import { eq } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db, user } from "#/clients/db";

export const resetLastReadTime = async () => {
  // セッション情報を取得
  const session = await getSession();

  // 既読日時を2024年1月1日に設定
  const resetDate = new Date("2024-01-01T00:00:00Z");

  await db
    .update(user)
    .set({
      lastReadAt: resetDate,
    })
    .where(eq(user.id, session.user.id));

  return true;
};

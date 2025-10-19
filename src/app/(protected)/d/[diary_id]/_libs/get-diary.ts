import "server-only";

import { eq } from "drizzle-orm";

import { db } from "#/clients/db";
import { diaries } from "#/libs/drizzle/schema";

export const getDiary = async (diaryId: string) => {
  const data = await db
    .select({
      id: diaries.id,
      title: diaries.title,
      backgroundColor: diaries.backgroundColor,
      authorId: diaries.authorId,
      createdAt: diaries.createdAt,
    })
    .from(diaries)
    .where(eq(diaries.id, diaryId))
    .limit(1);

  if (data.length === 0) {
    return null;
  }

  return data[0];
};

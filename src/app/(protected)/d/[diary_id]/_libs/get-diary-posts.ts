import "server-only";

import { eq } from "drizzle-orm";

import { db } from "#/clients/db";
import { posts } from "#/libs/drizzle/schema";

export const getDiaryPosts = async (diaryId: string) => {
  const data = await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      rawText: posts.rawText,
      textImage: posts.textImage,
      image: posts.image,
      diaryId: posts.diaryId,
      createdAt: posts.createdAt,
      deletedAt: posts.deletedAt,
    })
    .from(posts)
    .where(eq(posts.diaryId, diaryId));

  return data;
};

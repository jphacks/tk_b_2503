import "server-only";

import { eq, desc, and, isNull } from "drizzle-orm";

import { db } from "#/clients/db";
import { posts, user } from "#/libs/drizzle/schema";

export const getUserPosts = async (userId: string) => {
  const rows = await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      rawText: posts.rawText,
      textImage: posts.textImage,
      image: posts.image,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .where(
      and(
        eq(posts.authorId, userId),
        isNull(posts.deletedAt) // 削除されていない投稿のみ
      )
    )
    .orderBy(desc(posts.createdAt));

  return rows;
};

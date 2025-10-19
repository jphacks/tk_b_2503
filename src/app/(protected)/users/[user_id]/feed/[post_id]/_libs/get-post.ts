import "server-only";

import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/clients/db";
import { posts, user } from "#/libs/drizzle/schema";

export const getPost = async (postId: string) => {
  const data = await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
      rawText: posts.rawText,
      textImage: posts.textImage,
      createdAt: posts.createdAt,
      authorName: user.name,
      authorImage: user.image,
      image: posts.image,
    })
    .from(posts)
    .innerJoin(user, eq(posts.authorId, user.id))
    .where(
      and(
        eq(posts.id, postId),
        isNull(posts.deletedAt) // 削除されていない投稿のみ取得
      )
    )
    .limit(1);

  if (data.length === 0) {
    return null;
  }

  return data[0];
};

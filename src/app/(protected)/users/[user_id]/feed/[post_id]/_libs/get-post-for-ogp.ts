import "server-only";

import { eq } from "drizzle-orm";

import { db } from "#/clients/db";
import { posts, user } from "#/libs/drizzle/schema";

// OGP生成用の投稿情報取得（認証不要）
export const getPostForOgp = async (postId: string) => {
  try {
    const data = await db
      .select({
        id: posts.id,
        authorName: user.name,
        image: user.image,
        rawText: posts.rawText,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .innerJoin(user, eq(posts.authorId, user.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (data.length === 0) {
      return null;
    }

    return {
      id: data[0].id,
      authorName: data[0].authorName,
      authorImage: data[0].image,
      rawText: data[0].rawText,
      createdAt: data[0].createdAt,
    };
  } catch (_error) {
    return null;
  }
};

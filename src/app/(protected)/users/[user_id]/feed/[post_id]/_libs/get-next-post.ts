import "server-only";

import { eq, desc, inArray, lt, and, isNull } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { posts, follows } from "#/libs/drizzle/schema";

export const getNextPost = async (currentPostId: string) => {
  const session = await getSession();

  // 現在の投稿の作成時間を取得
  const currentPost = await db
    .select({ createdAt: posts.createdAt })
    .from(posts)
    .where(
      and(
        eq(posts.id, currentPostId),
        isNull(posts.deletedAt) // 削除されていない投稿のみ
      )
    )
    .limit(1);

  if (currentPost.length === 0) {
    return null;
  }

  // フォロー中のユーザーIDを取得
  const followingUsers = await db
    .select({ followeeId: follows.followeeId })
    .from(follows)
    .where(eq(follows.followerId, session.user.id));

  if (followingUsers.length === 0) {
    return null;
  }

  // 現在の投稿よりも古い投稿の中で最も新しい投稿を取得
  const nextPost = await db
    .select({
      id: posts.id,
      authorId: posts.authorId,
    })
    .from(posts)
    .where(
      and(
        inArray(
          posts.authorId,
          followingUsers.map((f) => f.followeeId)
        ),
        lt(posts.createdAt, currentPost[0].createdAt),
        isNull(posts.deletedAt) // 削除されていない投稿のみ
      )
    )
    .orderBy(desc(posts.createdAt))
    .limit(1);

  if (nextPost.length === 0) {
    return null;
  }

  return {
    postId: nextPost[0].id,
    userId: nextPost[0].authorId,
  };
};

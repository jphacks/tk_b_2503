import "server-only";

import { and, asc, eq, gt } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { follows, posts, user } from "#/libs/drizzle/schema";

type GetOldestUnreadPostParams = {
  userId: string;
};

export const getOldestUnreadPost = async ({
  userId,
}: GetOldestUnreadPostParams) => {
  // セッション情報を取得
  const session = await getSession();
  const currentUserId = session.user.id;

  // 対象ユーザーが存在するかチェック
  const targetUser = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (targetUser.length === 0) {
    return null;
  }

  // フォロー関係をチェック
  const followRelation = await db
    .select({ followerId: follows.followerId })
    .from(follows)
    .where(
      and(eq(follows.followerId, currentUserId), eq(follows.followeeId, userId))
    )
    .limit(1);

  if (followRelation.length === 0) {
    return null;
  }

  // 最後に読んだ投稿の時刻を取得
  const lastReadResult = await db
    .select({ lastReadAt: user.lastReadAt })
    .from(user)
    .where(eq(user.id, currentUserId))
    .limit(1);

  const lastReadAt =
    lastReadResult.length > 0 ? lastReadResult[0].lastReadAt : null;

  // 未読の投稿を取得（最古のものから）
  const unreadPosts = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.authorId, userId),
        lastReadAt ? gt(posts.createdAt, lastReadAt) : undefined
      )
    )
    .orderBy(asc(posts.createdAt))
    .limit(1);

  if (unreadPosts.length === 0) {
    return null;
  }

  return unreadPosts[0].id;
};

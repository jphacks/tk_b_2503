import "server-only";

import { eq, count, and } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { user, follows } from "#/libs/drizzle/schema";

export const getUserProfile = async (userId: string) => {
  const session = await getSession();

  // ユーザー情報を取得
  const userResult = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      bio: user.bio,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  const targetUser = userResult[0];
  if (!targetUser) {
    throw new Error("ユーザーが見つかりません");
  }

  // 現在のユーザーがこのユーザーをフォローしているかチェック
  const isFollowingResult = await db
    .select({ count: count() })
    .from(follows)
    .where(
      and(
        eq(follows.followerId, session.user.id),
        eq(follows.followeeId, userId)
      )
    );

  const isFollowing = (isFollowingResult[0]?.count || 0) > 0;
  const isOwnProfile = session.user.id === userId;

  return {
    ...targetUser,
    isFollowing,
    isOwnProfile,
  };
};

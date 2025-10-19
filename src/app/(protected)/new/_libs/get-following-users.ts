import "server-only";

import { eq, inArray } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { user, follows } from "#/libs/drizzle/schema";

export const getFollowingUsers = async () => {
  const session = await getSession();

  // 現在のユーザーがフォローしているユーザーIDの一覧を取得
  const followingRelations = await db
    .select({
      followeeId: follows.followeeId,
    })
    .from(follows)
    .where(eq(follows.followerId, session.user.id));

  if (followingRelations.length === 0) {
    return [];
  }

  // フォローしているユーザーの詳細情報を取得
  const followingUserIds = followingRelations.map((rel) => rel.followeeId);

  const followingUsers = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
    })
    .from(user)
    .where(inArray(user.id, followingUserIds));

  return followingUsers;
};

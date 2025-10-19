"use server";

import { and, eq } from "drizzle-orm";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { follows } from "#/libs/drizzle/schema";

export const followUser = async ({
  targetUserId,
}: {
  targetUserId: string;
}) => {
  const session = await getSession();

  await db.insert(follows).values({
    followerId: session.user.id,
    followeeId: targetUserId,
  });

  return true;
};

export const unfollowUser = async ({
  targetUserId,
}: {
  targetUserId: string;
}) => {
  const session = await getSession();

  await db
    .delete(follows)
    .where(
      and(
        eq(follows.followerId, session.user.id),
        eq(follows.followeeId, targetUserId)
      )
    );

  return true;
};

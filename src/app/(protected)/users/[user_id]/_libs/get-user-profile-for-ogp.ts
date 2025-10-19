import "server-only";

import { eq } from "drizzle-orm";

import { db } from "#/clients/db";
import { user } from "#/libs/drizzle/schema";

// OGP生成用のユーザー情報取得（認証不要）
export const getUserProfileForOgp = async (userId: string) => {
  try {
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
      return null;
    }

    return targetUser;
  } catch (_error) {
    return null;
  }
};

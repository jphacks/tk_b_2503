import "server-only";

import { eq } from "drizzle-orm";

import { db } from "#/clients/db";
import { posts, stickers, user } from "#/libs/drizzle/schema";

export const getDiaryStickers = async (diaryId: string) => {
  const data = await db
    .select({
      id: stickers.id,
      postId: stickers.postId,
      type: stickers.type,
      x: stickers.x,
      y: stickers.y,
      rotation: stickers.rotation,
      scale: stickers.scale,
      createdAt: stickers.createdAt,
      placedBy: {
        id: user.id,
        name: user.name,
      },
    })
    .from(stickers)
    .leftJoin(user, eq(stickers.placedBy, user.id))
    .innerJoin(posts, eq(stickers.postId, posts.id))
    .where(eq(posts.diaryId, diaryId));

  return data;
};

export type DiarySticker = Awaited<ReturnType<typeof getDiaryStickers>>[number];

import "server-only";

import { eq } from "drizzle-orm";

import { db } from "#/clients/db";
import { stickers, user } from "#/libs/drizzle/schema";

export async function getStickers(postId: string) {
  const result = await db
    .select({
      id: stickers.id,
      type: stickers.type,
      x: stickers.x,
      y: stickers.y,
      scale: stickers.scale,
      rotation: stickers.rotation,
      placedBy: {
        id: user.id,
        name: user.name,
      },
    })
    .from(stickers)
    .leftJoin(user, eq(stickers.placedBy, user.id))
    .where(eq(stickers.postId, postId))
    .orderBy(stickers.createdAt);

  return result;
}

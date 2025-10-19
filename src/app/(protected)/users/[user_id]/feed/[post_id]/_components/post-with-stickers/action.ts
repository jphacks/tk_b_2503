"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { actionClient } from "#/clients/action";
import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { posts, stickers, user } from "#/libs/drizzle/schema";

const AddStickerSchema = z.object({
  postId: z.string(),
  type: z.enum([
    "blob-blue",
    "blob-green",
    "burst-blue",
    "clover-green",
    "d-shape-purple",
    "star-sparkle",
    "swirl-coral",
    "uruuru",
    "gahahaha",
  ] as const),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  rotation: z.number().optional(),
});

export const addSticker = actionClient
  .inputSchema(AddStickerSchema)
  .action(async ({ parsedInput }) => {
    const session = await getSession();

    // ランダムな回転角度を生成 (-30度から30度の範囲)
    const rotation = parsedInput.rotation ?? (Math.random() - 0.5) * 60;

    // 固定スケール値
    const scale = 1.0;

    await db.insert(stickers).values({
      postId: parsedInput.postId,
      placedBy: session.user.id,
      type: parsedInput.type,
      x: parsedInput.x,
      y: parsedInput.y,
      scale,
      rotation,
    });

    return true;
  });

const MarkPostAsReadSchema = z.object({
  postId: z.string(),
});

export const markPostAsRead = actionClient
  .inputSchema(MarkPostAsReadSchema)
  .action(async ({ parsedInput }) => {
    // セッション情報を取得
    const session = await getSession();
    const userId = session.user.id;

    // 投稿の作成日時を取得するために、まず投稿情報を取得
    const postResult = await db
      .select({ createdAt: posts.createdAt })
      .from(posts)
      .where(eq(posts.id, parsedInput.postId))
      .limit(1);

    if (postResult.length === 0) {
      return false;
    }

    const postCreatedAt = postResult[0].createdAt;

    // 既読記録を更新または作成
    await db
      .update(user)
      .set({
        lastReadAt: postCreatedAt,
      })
      .where(eq(user.id, userId));

    return true;
  });

const GetStickersSchema = z.object({
  postId: z.string(),
});

export const getStickersAction = actionClient
  .inputSchema(GetStickersSchema)
  .action(async ({ parsedInput }) => {
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
      .where(eq(stickers.postId, parsedInput.postId))
      .orderBy(stickers.createdAt);

    return result;
  });

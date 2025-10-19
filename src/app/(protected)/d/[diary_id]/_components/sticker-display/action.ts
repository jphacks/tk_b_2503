"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { actionClient } from "#/clients/action";
import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { stickers } from "#/libs/drizzle/schema";

const DeleteStickerSchema = z.object({
  stickerId: z.string(),
});

export const deleteSticker = actionClient
  .inputSchema(DeleteStickerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await getSession();

      // 自分が貼ったステッカーのみ削除可能
      await db
        .delete(stickers)
        .where(
          and(
            eq(stickers.id, parsedInput.stickerId),
            eq(stickers.placedBy, session.user.id)
          )
        );

      return {
        success: true,
        data: undefined,
      } as const;
    } catch (error) {
      console.error("ステッカー削除エラー:", error);

      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "入力データが不正です",
        };
      }

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "ステッカーの削除に失敗しました",
      } as const;
    }
  });

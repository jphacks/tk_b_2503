"use server";

import { redirect } from "next/navigation";

import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { actionClient } from "#/clients/action";
import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { posts } from "#/libs/drizzle/schema";

const DeletePostSchema = z.object({
  postId: z.string(),
});

export const deletePost = actionClient
  .inputSchema(DeletePostSchema)
  .action(async ({ parsedInput }) => {
    const session = await getSession();
    const userId = session.user.id;

    await db.transaction(async (tx) => {
      const postResult = await tx
        .select({
          id: posts.id,
          authorId: posts.authorId,
          deletedAt: posts.deletedAt,
        })
        .from(posts)
        .where(and(eq(posts.id, parsedInput.postId), isNull(posts.deletedAt)))
        .limit(1);

      if (postResult.length === 0) {
        throw new Error("投稿が見つかりません");
      }

      const post = postResult[0];

      if (post.authorId !== userId) {
        throw new Error("この投稿を削除する権限がありません");
      }

      await tx
        .update(posts)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(posts.id, parsedInput.postId));
    });

    redirect(`/users/${userId}`);
  });

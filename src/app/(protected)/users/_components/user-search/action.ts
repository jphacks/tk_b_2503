"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { actionClient } from "#/clients/action";
import { db } from "#/clients/db";
import { user } from "#/libs/drizzle/schema";

const SearchUserSchema = z.object({
  searchQuery: z.string().min(1, "ユーザー名を入力してください").trim(),
});

export const searchUserAction = actionClient
  .inputSchema(SearchUserSchema)
  .action(async ({ parsedInput: { searchQuery } }) => {
    // ユーザー名で完全一致検索
    const userResult = await db
      .select({ id: user.id, name: user.name })
      .from(user)
      .where(eq(user.name, searchQuery))
      .limit(1);

    if (userResult.length === 0) {
      return null;
    }

    // 成功時はユーザーIDを返す
    return userResult[0].id;
  });

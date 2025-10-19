"use server";

import { z } from "zod";

import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { diaries, diaryMembers } from "#/libs/drizzle/schema";

const CreateDiarySchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  backgroundColor: z.enum([
    "FF4548",
    "FD785B",
    "FDB51C",
    "27A157",
    "0A74A2",
    "B563BC",
  ]),
  memberIds: z.array(z.string()),
});

type CreateDiaryResult = {
  success: boolean;
  diaryId?: string;
  authorId?: string;
  error?: string;
};

export async function createDiary(
  data: z.infer<typeof CreateDiarySchema>
): Promise<CreateDiaryResult> {
  try {
    // 入力値のバリデーション
    const validatedData = CreateDiarySchema.parse(data);

    // セッション確認
    const session = await getSession();
    const authorId = session.user.id;

    console.log("作成データ:", {
      title: validatedData.title,
      backgroundColor: validatedData.backgroundColor,
      authorId,
    });

    // 1. diariesテーブルに新しい日記帳を作成（トランザクションを一時的に使わない）
    const [newDiary] = await db
      .insert(diaries)
      .values({
        title: validatedData.title,
        backgroundColor: validatedData.backgroundColor,
        authorId,
      })
      .returning();

    if (!newDiary) {
      throw new Error("日記帳の作成に失敗しました");
    }

    console.log("作成されたDiary:", newDiary);

    // 2. diaryMembersテーブルに作成者を追加
    const membersToInsert = [
      {
        diaryId: newDiary.id,
        memberId: authorId, // 作成者自身を必ず追加
      },
      ...validatedData.memberIds.map((memberId) => ({
        diaryId: newDiary.id,
        memberId,
      })),
    ];

    // 重複を除去（作成者が自分自身を選択した場合）
    const uniqueMembers = membersToInsert.filter(
      (member, index, self) =>
        index === self.findIndex((m) => m.memberId === member.memberId)
    );

    // メンバーを一括挿入
    if (uniqueMembers.length > 0) {
      console.log("挿入するメンバー:", uniqueMembers);
      await db.insert(diaryMembers).values(uniqueMembers);
    }

    return {
      success: true,
      diaryId: newDiary.id,
      authorId,
    };
  } catch (error) {
    console.error("日記帳作成エラー - 詳細:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "入力値が不正です",
      };
    }

    // エラーメッセージを詳しく返す
    const errorMessage =
      error instanceof Error ? error.message : "日記帳の作成に失敗しました";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

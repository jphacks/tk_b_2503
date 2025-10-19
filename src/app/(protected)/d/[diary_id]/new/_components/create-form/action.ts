"use server";

import { redirect } from "next/navigation";

import { z } from "zod";

import { actionClient } from "#/clients/action";
import { getSession } from "#/clients/auth/server";
import { db, posts } from "#/clients/db";
import { uploadFile } from "#/clients/storage";

const MAX_LENGTH_WITHOUT_IMAGE = 220;
const MAX_LENGTH_WITH_IMAGE = 120;

const CreatePostWithFilesSchema = z
  .object({
    diaryId: z.string(),
    rawText: z
      .string()
      .transform((value) => value.trim())
      .refine((value) => value !== "", {
        message: "本文を入力してください",
      }),
    textImage: z.instanceof(File),
    mediaImage: z.instanceof(File).optional(),
  })
  .superRefine((value, ctx) => {
    const characterCount = [...value.rawText].length;

    if (value.mediaImage) {
      if (characterCount > MAX_LENGTH_WITH_IMAGE) {
        ctx.addIssue({
          code: "too_big",
          type: "string",
          maximum: MAX_LENGTH_WITH_IMAGE,
          inclusive: true,
          origin: "string",
          message: `画像ありの場合は${MAX_LENGTH_WITH_IMAGE}文字以内で入力してください`,
          path: ["rawText"],
        });
      }
      return;
    }

    if (characterCount > MAX_LENGTH_WITHOUT_IMAGE) {
      ctx.addIssue({
        code: "too_big",
        type: "string",
        maximum: MAX_LENGTH_WITHOUT_IMAGE,
        inclusive: true,
        origin: "string",
        message: `画像なしの場合は${MAX_LENGTH_WITHOUT_IMAGE}文字以内で入力してください`,
        path: ["rawText"],
      });
    }
  });

export const createPostAndRedirect = actionClient
  .inputSchema(CreatePostWithFilesSchema)
  .action(async ({ parsedInput }) => {
    const session = await getSession();

    // テキスト画像をアップロード
    const textImageKey = `text-image/${session.user.id}/${Date.now()}.${parsedInput.textImage.name.split(".")[1]}`;
    const textImageUrl = await uploadFile(textImageKey, parsedInput.textImage);

    // メディア画像をアップロード
    let mediaKey: string | null = null;
    let mediaUrl: string | null = null;
    if (parsedInput.mediaImage) {
      mediaKey = `media-image/${session.user.id}/${Date.now()}.${parsedInput.mediaImage.name.split(".")[1]}`;
      mediaUrl = await uploadFile(mediaKey, parsedInput.mediaImage);
    }

    // 投稿をデータベースに保存
    const [inserted] = await db
      .insert(posts)
      .values({
        diaryId: parsedInput.diaryId,
        authorId: session.user.id,
        rawText: parsedInput.rawText,
        textImage: textImageUrl,
        image: mediaUrl,
      })
      .returning();

    if (!inserted) {
      throw new Error("投稿の保存に失敗しました");
    }

    redirect(`/d/${inserted.diaryId}`);
  });

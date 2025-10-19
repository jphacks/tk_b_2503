"use server";

import { headers } from "next/headers";

import { z } from "zod";

import { actionClient } from "#/clients/action";
import { auth } from "#/clients/auth/server";

const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "現在のパスワードを入力してください"),
  newPassword: z
    .string()
    .min(6, "新しいパスワードは6文字以上で入力してください"),
});

export const updatePassword = actionClient
  .inputSchema(UpdatePasswordSchema)
  .action(async ({ parsedInput }) => {
    const result = await auth.api.changePassword({
      body: {
        currentPassword: parsedInput.currentPassword,
        newPassword: parsedInput.newPassword,
      },
      headers: await headers(),
    });

    if (!result) {
      return false;
    }

    return true;
  });

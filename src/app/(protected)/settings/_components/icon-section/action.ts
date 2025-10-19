"use server";

import { eq } from "drizzle-orm";
import z from "zod";

import { actionClient } from "#/clients/action";
import { getSession } from "#/clients/auth/server";
import { db } from "#/clients/db";
import { uploadFile } from "#/clients/storage";
import { user } from "#/libs/drizzle/schema";

const UpdateIconSchema = z.object({
  icon: z.instanceof(File),
});

export const updateIcon = actionClient
  .inputSchema(UpdateIconSchema)
  .action(async ({ parsedInput }) => {
    const session = await getSession();

    const file = parsedInput.icon;

    const fileBuffer = await file.arrayBuffer();
    const blob = new Blob([new Uint8Array(fileBuffer)], {
      type: file.type || "image/png",
    });

    const ext = (file.type && file.type.split("/")[1]) || "png";
    const key = `icons/${session.user.id}/${Date.now()}.${ext}`;

    const url = await uploadFile(key, blob);

    await db
      .update(user)
      .set({ image: url })
      .where(eq(user.id, session.user.id));

    return true;
  });

"use server";

import { createApiToken, invalidateApiToken } from "@/lib/models/api-token";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createApiTokenAction = actionClient
  .schema(z.object({ projectId: z.string() }))
  .action(async ({ parsedInput: { projectId } }) => {
    const token = await createApiToken(projectId);
    revalidatePath("/");
    return { token };
  });

export const invalidateApiTokenAction = actionClient
  .schema(z.object({ token: z.string() }))
  .action(async ({ parsedInput: { token } }) => {
    await invalidateApiToken(token);
    revalidatePath("/");
    return { success: true };
  });

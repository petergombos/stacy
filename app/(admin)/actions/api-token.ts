"use server";

import {
  createApiToken,
  getToken,
  invalidateApiToken,
} from "@/lib/models/api-token";
import { requireProjectAccess } from "@/lib/models/project";
import { authActionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createApiTokenAction = authActionClient
  .schema(z.object({ projectId: z.string() }))
  .action(async ({ parsedInput: { projectId }, ctx: { userId } }) => {
    await requireProjectAccess(projectId, userId);
    const token = await createApiToken(projectId);
    revalidatePath("/");
    return { token };
  });

export const invalidateApiTokenAction = authActionClient
  .schema(z.object({ token: z.string() }))
  .action(async ({ parsedInput: { token }, ctx: { userId } }) => {
    const { projectId } = await getToken(token);
    await requireProjectAccess(projectId, userId);
    await invalidateApiToken(token);
    revalidatePath("/");
    return { success: true };
  });

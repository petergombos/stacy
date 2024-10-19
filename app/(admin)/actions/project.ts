"use server";

import {
  createProject,
  requireProjectAccess,
  updateProject,
} from "@/lib/models/project";
import { authActionClient } from "@/lib/safe-action";
import { projectUpsertFormSchema } from "@/schemas/project";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createProjectAction = authActionClient
  .schema(projectUpsertFormSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const result = await createProject({ ...parsedInput, userId });
    revalidatePath("/");
    return result;
  });

export const updateProjectAction = authActionClient
  .schema(projectUpsertFormSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...projectData } = parsedInput;
    await requireProjectAccess(id, userId);
    const result = await updateProject(id, projectData);
    revalidatePath("/");
    return result;
  });

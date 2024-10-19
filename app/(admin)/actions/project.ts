"use server";

import {
  createProject,
  requireProjectAccess,
  updateProject,
} from "@/lib/models/project";
import { authActionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(3).max(100),
  niche: z.string().min(3).max(100),
  shortDescription: z.string().min(3).max(155),
  fullContext: z.string().min(100),
});

export const createProjectAction = authActionClient
  .schema(projectSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const result = await createProject({ ...parsedInput, userId });
    revalidatePath("/");
    return result;
  });

export const updateProjectAction = authActionClient
  .schema(projectSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { id, ...projectData } = parsedInput;
    await requireProjectAccess(id, userId);
    const result = await updateProject(id, projectData);
    revalidatePath("/");
    return result;
  });

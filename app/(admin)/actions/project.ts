"use server";

import { createProject, updateProject } from "@/lib/models/project";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(3).max(100),
  niche: z.string().min(3).max(100),
  shortDescription: z.string().min(3).max(155),
  fullContext: z.string().min(100),
});

export const createProjectAction = actionClient
  .schema(projectSchema)
  .action(async ({ parsedInput }) => {
    const result = await createProject(parsedInput);
    revalidatePath("/");
    return result;
  });

export const updateProjectAction = actionClient
  .schema(projectSchema.extend({ id: z.string() }))
  .action(async ({ parsedInput }) => {
    const { id, ...projectData } = parsedInput;
    const result = await updateProject(id, projectData);
    revalidatePath("/");
    return result;
  });

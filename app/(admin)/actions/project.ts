"use server";

import { createProject } from "@/lib/models/project";
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
